#!/usr/bin/env python3
"""
Mock LiteLLM Server for Testing Scalix Integration
This provides basic API endpoints that scalix.world expects
"""

import json
import time
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Mock data
MOCK_ANALYTICS = {
    "total_users": 15420,
    "active_users": 8920,
    "total_requests": 2847390,
    "total_cost": 12450.80,
    "cost_savings": 3120.50,
    "avg_response_time": 1.2,
    "user_tiers": {
        "free": 12850,
        "pro": 2470,
        "enterprise": 100
    },
    "top_models": [
        {
            "name": "GPT-4",
            "requests": 892340,
            "cost": 4250.30,
            "change": 12.5
        },
        {
            "name": "Claude 3 Opus",
            "requests": 654210,
            "cost": 2890.40,
            "change": 8.3
        },
        {
            "name": "Gemini Pro",
            "requests": 543890,
            "cost": 1240.20,
            "change": -2.1
        }
    ]
}

MOCK_MODELS = [
    {
        "id": "gpt-4",
        "object": "model",
        "created": int(time.time()),
        "owned_by": "openai",
        "permission": [],
        "root": "gpt-4",
        "parent": None
    },
    {
        "id": "claude-3-opus-20240229",
        "object": "model",
        "created": int(time.time()),
        "owned_by": "anthropic",
        "permission": [],
        "root": "claude-3-opus",
        "parent": None
    },
    {
        "id": "gemini-pro",
        "object": "model",
        "created": int(time.time()),
        "owned_by": "google",
        "permission": [],
        "root": "gemini-pro",
        "parent": None
    }
]

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "mock-1.0.0"
    })

@app.route('/v1/models', methods=['GET'])
def list_models():
    """List available models"""
    return jsonify({
        "object": "list",
        "data": MOCK_MODELS
    })

@app.route('/v1/analytics', methods=['GET'])
def get_analytics():
    """Get analytics data"""
    return jsonify(MOCK_ANALYTICS)

@app.route('/v1/usage', methods=['GET'])
def get_usage():
    """Get usage statistics"""
    user_id = request.args.get('user_id', 'default_user')
    return jsonify({
        "user_id": user_id,
        "requests_today": 15,
        "tokens_used": 240,
        "remaining_requests": 35,
        "billing_period": {
            "start": (datetime.utcnow() - timedelta(days=30)).isoformat(),
            "end": datetime.utcnow().isoformat()
        }
    })

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    """Mock chat completions endpoint"""
    data = request.get_json()

    # Simple mock response
    model = data.get('model', 'gpt-3.5-turbo')
    messages = data.get('messages', [])
    user_content = ""

    # Extract user message
    for msg in messages:
        if msg.get('role') == 'user':
            user_content = msg.get('content', '')
            break

    # Generate mock response
    if 'hello' in user_content.lower():
        response_content = "Hello! I'm a mock AI assistant powered by LiteLLM. How can I help you today?"
    elif 'scalix' in user_content.lower():
        response_content = "Scalix is an amazing AI-powered development platform! It combines local processing with cloud AI capabilities for the best of both worlds."
    else:
        response_content = f"I received your message: '{user_content}'. This is a mock response from {model}."

    return jsonify({
        "id": f"chatcmpl-mock-{int(time.time())}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": model,
        "choices": [{
            "index": 0,
            "message": {
                "role": "assistant",
                "content": response_content
            },
            "finish_reason": "stop"
        }],
        "usage": {
            "prompt_tokens": len(user_content.split()),
            "completion_tokens": len(response_content.split()),
            "total_tokens": len(user_content.split()) + len(response_content.split())
        }
    })

@app.route('/v1/smart-context', methods=['POST'])
def smart_context():
    """Mock smart context endpoint"""
    data = request.get_json()
    query = data.get('query', '')
    files = data.get('project_files', [])

    return jsonify({
        "query": query,
        "relevant_files": files[:3],  # Return first 3 files as "relevant"
        "context_score": 0.85,
        "processing_time": 1.2,
        "total_files_analyzed": len(files)
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": {
            "message": "Endpoint not found",
            "type": "invalid_request_error",
            "code": 404
        }
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "error": {
            "message": "Internal server error",
            "type": "internal_error",
            "code": 500
        }
    }), 500

if __name__ == '__main__':
    print("🚀 Starting Mock LiteLLM Server...")
    print("📡 Server will be available at: http://localhost:4000")
    print("🔑 No authentication required for testing")
    print("📊 Mock analytics available at: http://localhost:4000/v1/analytics")
    print("🤖 Mock AI completions at: http://localhost:4000/v1/chat/completions")
    print("")
    print("Press Ctrl+C to stop the server")
    print("=" * 50)

    app.run(
        host='127.0.0.1',
        port=4000,
        debug=True,
        use_reloader=False
    )
