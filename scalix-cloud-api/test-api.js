#!/usr/bin/env node

// Simple API testing script for Scalix Cloud API
const https = require('https');
const http = require('http');

const API_BASE = process.env.API_BASE || 'http://localhost:8080';

function makeRequest(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, API_BASE);
    const protocol = url.protocol === 'https:' ? https : http;

    const req = protocol.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Scalix Cloud API...');
  console.log('📍 API Base:', API_BASE);
  console.log('');

  const results = {
    passed: 0,
    failed: 0
  };

  // Test 1: Health check
  try {
    console.log('1️⃣ Testing health check...');
    const response = await makeRequest('/health');
    if (response.status === 200 && response.data.status === 'ok') {
      console.log('✅ Health check passed');
      results.passed++;
    } else {
      console.log('❌ Health check failed:', response);
      results.failed++;
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
    results.failed++;
  }

  // Test 2: Invalid API key validation
  try {
    console.log('2️⃣ Testing invalid API key validation...');
    const response = await makeRequest('/api/validate-key', {
      method: 'POST',
      body: { apiKey: 'invalid_key' }
    });
    if (response.status === 401 && response.data.isValid === false) {
      console.log('✅ Invalid key validation passed');
      results.passed++;
    } else {
      console.log('❌ Invalid key validation failed:', response);
      results.failed++;
    }
  } catch (error) {
    console.log('❌ Invalid key validation error:', error.message);
    results.failed++;
  }

  // Test 3: Rate limiting
  try {
    console.log('3️⃣ Testing rate limiting...');
    const requests = [];
    for (let i = 0; i < 110; i++) { // Exceed the 100 req/min limit
      requests.push(makeRequest('/health'));
    }

    const responses = await Promise.allSettled(requests);
    const rateLimited = responses.some(result =>
      result.status === 'fulfilled' && result.value.status === 429
    );

    if (rateLimited) {
      console.log('✅ Rate limiting working');
      results.passed++;
    } else {
      console.log('❌ Rate limiting not working as expected');
      results.failed++;
    }
  } catch (error) {
    console.log('❌ Rate limiting test error:', error.message);
    results.failed++;
  }

  // Test 4: Usage tracking (should fail without valid key)
  try {
    console.log('4️⃣ Testing usage tracking without auth...');
    const response = await makeRequest('/api/usage/track', {
      method: 'POST',
      body: {
        metric: 'ai_tokens',
        amount: 100
      }
    });
    if (response.status === 401) {
      console.log('✅ Usage tracking auth check passed');
      results.passed++;
    } else {
      console.log('❌ Usage tracking auth check failed:', response);
      results.failed++;
    }
  } catch (error) {
    console.log('❌ Usage tracking test error:', error.message);
    results.failed++;
  }

  // Summary
  console.log('');
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

  if (results.failed === 0) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Check the API configuration.');
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, makeRequest };
