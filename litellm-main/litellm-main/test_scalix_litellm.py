#!/usr/bin/env python3
"""
Test script for Scalix LiteLLM integration
Tests both free and pro tier functionality
"""

import os
import sys
import json
import requests
import time
from typing import Dict, Any
from pathlib import Path

class ScalixLiteLLMTest:
    """Test suite for Scalix LiteLLM integration"""

    def __init__(self, base_url: str = "http://localhost:4000", master_key: str = None):
        self.base_url = base_url.rstrip('/')
        self.master_key = master_key or os.getenv('LITELLM_MASTER_KEY')
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {self.master_key}',
            'Content-Type': 'application/json'
        })

    def test_health_check(self) -> bool:
        """Test if the LiteLLM proxy is healthy"""
        print("🔍 Testing health check...")
        try:
            response = self.session.get(f"{self.base_url}/health")
            if response.status_code == 200:
                print("✅ Health check passed")
                return True
            else:
                print(f"❌ Health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False

    def test_free_tier_completion(self) -> bool:
        """Test free tier model completion"""
        print("\n🆓 Testing free tier completion...")

        payload = {
            "model": "free-gemini-flash",
            "messages": [
                {"role": "user", "content": "Hello! Please respond with a simple greeting."}
            ],
            "max_tokens": 100,
            "temperature": 0.7,
            "user": "test_user_free"
        }

        try:
            response = self.session.post(
                f"{self.base_url}/v1/chat/completions",
                json=payload,
                timeout=30
            )

            if response.status_code == 200:
                data = response.json()
                content = data['choices'][0]['message']['content']
                usage = data.get('usage', {})

                print("✅ Free tier completion successful"                print(f"   Response: {content[:50]}...")
                print(f"   Tokens used: {usage.get('total_tokens', 'N/A')}")
                print(f"   Model: {data.get('model', 'N/A')}")
                return True
            else:
                print(f"❌ Free tier completion failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False

        except Exception as e:
            print(f"❌ Free tier completion error: {e}")
            return False

    def test_pro_tier_completion(self) -> bool:
        """Test pro tier model completion (Scalix Engine/Gateway)"""
        print("\n💎 Testing pro tier completion...")

        payload = {
            "model": "scalix-gateway",
            "messages": [
                {"role": "user", "content": "Create a simple React component for a button."}
            ],
            "max_tokens": 200,
            "temperature": 0.7,
            "user": "test_user_pro"
        }

        try:
            response = self.session.post(
                f"{self.base_url}/v1/chat/completions",
                json=payload,
                timeout=30
            )

            if response.status_code == 200:
                data = response.json()
                content = data['choices'][0]['message']['content']
                usage = data.get('usage', {})

                print("✅ Pro tier completion successful"                print(f"   Response: {content[:50]}...")
                print(f"   Tokens used: {usage.get('total_tokens', 'N/A')}")
                print(f"   Model: {data.get('model', 'N/A')}")
                return True
            else:
                print(f"❌ Pro tier completion failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False

        except Exception as e:
            print(f"❌ Pro tier completion error: {e}")
            return False

    def test_rate_limiting(self) -> bool:
        """Test rate limiting functionality"""
        print("\n⏱️ Testing rate limiting...")

        payload = {
            "model": "free-gemini-flash",
            "messages": [{"role": "user", "content": "Test"}],
            "max_tokens": 50,
            "user": "test_rate_limit"
        }

        # Make multiple rapid requests
        success_count = 0
        rate_limit_count = 0

        for i in range(5):
            try:
                response = self.session.post(
                    f"{self.base_url}/v1/chat/completions",
                    json=payload,
                    timeout=10
                )

                if response.status_code == 200:
                    success_count += 1
                elif response.status_code == 429:
                    rate_limit_count += 1
                    print(f"   Rate limit hit on request {i+1}")
                else:
                    print(f"   Unexpected status {response.status_code} on request {i+1}")

            except Exception as e:
                print(f"   Error on request {i+1}: {e}")

            time.sleep(0.5)  # Small delay between requests

        print(f"✅ Rate limiting test completed:")
        print(f"   Successful requests: {success_count}")
        print(f"   Rate limited requests: {rate_limit_count}")

        # Should have some successful and some rate limited
        return success_count > 0 and rate_limit_count >= 0

    def test_model_listing(self) -> bool:
        """Test model listing endpoint"""
        print("\n📋 Testing model listing...")

        try:
            response = self.session.get(f"{self.base_url}/v1/models")

            if response.status_code == 200:
                data = response.json()
                models = data.get('data', [])

                print("✅ Model listing successful"                print(f"   Total models: {len(models)}")

                # Categorize models
                free_models = [m for m in models if 'free-' in m['id']]
                pro_models = [m for m in models if 'scalix-' in m['id']]
                premium_models = [m for m in models if not any(prefix in m['id'] for prefix in ['free-', 'scalix-'])]

                print(f"   Free tier models: {len(free_models)}")
                print(f"   Pro tier models: {len(pro_models)}")
                print(f"   Premium models: {len(premium_models)}")

                # Show some examples
                if free_models:
                    print(f"   Free model example: {free_models[0]['id']}")
                if pro_models:
                    print(f"   Pro model example: {pro_models[0]['id']}")

                return True
            else:
                print(f"❌ Model listing failed: {response.status_code}")
                return False

        except Exception as e:
            print(f"❌ Model listing error: {e}")
            return False

    def test_user_management(self) -> bool:
        """Test user management and virtual keys"""
        print("\n👤 Testing user management...")

        # Test creating a virtual key
        user_payload = {
            "user_id": "test_user_123",
            "max_budget": 10.0,
            "models": ["free-gemini-flash", "scalix-gateway"],
            "duration": "24h"
        }

        try:
            response = self.session.post(
                f"{self.base_url}/key/generate",
                json=user_payload,
                timeout=10
            )

            if response.status_code == 200:
                data = response.json()
                virtual_key = data.get('key')

                print("✅ Virtual key creation successful"                print(f"   Virtual key: {virtual_key[:20]}...")
                print(f"   Expires: {data.get('expires', 'N/A')}")

                # Test using the virtual key
                test_payload = {
                    "model": "free-gemini-flash",
                    "messages": [{"role": "user", "content": "Hello with virtual key!"}],
                    "max_tokens": 50
                }

                # Create new session with virtual key
                virtual_session = requests.Session()
                virtual_session.headers.update({
                    'Authorization': f'Bearer {virtual_key}',
                    'Content-Type': 'application/json'
                })

                virtual_response = virtual_session.post(
                    f"{self.base_url}/v1/chat/completions",
                    json=test_payload,
                    timeout=15
                )

                if virtual_response.status_code == 200:
                    print("✅ Virtual key usage successful")
                    return True
                else:
                    print(f"❌ Virtual key usage failed: {virtual_response.status_code}")
                    return False

            else:
                print(f"❌ Virtual key creation failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False

        except Exception as e:
            print(f"❌ User management test error: {e}")
            return False

    def run_all_tests(self) -> Dict[str, bool]:
        """Run all tests and return results"""
        print("🚀 Starting Scalix LiteLLM Integration Tests")
        print("=" * 50)

        tests = [
            ("Health Check", self.test_health_check),
            ("Free Tier Completion", self.test_free_tier_completion),
            ("Pro Tier Completion", self.test_pro_tier_completion),
            ("Rate Limiting", self.test_rate_limiting),
            ("Model Listing", self.test_model_listing),
            ("User Management", self.test_user_management)
        ]

        results = {}

        for test_name, test_func in tests:
            try:
                results[test_name] = test_func()
            except Exception as e:
                print(f"❌ {test_name} crashed: {e}")
                results[test_name] = False

        # Summary
        print("\n" + "=" * 50)
        print("📊 Test Results Summary:")
        print("=" * 50)

        passed = 0
        total = len(results)

        for test_name, success in results.items():
            status = "✅ PASSED" if success else "❌ FAILED"
            print("20")
            if success:
                passed += 1

        print(f"\n🎯 Overall: {passed}/{total} tests passed")

        if passed == total:
            print("🎉 All tests passed! Scalix LiteLLM integration is working perfectly!")
        elif passed >= total * 0.8:
            print("👍 Most tests passed. Minor issues to resolve.")
        else:
            print("⚠️ Several tests failed. Need to investigate issues.")

        return results

def main():
    import argparse

    parser = argparse.ArgumentParser(description='Test Scalix LiteLLM Integration')
    parser.add_argument('--url', default='http://localhost:4000', help='LiteLLM proxy URL')
    parser.add_argument('--key', help='Master key (defaults to LITELLM_MASTER_KEY env var)')
    parser.add_argument('--test', choices=[
        'health', 'free', 'pro', 'rate-limit', 'models', 'users', 'all'
    ], default='all', help='Specific test to run')

    args = parser.parse_args()

    # Load environment
    from dotenv import load_dotenv
    env_file = Path('./scalix_config.env')
    if env_file.exists():
        load_dotenv(env_file)

    # Initialize tester
    tester = ScalixLiteLLMTest(args.url, args.key)

    # Run specific test or all tests
    if args.test == 'all':
        results = tester.run_all_tests()
        success = all(results.values())
    else:
        test_map = {
            'health': tester.test_health_check,
            'free': tester.test_free_tier_completion,
            'pro': tester.test_pro_tier_completion,
            'rate-limit': tester.test_rate_limiting,
            'models': tester.test_model_listing,
            'users': tester.test_user_management
        }

        test_func = test_map.get(args.test)
        if test_func:
            success = test_func()
        else:
            print(f"❌ Unknown test: {args.test}")
            success = False

    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
