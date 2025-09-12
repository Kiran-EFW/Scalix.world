#!/usr/bin/env python3
import requests

print('🔍 Checking official LiteLLM proxy status...')
try:
    response = requests.get('http://localhost:4000/health', timeout=5)
    if response.status_code == 200:
        print('✅ Official LiteLLM proxy is running!')
        data = response.json()
        print(f'Server: {data.get("server", "N/A")}')
        print(f'Version: {data.get("version", "N/A")}')

        # Check dashboard endpoints
        endpoints_to_check = [
            ('http://localhost:4000/ui', 'Dashboard UI'),
            ('http://localhost:4000/docs', 'Swagger UI'),
            ('http://localhost:4000/redoc', 'ReDoc'),
            ('http://localhost:4000/', 'Root endpoint')
        ]

        print('\n📊 Checking dashboard endpoints:')
        for url, name in endpoints_to_check:
            try:
                resp = requests.get(url, timeout=3)
                if resp.status_code == 200:
                    print(f'✅ {name}: {url}')
                else:
                    print(f'❌ {name}: Status {resp.status_code}')
            except:
                print(f'❌ {name}: Not accessible')

        print('\n🎯 Try these URLs in your browser:')
        print('1. http://localhost:4000/ui (Main Dashboard)')
        print('2. http://localhost:4000/docs (API Documentation)')
        print('3. http://localhost:4000/redoc (Alternative Docs)')

    else:
        print(f'❌ Proxy returned status: {response.status_code}')
        print('Response:', response.text[:200])

except Exception as e:
    print(f'❌ Cannot connect to proxy: {e}')
    print('The proxy might still be starting up or failed to start.')
    print('Check if there are any error messages in the terminal.')
