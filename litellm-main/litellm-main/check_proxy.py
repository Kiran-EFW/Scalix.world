#!/usr/bin/env python3
"""
Simple script to check if LiteLLM proxy is running
"""

import requests
import sys

def check_proxy():
    try:
        response = requests.get('http://localhost:4000/health', timeout=5)
        if response.status_code == 200:
            print("✅ LiteLLM proxy is running and healthy!")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"❌ Proxy returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to LiteLLM proxy at http://localhost:4000")
        print("Make sure the proxy is running with: litellm --port 4000")
        return False
    except Exception as e:
        print(f"❌ Error checking proxy: {e}")
        return False

if __name__ == "__main__":
    success = check_proxy()
    sys.exit(0 if success else 1)
