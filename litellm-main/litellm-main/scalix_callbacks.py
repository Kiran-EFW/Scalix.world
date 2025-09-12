#!/usr/bin/env python3
"""
Scalix Custom Callbacks for LiteLLM
Handles user tier management, usage tracking, and cost calculation
"""

import os
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import redis
import sqlite3
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ScalixUsageTracker:
    """Tracks usage for both free and pro users"""

    def __init__(self):
        self.redis_client = redis.Redis(
            host=os.getenv('REDIS_HOST', 'localhost'),
            port=int(os.getenv('REDIS_PORT', 6379)),
            decode_responses=True
        )

        # Initialize SQLite for persistent storage
        self.db_path = Path('./scalix_usage.db')
        self._init_database()

    def _init_database(self):
        """Initialize SQLite database for usage tracking"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS user_usage (
                    user_id TEXT PRIMARY KEY,
                    tier TEXT NOT NULL,
                    requests_today INTEGER DEFAULT 0,
                    tokens_today INTEGER DEFAULT 0,
                    requests_this_hour INTEGER DEFAULT 0,
                    last_request TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            conn.commit()

    def track_usage(self, user_id: str, model: str, usage: Dict[str, Any], metadata: Dict[str, Any]):
        """Track usage for a user"""
        try:
            # Determine user tier
            tier = self._determine_user_tier(user_id, metadata)

            # Get usage data
            tokens_used = usage.get('total_tokens', 0)
            requests_made = 1

            # Update Redis (fast access)
            self._update_redis_usage(user_id, tier, tokens_used, requests_made)

            # Update SQLite (persistent storage)
            self._update_sqlite_usage(user_id, tier, tokens_used, requests_made)

            # Check limits and upgrade prompts
            self._check_limits_and_prompts(user_id, tier)

            logger.info(f"Tracked usage: user={user_id}, tier={tier}, tokens={tokens_used}, model={model}")

        except Exception as e:
            logger.error(f"Error tracking usage for user {user_id}: {e}")

    def _determine_user_tier(self, user_id: str, metadata: Dict[str, Any]) -> str:
        """Determine user's tier based on metadata and stored data"""
        # Check if it's a Scalix Pro user
        if metadata.get('scalix_pro', False) or user_id.startswith('scalix_'):
            return 'pro'

        # Check if it's explicitly marked as free
        if metadata.get('tier') == 'free':
            return 'free'

        # Default to free tier
        return 'free'

    def _update_redis_usage(self, user_id: str, tier: str, tokens: int, requests: int):
        """Update Redis with current usage"""
        now = datetime.now()
        hour_key = f"user:{user_id}:hour:{now.hour}"
        day_key = f"user:{user_id}:day:{now.date()}"

        # Update hourly usage
        self.redis_client.incrby(hour_key, requests)
        self.redis_client.expire(hour_key, 3600)  # 1 hour

        # Update daily usage
        self.redis_client.incrby(day_key, requests)
        self.redis_client.expire(day_key, 86400)  # 24 hours

        # Update token usage
        tokens_key = f"user:{user_id}:tokens:{now.date()}"
        self.redis_client.incrby(tokens_key, tokens)
        self.redis_client.expire(tokens_key, 86400)

    def _update_sqlite_usage(self, user_id: str, tier: str, tokens: int, requests: int):
        """Update SQLite with persistent usage data"""
        with sqlite3.connect(self.db_path) as conn:
            # Insert or update user record
            conn.execute('''
                INSERT INTO user_usage (user_id, tier, requests_today, tokens_today, last_request)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    requests_today = requests_today + ?,
                    tokens_today = tokens_today + ?,
                    last_request = ?
            ''', (user_id, tier, requests, tokens, datetime.now(),
                  requests, tokens, datetime.now()))
            conn.commit()

    def _check_limits_and_prompts(self, user_id: str, tier: str):
        """Check usage limits and trigger upgrade prompts"""
        limits = self._get_tier_limits(tier)
        current_usage = self.get_user_usage(user_id)

        # Check if user is approaching limits
        if current_usage['requests_today'] >= limits['requests_per_day'] * 0.8:
            self._trigger_upgrade_prompt(user_id, 'daily_limit_approaching')

        if current_usage['tokens_today'] >= limits['tokens_per_day'] * 0.8:
            self._trigger_upgrade_prompt(user_id, 'token_limit_approaching')

    def _get_tier_limits(self, tier: str) -> Dict[str, int]:
        """Get limits for a specific tier"""
        limits = {
            'free': {
                'requests_per_hour': 10,
                'requests_per_day': 50,
                'tokens_per_day': 10000
            },
            'pro': {
                'requests_per_hour': 100,
                'requests_per_day': 1000,
                'tokens_per_day': 100000
            }
        }
        return limits.get(tier, limits['free'])

    def get_user_usage(self, user_id: str) -> Dict[str, int]:
        """Get current usage for a user"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute('''
                SELECT requests_today, tokens_today, requests_this_hour
                FROM user_usage
                WHERE user_id = ?
            ''', (user_id,))

            row = cursor.fetchone()
            if row:
                return {
                    'requests_today': row[0],
                    'tokens_today': row[1],
                    'requests_this_hour': row[2]
                }

        return {'requests_today': 0, 'tokens_today': 0, 'requests_this_hour': 0}

    def _trigger_upgrade_prompt(self, user_id: str, reason: str):
        """Trigger upgrade prompt for user"""
        # Store upgrade prompt in Redis
        prompt_key = f"upgrade_prompt:{user_id}"
        self.redis_client.setex(prompt_key, 3600, reason)  # Expires in 1 hour

        logger.info(f"Upgrade prompt triggered for user {user_id}: {reason}")


class ScalixCostCalculator:
    """Calculate costs for different models and tiers"""

    def __init__(self):
        # Cost per 1K tokens (in USD)
        self.cost_matrix = {
            # Free tier models (no cost to user)
            'free-gemini-flash': 0.0,
            'free-gemini-pro': 0.0,
            'free-deepseek-chat': 0.0,
            'free-wizardlm': 0.0,

            # Pro tier models (Scalix pricing)
            'scalix-engine': 0.02,    # $0.02 per 1K tokens
            'scalix-gateway': 0.015,  # $0.015 per 1K tokens

            # Premium models (standard pricing)
            'gpt-4': 0.03,
            'gpt-4-turbo': 0.01,
            'claude-3-opus': 0.015,
            'claude-3-sonnet': 0.002,
            'gemini-pro': 0.005
        }

    def calculate_cost(self, model: str, usage: Dict[str, Any]) -> float:
        """Calculate cost for a specific request"""
        tokens_used = usage.get('total_tokens', 0)
        cost_per_1k = self.cost_matrix.get(model, 0.01)  # Default fallback

        # Calculate cost in USD
        cost = (tokens_used / 1000) * cost_per_1k

        logger.info(f"Calculated cost: model={model}, tokens={tokens_used}, cost=${cost:.4f}")
        return cost

    def track_cost(self, user_id: str, model: str, cost: float):
        """Track accumulated costs for user"""
        # Store in Redis for quick access
        cost_key = f"user_cost:{user_id}:{datetime.now().date()}"
        redis_client = redis.Redis(decode_responses=True)
        redis_client.incrbyfloat(cost_key, cost)
        redis_client.expire(cost_key, 86400 * 30)  # Keep for 30 days


class ScalixErrorHandler:
    """Handle and categorize errors for Scalix users"""

    def handle_error(self, user_id: str, model: str, error: Exception, metadata: Dict[str, Any]):
        """Handle different types of errors"""
        error_type = self._categorize_error(error)

        # Log error with context
        logger.error(f"Scalix error: user={user_id}, model={model}, type={error_type}, error={str(error)}")

        # Store error for analytics
        self._store_error(user_id, model, error_type, str(error))

        # Handle specific error types
        if error_type == 'rate_limit':
            self._handle_rate_limit_error(user_id)
        elif error_type == 'quota_exceeded':
            self._handle_quota_error(user_id)
        elif error_type == 'model_unavailable':
            self._handle_model_unavailable_error(user_id, model)

    def _categorize_error(self, error: Exception) -> str:
        """Categorize error type for better handling"""
        error_msg = str(error).lower()

        if 'rate limit' in error_msg or '429' in error_msg:
            return 'rate_limit'
        elif 'quota' in error_msg or 'insufficient' in error_msg:
            return 'quota_exceeded'
        elif 'model' in error_msg and ('not found' in error_msg or 'unavailable' in error_msg):
            return 'model_unavailable'
        elif 'network' in error_msg or 'connection' in error_msg:
            return 'network_error'
        elif 'timeout' in error_msg:
            return 'timeout_error'
        else:
            return 'unknown_error'

    def _store_error(self, user_id: str, model: str, error_type: str, error_msg: str):
        """Store error for analytics and debugging"""
        redis_client = redis.Redis(decode_responses=True)

        # Increment error counters
        redis_client.incr(f"errors:{error_type}:total")
        redis_client.incr(f"errors:{user_id}:{error_type}")

        # Store recent errors for debugging
        error_data = {
            'user_id': user_id,
            'model': model,
            'error_type': error_type,
            'error_message': error_msg,
            'timestamp': datetime.now().isoformat()
        }

        # Keep last 10 errors per user
        errors_key = f"recent_errors:{user_id}"
        redis_client.lpush(errors_key, json.dumps(error_data))
        redis_client.ltrim(errors_key, 0, 9)  # Keep only last 10

    def _handle_rate_limit_error(self, user_id: str):
        """Handle rate limit errors"""
        # Could implement exponential backoff or queue requests
        logger.info(f"Rate limit hit for user {user_id}, implementing backoff")

    def _handle_quota_error(self, user_id: str):
        """Handle quota exceeded errors"""
        # Trigger upgrade prompt
        redis_client = redis.Redis(decode_responses=True)
        prompt_key = f"upgrade_prompt:{user_id}"
        redis_client.setex(prompt_key, 3600, 'quota_exceeded')

    def _handle_model_unavailable_error(self, user_id: str, model: str):
        """Handle model unavailable errors"""
        # Try to find alternative model
        logger.info(f"Model {model} unavailable for user {user_id}, finding alternative")


# Global instances for callbacks
usage_tracker = ScalixUsageTracker()
cost_calculator = ScalixCostCalculator()
error_handler = ScalixErrorHandler()

# Callback functions for LiteLLM
def scalix_usage_tracker(kwargs):
    """LiteLLM success callback for usage tracking"""
    try:
        user = kwargs.get('user', 'anonymous')
        model = kwargs.get('model', 'unknown')
        usage = kwargs.get('usage', {})
        metadata = kwargs.get('metadata', {})

        usage_tracker.track_usage(user, model, usage, metadata)
        cost = cost_calculator.calculate_cost(model, usage)
        cost_calculator.track_cost(user, model, cost)

    except Exception as e:
        logger.error(f"Error in scalix_usage_tracker: {e}")

def scalix_cost_calculator(kwargs):
    """LiteLLM success callback for cost calculation"""
    # Cost calculation is already handled in usage_tracker
    pass

def scalix_error_handler(kwargs):
    """LiteLLM failure callback for error handling"""
    try:
        user = kwargs.get('user', 'anonymous')
        model = kwargs.get('model', 'unknown')
        error = kwargs.get('error')

        if error:
            error_handler.handle_error(user, model, error, kwargs.get('metadata', {}))

    except Exception as e:
        logger.error(f"Error in scalix_error_handler: {e}")

# Export callbacks for LiteLLM configuration
__all__ = [
    'scalix_usage_tracker',
    'scalix_cost_calculator',
    'scalix_error_handler'
]
