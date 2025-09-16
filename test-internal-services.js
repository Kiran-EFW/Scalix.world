#!/usr/bin/env node

// Internal Services Testing Script
const https = require('https');
const http = require('http');

console.log('🧪 Scalix Internal Services Testing');
console.log('=====================================');

const services = [
  {
    name: 'Scalix Cloud API',
    url: 'http://localhost:8080/health',
    expectedStatus: 200,
    type: 'api'
  },
  {
    name: 'Web Application',
    url: 'http://localhost:3001',
    expectedStatus: 200,
    type: 'web'
  },
  {
    name: 'Internal Admin',
    url: 'http://localhost:3004',
    expectedStatus: 200,
    type: 'admin'
  },
  {
    name: 'Firebase Emulator UI',
    url: 'http://127.0.0.1:4000',
    expectedStatus: 200,
    type: 'firebase'
  }
];

function testService(service) {
  return new Promise((resolve) => {
    const url = new URL(service.url);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'GET',
      timeout: 5000
    };

    const req = (url.protocol === 'https:' ? https : http).request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          ...service,
          status: res.statusCode,
          success: res.statusCode === service.expectedStatus,
          responseTime: Date.now() - startTime,
          data: data.length > 100 ? data.substring(0, 100) + '...' : data
        });
      });
    });

    const startTime = Date.now();

    req.on('error', (err) => {
      resolve({
        ...service,
        status: null,
        success: false,
        error: err.message,
        responseTime: Date.now() - startTime
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        ...service,
        status: null,
        success: false,
        error: 'Timeout after 5 seconds',
        responseTime: Date.now() - startTime
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('\n🔍 Testing all services...\n');

  const results = await Promise.all(services.map(testService));

  let passed = 0;
  let failed = 0;

  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    const statusText = result.success
      ? `${result.status} (${result.responseTime}ms)`
      : (result.error || 'Failed');

    console.log(`${status} ${result.name}: ${statusText}`);

    if (result.success) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log('\n📊 Test Results Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Total: ${services.length}`);

  if (passed === services.length) {
    console.log('\n🎉 ALL SERVICES ARE RUNNING SUCCESSFULLY!');
    console.log('\n🌐 Ready for internal testing:');
    console.log('   🔗 Web App: http://localhost:3001');
    console.log('   ⚙️ Admin: http://localhost:3004');
    console.log('   🌐 API: http://localhost:8080');
    console.log('   🔥 Firebase: http://127.0.0.1:4000');
  } else {
    console.log('\n⚠️ Some services are not running properly.');
    console.log('Please check the failed services above.');
  }

  console.log('\n💡 Next steps:');
  console.log('1. Open each URL in your browser');
  console.log('2. Test the user interface and functionality');
  console.log('3. Check browser console for any errors');
  console.log('4. Test API endpoints with different browsers');

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
