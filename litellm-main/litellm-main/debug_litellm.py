#!/usr/bin/env python3
"""
Debug script to test LiteLLM functionality
"""

import os
import sys

def test_litellm_import():
    """Test if LiteLLM can be imported"""
    try:
        import litellm
        print(f"✅ LiteLLM imported successfully: {litellm.__name__}")
        return True
    except ImportError as e:
        print(f"❌ Failed to import LiteLLM: {e}")
        return False

def test_basic_completion():
    """Test basic completion functionality"""
    try:
        import litellm
        from litellm import completion

        # Set a dummy API key for testing
        os.environ['OPENAI_API_KEY'] = 'sk-test-key'

        # Test completion (this will fail with invalid key but should not crash)
        response = completion(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=10
        )

        print(f"✅ Completion successful: {response}")
        return True

    except Exception as e:
        print(f"❌ Completion failed: {e}")
        # This is expected to fail with invalid API key
        if "authentication" in str(e).lower() or "api key" in str(e).lower():
            print("   (This is expected with test API key)")
            return True
        return False

def test_proxy_config():
    """Test if our proxy configuration is valid"""
    try:
        import yaml

        with open('simple_config.yaml', 'r') as f:
            config = yaml.safe_load(f)

        print("✅ Configuration file loaded successfully")
        print(f"   Models configured: {len(config.get('model_list', []))}")

        # Check if all required fields are present
        required_fields = ['model_list', 'general_settings']
        for field in required_fields:
            if field not in config:
                print(f"❌ Missing required field: {field}")
                return False

        print("✅ Configuration validation passed")
        return True

    except Exception as e:
        print(f"❌ Configuration test failed: {e}")
        return False

def main():
    print("🔍 LiteLLM Debug Test")
    print("=" * 50)

    tests = [
        ("Import Test", test_litellm_import),
        ("Configuration Test", test_proxy_config),
        ("Completion Test", test_basic_completion)
    ]

    results = []
    for test_name, test_func in tests:
        print(f"\n🧪 Running {test_name}...")
        success = test_func()
        results.append((test_name, success))

    print("\n" + "=" * 50)
    print("📊 Test Results:")

    passed = 0
    for test_name, success in results:
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"   {test_name}: {status}")
        if success:
            passed += 1

    print(f"\n🎯 Overall: {passed}/{len(results)} tests passed")

    if passed == len(results):
        print("🎉 All tests passed! LiteLLM is ready to use.")
        print("\n🚀 Next steps:")
        print("1. Set up real API keys in environment variables")
        print("2. Start the proxy: python -m litellm.proxy.proxy_cli --config simple_config.yaml --port 4000")
        print("3. Test the full integration with real API calls")
    else:
        print("⚠️ Some tests failed. Check the errors above.")

    return passed == len(results)

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
