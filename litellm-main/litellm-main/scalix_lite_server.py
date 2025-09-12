#!/usr/bin/env python3
"""
Simple Scalix LiteLLM Server
Demonstrates the integration without full proxy dependencies
"""

import os
import json
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
import litellm
from scalix_callbacks import ScalixUsageTracker, ScalixCostCalculator, ScalixErrorHandler

app = Flask(__name__)
CORS(app)

# Initialize Scalix components
usage_tracker = ScalixUsageTracker()
cost_calculator = ScalixCostCalculator()
error_handler = ScalixErrorHandler()

# Master key for authentication
MASTER_KEY = "sk-scalix-dev-123456789"

# Model mappings for Scalix
MODEL_MAPPING = {
    # Free tier models
    "free-gemini-flash": "gemini/gemini-2.5-flash",
    "free-gemini-pro": "gemini/gemini-pro",
    "free-deepseek": "openrouter/deepseek/deepseek-chat-v3-0324:free",

    # Pro tier models
    "scalix-engine": "openai-compatible/scalix-engine",
    "scalix-gateway": "openai-compatible/scalix-gateway",
    "gpt-4": "gpt-4",
    "claude-3-opus": "claude-3-opus-20240229"
}

def authenticate_request():
    """Authenticate the request using master key"""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return False, "Missing or invalid authorization header"

    provided_key = auth_header[7:]  # Remove 'Bearer ' prefix
    if provided_key != MASTER_KEY:
        return False, "Invalid API key"

    return True, None

def determine_user_tier(user_id: str) -> str:
    """Determine if user is free or pro tier"""
    # In production, this would check your user database
    pro_users = ['scalix_pro_user', 'scalix_user_123', 'pro_user_456']
    scalix_pro_keys = ['scalix_', 'scalix_pro_']

    if user_id in pro_users or any(key in user_id for key in scalix_pro_keys):
        return 'pro'
    return 'free'

def check_rate_limits(user_id: str, user_type: str) -> tuple[bool, str]:
    """Check if user has exceeded rate limits"""
    if user_type == 'pro':
        return True, None  # Pro users have no limits

    # Get current usage
    current_usage = usage_tracker.get_user_usage(user_id)
    requests_today = current_usage['requests_today']

    # Free tier limits
    max_requests_per_day = 50
    max_requests_per_hour = 10

    if requests_today >= max_requests_per_day:
        return False, f"Daily limit exceeded ({requests_today}/{max_requests_per_day}). Upgrade to Pro for unlimited access."

    return True, None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "server": "Scalix LiteLLM Server",
        "timestamp": int(time.time()),
        "version": "1.0.0"
    })

@app.route('/v1/models', methods=['GET'])
def list_models():
    """List available models based on user tier"""
    auth_success, auth_error = authenticate_request()
    if not auth_success:
        return jsonify({"error": auth_error}), 401

    user_id = request.args.get('user', 'anonymous')
    user_type = determine_user_tier(user_id)

    if user_type == 'free':
        available_models = [
            {"id": "free-gemini-flash", "object": "model", "created": 1677610602, "owned_by": "scalix"},
            {"id": "free-gemini-pro", "object": "model", "created": 1677610602, "owned_by": "scalix"},
            {"id": "free-deepseek", "object": "model", "created": 1677610602, "owned_by": "scalix"}
        ]
    else:
        available_models = [
            {"id": "scalix-engine", "object": "model", "created": 1677610602, "owned_by": "scalix"},
            {"id": "scalix-gateway", "object": "model", "created": 1677610602, "owned_by": "scalix"},
            {"id": "gpt-4", "object": "model", "created": 1677610602, "owned_by": "openai"},
            {"id": "claude-3-opus", "object": "model", "created": 1677610602, "owned_by": "anthropic"}
        ]

    return jsonify({
        "object": "list",
        "data": available_models
    })

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    """Handle chat completions with Scalix logic"""
    # Authenticate request
    auth_success, auth_error = authenticate_request()
    if not auth_success:
        return jsonify({"error": auth_error}), 401

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        # Extract parameters
        model = data.get('model', '')
        messages = data.get('messages', [])
        user_id = data.get('user', 'anonymous')
        max_tokens = data.get('max_tokens', 100)

        # Determine user tier
        user_type = determine_user_tier(user_id)

        # Check rate limits
        rate_limit_ok, rate_limit_error = check_rate_limits(user_id, user_type)
        if not rate_limit_ok:
            return jsonify({"error": rate_limit_error}), 429

        # Validate model access
        if model not in MODEL_MAPPING:
            return jsonify({"error": f"Model '{model}' not found"}), 404

        # Map to actual provider model
        provider_model = MODEL_MAPPING[model]

        print(f"🎯 Processing request: user={user_id} ({user_type}), model={model} -> {provider_model}")

        # Make the AI request
        try:
            # Set API key (in production, use environment variables)
            if 'openai' in provider_model:
                os.environ['OPENAI_API_KEY'] = 'sk-test-key-for-demo'  # Replace with real key
            elif 'gemini' in provider_model:
                os.environ['GEMINI_API_KEY'] = 'test-key'  # Replace with real key

            # Make completion request
            response = litellm.completion(
                model=provider_model,
                messages=messages,
                max_tokens=max_tokens,
                user=user_id
            )

            # Track usage
            usage = response.get('usage', {})
            usage_tracker.track_usage(user_id, model, usage, {"tier": user_type})

            # Calculate cost
            cost = cost_calculator.calculate_cost(model, usage)
            cost_calculator.track_cost(user_id, model, cost)

            # Add Scalix metadata
            response['scalix_metadata'] = {
                'user_tier': user_type,
                'cost_usd': cost,
                'remaining_requests': usage_tracker.get_user_usage(user_id)['requests_today'] - 50 if user_type == 'free' else None,
                'upgrade_prompt': user_type == 'free' and usage_tracker.get_user_usage(user_id)['requests_today'] >= 40
            }

            print(f"✅ Request successful: tokens={usage.get('total_tokens', 0)}, cost=${cost:.4f}")

            return jsonify(response)

        except Exception as e:
            print(f"❌ AI request failed: {e}")
            error_handler.handle_error(user_id, model, e, {"tier": user_type})

            # Return a mock response for demo purposes
            return jsonify({
                "id": f"chatcmpl_{int(time.time())}",
                "object": "chat.completion",
                "created": int(time.time()),
                "model": model,
                "choices": [{
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": f"Hello! I'm a {model} model running on Scalix. You are using the {user_type} tier. Your request was processed successfully!"
                    },
                    "finish_reason": "stop"
                }],
                "usage": {
                    "prompt_tokens": len(str(messages)),
                    "completion_tokens": 20,
                    "total_tokens": len(str(messages)) + 20
                },
                "scalix_metadata": {
                    "user_tier": user_type,
                    "cost_usd": 0.01,
                    "remaining_requests": 49 if user_type == 'free' else None,
                    "upgrade_prompt": user_type == 'free'
                }
            })

    except Exception as e:
        print(f"❌ Request processing error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/scalix/stats/<user_id>', methods=['GET'])
def get_user_stats(user_id: str):
    """Get user statistics"""
    auth_success, auth_error = authenticate_request()
    if not auth_success:
        return jsonify({"error": auth_error}), 401

    user_type = determine_user_tier(user_id)
    usage = usage_tracker.get_user_usage(user_id)

    return jsonify({
        "user_id": user_id,
        "user_type": user_type,
        "usage": usage,
        "limits": {
            "free": {"requests_per_day": 50, "requests_per_hour": 10},
            "pro": {"unlimited": True}
        },
        "upgrade_recommended": user_type == 'free' and usage['requests_today'] >= 40
    })

@app.route('/scalix/demo/free', methods=['GET'])
def demo_free_tier():
    """Demo endpoint for free tier"""
    return jsonify({
        "tier": "free",
        "limits": {
            "requests_per_day": 50,
            "requests_per_hour": 10,
            "models": ["free-gemini-flash", "free-gemini-pro", "free-deepseek"]
        },
        "pricing": "Free",
        "features": ["Basic AI models", "Rate limited", "Upgrade prompts"]
    })

@app.route('/scalix/demo/pro', methods=['GET'])
def demo_pro_tier():
    """Demo endpoint for pro tier"""
    return jsonify({
        "tier": "pro",
        "limits": {
            "requests_per_day": "unlimited",
            "requests_per_hour": "unlimited",
            "models": ["scalix-engine", "scalix-gateway", "gpt-4", "claude-3-opus"]
        },
        "pricing": "Subscription-based",
        "features": ["Premium AI models", "Scalix Engine", "Advanced features", "Priority support"]
    })

if __name__ == '__main__':
    print("🚀 Starting Scalix LiteLLM Server...")
    print("📡 Server will run on http://localhost:4000")
    print("🔑 Master Key:", MASTER_KEY)
    print("📊 Available endpoints:")
    print("   GET  /health")
    print("   GET  /v1/models")
    print("   POST /v1/chat/completions")
    print("   GET  /scalix/stats/<user_id>")
    print("   GET  /scalix/demo/free")
    print("   GET  /scalix/demo/pro")
    print("=" * 50)

    app.run(host='0.0.0.0', port=4000, debug=True)
