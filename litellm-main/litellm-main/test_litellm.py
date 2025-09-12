#!/usr/bin/env python3
"""
Simple test script to run LiteLLM proxy
"""

import os
import sys
import subprocess

def main():
    print("🚀 Starting LiteLLM Proxy Test...")

    # Set environment variables
    os.environ['LITELLM_MASTER_KEY'] = 'sk-scalix-dev-123456789'

    # Simple configuration
    config_content = """
model_list:
  - model_name: test-model
    litellm_params:
      model: openai/gpt-3.5-turbo
      api_key: test_key_placeholder

general_settings:
  master_key: sk-scalix-dev-123456789
  database_url: sqlite:///./test.db
"""

    # Write config to file
    with open('test_config.yaml', 'w') as f:
        f.write(config_content.strip())

    print("📝 Created test configuration")

    # Try to start LiteLLM proxy
    cmd = [
        sys.executable, "-m", "litellm.proxy.proxy_cli",
        "--config", "test_config.yaml",
        "--port", "4000",
        "--host", "127.0.0.1"
    ]

    print(f"🔧 Running command: {' '.join(cmd)}")

    try:
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        # Wait a bit for startup
        import time
        time.sleep(3)

        # Check if process is still running
        if process.poll() is None:
            print("✅ LiteLLM proxy appears to be running!")
            print("📡 Test URL: http://127.0.0.1:4000")
            print("🔑 Master Key: sk-scalix-dev-123456789")

            # Try to make a test request
            print("\n🧪 Testing health endpoint...")
            try:
                import requests
                response = requests.get("http://127.0.0.1:4000/health", timeout=5)
                print(f"✅ Health check successful: {response.status_code}")
            except Exception as e:
                print(f"⚠️ Health check failed: {e}")

            input("\nPress Enter to stop the server...")

            # Stop the process
            process.terminate()
            try:
                process.wait(timeout=5)
                print("✅ Server stopped successfully")
            except:
                process.kill()
                print("✅ Server force stopped")

        else:
            # Process failed, get error output
            stdout, stderr = process.communicate()
            print("❌ Failed to start LiteLLM proxy")
            if stderr:
                print(f"Error output: {stderr}")
            if stdout:
                print(f"Standard output: {stdout}")

    except Exception as e:
        print(f"❌ Error: {e}")

    # Clean up
    try:
        os.remove('test_config.yaml')
        print("🧹 Cleaned up test files")
    except:
        pass

if __name__ == "__main__":
    main()
