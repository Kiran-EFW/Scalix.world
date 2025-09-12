#!/usr/bin/env python3
"""
Scalix LiteLLM Dashboard - Web Interface
A simple web interface to test and monitor the Scalix LiteLLM server
"""

import os
import json
import time
from flask import Flask, render_template_string, request, jsonify
import requests

app = Flask(__name__)

# Server configuration
SCALIX_SERVER_URL = "http://localhost:4000"
MASTER_KEY = "sk-scalix-dev-123456789"

# HTML Template
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔥 Scalix LiteLLM Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        .header h1 {
            color: white;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            color: rgba(255, 255, 255, 0.8);
            font-size: 1.1em;
        }
        .status {
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
        }
        .status.healthy { border-left: 5px solid #4CAF50; }
        .status.error { border-left: 5px solid #f44336; }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .card h3 {
            color: #333;
            margin-bottom: 15px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 5px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        .form-group input, .form-group select, .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
        }
        .form-group textarea {
            min-height: 60px;
            resize: vertical;
        }
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: transform 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        .result {
            margin-top: 20px;
            padding: 15px;
            border-radius: 5px;
            background: #f8f9fa;
            border-left: 4px solid #667eea;
        }
        .result pre {
            background: #f1f3f4;
            padding: 10px;
            border-radius: 3px;
            overflow-x: auto;
            font-size: 12px;
        }
        .user-type {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .free { background: #4CAF50; color: white; }
        .pro { background: #2196F3; color: white; }
        .tabs {
            display: flex;
            margin-bottom: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            padding: 5px;
        }
        .tab {
            flex: 1;
            padding: 10px;
            text-align: center;
            cursor: pointer;
            border-radius: 3px;
            transition: background 0.3s;
        }
        .tab.active {
            background: white;
            color: #333;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .stat {
            text-align: center;
            padding: 10px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 5px;
        }
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }
        .stat-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔥 Scalix LiteLLM Dashboard</h1>
            <p>Unified AI Infrastructure for Free & Pro Users</p>
        </div>

        <div class="status healthy" id="server-status">
            <h3>Server Status: Checking...</h3>
        </div>

        <div class="tabs">
            <div class="tab active" onclick="showTab('chat')">💬 AI Chat</div>
            <div class="tab" onclick="showTab('models')">📋 Models</div>
            <div class="tab" onclick="showTab('stats')">📊 Statistics</div>
            <div class="tab" onclick="showTab('demo')">🎯 Demo</div>
        </div>

        <div id="chat-tab" class="tab-content active">
            <div class="grid">
                <div class="card">
                    <h3>🤖 AI Chat Interface</h3>
                    <form id="chat-form">
                        <div class="form-group">
                            <label for="user-type">User Type:</label>
                            <select id="user-type" onchange="updateUserType()">
                                <option value="free">🆓 Free User</option>
                                <option value="pro">💎 Pro User</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="user-id">User ID:</label>
                            <input type="text" id="user-id" value="test_user_123" placeholder="Enter user ID">
                        </div>
                        <div class="form-group">
                            <label for="model">Model:</label>
                            <select id="model">
                                <optgroup label="Free Models" id="free-models">
                                    <option value="free-gemini-flash">Gemini Flash</option>
                                    <option value="free-gemini-pro">Gemini Pro</option>
                                    <option value="free-deepseek">DeepSeek</option>
                                </optgroup>
                                <optgroup label="Pro Models" id="pro-models" style="display: none;">
                                    <option value="scalix-engine">Scalix Engine</option>
                                    <option value="scalix-gateway">Scalix Gateway</option>
                                    <option value="gpt-4">GPT-4</option>
                                    <option value="claude-3-opus">Claude 3 Opus</option>
                                </optgroup>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="message">Message:</label>
                            <textarea id="message" placeholder="Type your message here...">Hello! Can you help me with a React component?</textarea>
                        </div>
                        <button type="submit" class="btn" id="send-btn">🚀 Send Message</button>
                    </form>
                    <div id="chat-result" class="result" style="display: none;"></div>
                </div>

                <div class="card">
                    <h3>📈 User Info</h3>
                    <div id="user-info">
                        <p>Select a user type and enter a user ID to see their information.</p>
                    </div>
                    <button class="btn" onclick="loadUserStats()">🔄 Refresh Stats</button>
                </div>
            </div>
        </div>

        <div id="models-tab" class="tab-content">
            <div class="card">
                <h3>📋 Available Models</h3>
                <div class="form-group">
                    <label for="models-user">User Type:</label>
                    <select id="models-user" onchange="loadModels()">
                        <option value="free">🆓 Free User</option>
                        <option value="scalix_pro_user">💎 Pro User</option>
                    </select>
                </div>
                <div id="models-result" class="result" style="display: none;"></div>
            </div>
        </div>

        <div id="stats-tab" class="tab-content">
            <div class="card">
                <h3>📊 Server Statistics</h3>
                <div id="server-stats">
                    <p>Loading statistics...</p>
                </div>
            </div>
        </div>

        <div id="demo-tab" class="tab-content">
            <div class="grid">
                <div class="card">
                    <h3>🆓 Free Tier Demo</h3>
                    <div id="free-demo">
                        <p>Loading free tier information...</p>
                    </div>
                </div>
                <div class="card">
                    <h3>💎 Pro Tier Demo</h3>
                    <div id="pro-demo">
                        <p>Loading pro tier information...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentTab = 'chat';

        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });

            // Show selected tab
            document.getElementById(tabName + '-tab').classList.add('active');
            event.target.classList.add('active');
            currentTab = tabName;

            // Load tab-specific data
            switch(tabName) {
                case 'models':
                    loadModels();
                    break;
                case 'stats':
                    loadServerStats();
                    break;
                case 'demo':
                    loadDemoInfo();
                    break;
            }
        }

        function updateUserType() {
            const userType = document.getElementById('user-type').value;
            const freeModels = document.getElementById('free-models');
            const proModels = document.getElementById('pro-models');

            if (userType === 'free') {
                freeModels.style.display = 'block';
                proModels.style.display = 'none';
                document.getElementById('model').value = 'free-gemini-flash';
            } else {
                freeModels.style.display = 'none';
                proModels.style.display = 'block';
                document.getElementById('model').value = 'scalix-engine';
            }

            // Update user ID suggestion
            const userIdField = document.getElementById('user-id');
            if (userType === 'free') {
                userIdField.value = 'free_user_123';
            } else {
                userIdField.value = 'scalix_pro_user';
            }

            loadUserStats();
        }

        async function checkServerStatus() {
            try {
                const response = await fetch('${SCALIX_SERVER_URL}/health');
                const data = await response.json();

                const statusDiv = document.getElementById('server-status');
                statusDiv.className = 'status healthy';
                statusDiv.innerHTML = `
                    <h3>✅ Server Status: Healthy</h3>
                    <p>Active Users: ${data.active_users || 0}</p>
                    <p>Version: ${data.version}</p>
                    <p>Last Check: ${new Date().toLocaleTimeString()}</p>
                `;
            } catch (error) {
                const statusDiv = document.getElementById('server-status');
                statusDiv.className = 'status error';
                statusDiv.innerHTML = `
                    <h3>❌ Server Status: Error</h3>
                    <p>Unable to connect to server</p>
                    <p>Please ensure the server is running on port 4000</p>
                `;
            }
        }

        async function sendMessage(event) {
            event.preventDefault();

            const sendBtn = document.getElementById('send-btn');
            const originalText = sendBtn.textContent;
            sendBtn.disabled = true;
            sendBtn.textContent = '⏳ Sending...';

            try {
                const userId = document.getElementById('user-id').value;
                const model = document.getElementById('model').value;
                const message = document.getElementById('message').value;

                const response = await fetch('${SCALIX_SERVER_URL}/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ${MASTER_KEY}'
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [{ role: 'user', content: message }],
                        user: userId,
                        max_tokens: 200
                    })
                });

                const data = await response.json();

                const resultDiv = document.getElementById('chat-result');
                resultDiv.style.display = 'block';

                if (response.ok) {
                    const content = data.choices[0].message.content;
                    const metadata = data.scalix_metadata;

                    resultDiv.innerHTML = `
                        <h4>✅ Response Successful</h4>
                        <p><strong>Model:</strong> ${data.model}</p>
                        <p><strong>User Tier:</strong> <span class="user-type ${metadata.user_tier}">${metadata.user_tier}</span></p>
                        <p><strong>Tokens Used:</strong> ${data.usage.total_tokens}</p>
                        <p><strong>Remaining Requests:</strong> ${metadata.remaining_requests || 'Unlimited'}</p>
                        <p><strong>Cost:</strong> $${metadata.cost_usd}</p>
                        <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                            <strong>Response:</strong><br>
                            ${content}
                        </div>
                    `;
                } else {
                    resultDiv.innerHTML = `
                        <h4>❌ Error</h4>
                        <pre>${JSON.stringify(data, null, 2)}</pre>
                    `;
                }

                // Refresh user stats
                loadUserStats();

            } catch (error) {
                const resultDiv = document.getElementById('chat-result');
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `
                    <h4>❌ Network Error</h4>
                    <p>Unable to connect to the server. Please ensure it's running.</p>
                    <p>Error: ${error.message}</p>
                `;
            } finally {
                sendBtn.disabled = false;
                sendBtn.textContent = originalText;
            }
        }

        async function loadUserStats() {
            const userId = document.getElementById('user-id').value;
            if (!userId) return;

            try {
                const response = await fetch(`${SCALIX_SERVER_URL}/scalix/stats/${userId}`);
                const data = await response.json();

                const userInfoDiv = document.getElementById('user-info');
                userInfoDiv.innerHTML = `
                    <div class="stats">
                        <div class="stat">
                            <div class="stat-value">${data.usage.requests_today}</div>
                            <div class="stat-label">Requests Today</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${data.usage.tokens_used}</div>
                            <div class="stat-label">Tokens Used</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${data.user_type}</div>
                            <div class="stat-label">User Tier</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${data.usage.requests_today >= 40 ? 'YES' : 'NO'}</div>
                            <div class="stat-label">Upgrade Prompt</div>
                        </div>
                    </div>
                    <div style="margin-top: 15px;">
                        <strong>Limits:</strong> ${JSON.stringify(data.limits[data.user_type], null, 2)}
                    </div>
                `;
            } catch (error) {
                const userInfoDiv = document.getElementById('user-info');
                userInfoDiv.innerHTML = `<p>❌ Unable to load user stats: ${error.message}</p>`;
            }
        }

        async function loadModels() {
            const userId = document.getElementById('models-user').value;

            try {
                const response = await fetch(`${SCALIX_SERVER_URL}/v1/models?user=${userId}`);
                const data = await response.json();

                const resultDiv = document.getElementById('models-result');
                resultDiv.style.display = 'block';

                const modelsList = data.data.map(model =>
                    `<li><strong>${model.id}</strong> - ${model.owned_by}</li>`
                ).join('');

                resultDiv.innerHTML = `
                    <h4>Available Models for ${userId}</h4>
                    <ul>${modelsList}</ul>
                `;
            } catch (error) {
                const resultDiv = document.getElementById('models-result');
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `<p>❌ Unable to load models: ${error.message}</p>`;
            }
        }

        async function loadServerStats() {
            try {
                const response = await fetch(`${SCALIX_SERVER_URL}/health`);
                const data = await response.json();

                const statsDiv = document.getElementById('server-stats');
                statsDiv.innerHTML = `
                    <div class="stats">
                        <div class="stat">
                            <div class="stat-value">${data.active_users}</div>
                            <div class="stat-label">Active Users</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${data.status}</div>
                            <div class="stat-label">Server Status</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${data.version}</div>
                            <div class="stat-label">Version</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">4000</div>
                            <div class="stat-label">Port</div>
                        </div>
                    </div>
                `;
            } catch (error) {
                const statsDiv = document.getElementById('server-stats');
                statsDiv.innerHTML = `<p>❌ Unable to load server stats: ${error.message}</p>`;
            }
        }

        async function loadDemoInfo() {
            try {
                // Load free tier info
                const freeResponse = await fetch(`${SCALIX_SERVER_URL}/scalix/demo/free`);
                const freeData = await freeResponse.json();

                const freeDiv = document.getElementById('free-demo');
                freeDiv.innerHTML = `
                    <h4>Free Tier Features</h4>
                    <ul>
                        ${freeData.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <h5>Limits</h5>
                    <ul>
                        <li>Requests per day: ${freeData.limits.requests_per_day}</li>
                        <li>Requests per hour: ${freeData.limits.requests_per_hour}</li>
                        <li>Models: ${freeData.limits.models.join(', ')}</li>
                    </ul>
                    <p><strong>Pricing:</strong> ${freeData.pricing}</p>
                `;

                // Load pro tier info
                const proResponse = await fetch(`${SCALIX_SERVER_URL}/scalix/demo/pro`);
                const proData = await proResponse.json();

                const proDiv = document.getElementById('pro-demo');
                proDiv.innerHTML = `
                    <h4>Pro Tier Features</h4>
                    <ul>
                        ${proData.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <h5>Limits</h5>
                    <ul>
                        <li>Requests per day: ${proData.limits.requests_per_day}</li>
                        <li>Requests per hour: ${proData.limits.requests_per_hour}</li>
                        <li>Models: ${proData.limits.models.join(', ')}</li>
                    </ul>
                    <p><strong>Pricing:</strong> ${proData.pricing}</p>
                `;
            } catch (error) {
                const freeDiv = document.getElementById('free-demo');
                const proDiv = document.getElementById('pro-demo');
                freeDiv.innerHTML = `<p>❌ Unable to load demo info: ${error.message}</p>`;
                proDiv.innerHTML = `<p>❌ Unable to load demo info: ${error.message}</p>`;
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            // Set up form submission
            document.getElementById('chat-form').addEventListener('submit', sendMessage);

            // Initial checks
            checkServerStatus();
            updateUserType();

            // Auto-refresh server status every 30 seconds
            setInterval(checkServerStatus, 30000);
        });
    </script>
</body>
</html>
"""

@app.route('/')
def dashboard():
    """Serve the main dashboard"""
    return render_template_string(HTML_TEMPLATE)

@app.route('/api/health')
def api_health():
    """API endpoint to check server health"""
    try:
        # Check if our Scalix server is running
        response = requests.get(f"{SCALIX_SERVER_URL}/health", timeout=5)
        if response.status_code == 200:
            return jsonify({"status": "connected", "server": "running"})
        else:
            return jsonify({"status": "error", "server": "unreachable"})
    except:
        return jsonify({"status": "error", "server": "not_running"})

if __name__ == '__main__':
    print("🚀 Starting Scalix LiteLLM Dashboard...")
    print("📡 Dashboard will run on http://localhost:5000")
    print("🔗 Scalix Server: http://localhost:4000")
    print("=" * 50)
    print("Features:")
    print("✅ Interactive AI Chat Interface")
    print("✅ Real-time User Statistics")
    print("✅ Model Management")
    print("✅ Rate Limiting Demo")
    print("✅ Server Monitoring")
    print("=" * 50)

    app.run(host='0.0.0.0', port=5000, debug=False)
