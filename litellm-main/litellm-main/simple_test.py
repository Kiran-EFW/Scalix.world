#!/usr/bin/env python3
"""
Very simple test to see if LiteLLM can run at all
"""

import sys
import os

print("🧪 Testing LiteLLM basic functionality...")
print(f"Python version: {sys.version}")
print(f"Working directory: {os.getcwd()}")

try:
    import litellm
    print("✅ LiteLLM imported successfully")

    # Try to get version (if available)
    try:
        version = getattr(litellm, '__version__', 'unknown')
        print(f"📦 LiteLLM version: {version}")
    except:
        print("📦 LiteLLM version: could not determine")

    # Try basic completion (this will fail without API key, but should show it's working)
    print("🧪 Testing basic completion call...")
    try:
        # This should fail gracefully without real API keys
        response = litellm.completion(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Hello"}],
            api_key="test_key"
        )
        print("✅ Basic completion test passed")
    except Exception as e:
        print(f"⚠️ Basic completion test failed (expected): {str(e)[:100]}...")

    print("✅ LiteLLM basic test completed successfully!")

except ImportError as e:
    print(f"❌ Failed to import LiteLLM: {e}")
    print("💡 Try: pip install litellm")

except Exception as e:
    print(f"❌ Unexpected error: {e}")
    import traceback
    traceback.print_exc()

print("\n🎯 Test complete!")
