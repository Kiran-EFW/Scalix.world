// Simple Firebase Emulator Test
const https = require('https');

console.log('🔗 Testing Firebase Emulator connectivity...');

// Test Firestore emulator (uses HTTP, not HTTPS)
function testFirestore() {
  return new Promise((resolve, reject) => {
    const http = require('http');

    const options = {
      hostname: '127.0.0.1',
      port: 8081,
      path: '/emulator/v1/projects/scalix-ai-platform/databases/(default)/documents/test',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      console.log('✅ Firestore emulator connection successful');
      resolve();
    });

    req.on('error', (err) => {
      console.log('⚠️  Firestore emulator not responding:', err.message);
      reject(err);
    });

    req.setTimeout(5000, () => {
      console.log('⚠️  Firestore emulator timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

// Test Auth emulator (uses HTTP, not HTTPS)
function testAuth() {
  return new Promise((resolve, reject) => {
    const http = require('http');

    const options = {
      hostname: '127.0.0.1',
      port: 9099,
      path: '/emulator/v1/projects/scalix-ai-platform/config',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      console.log('✅ Auth emulator connection successful');
      resolve();
    });

    req.on('error', (err) => {
      console.log('⚠️  Auth emulator not responding:', err.message);
      reject(err);
    });

    req.setTimeout(5000, () => {
      console.log('⚠️  Auth emulator timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

// Test Emulator UI
function testEmulatorUI() {
  return new Promise((resolve, reject) => {
    const http = require('http');

    const options = {
      hostname: '127.0.0.1',
      port: 4000,
      path: '/',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      console.log('✅ Emulator UI connection successful');
      resolve();
    });

    req.on('error', (err) => {
      console.log('⚠️  Emulator UI not responding:', err.message);
      reject(err);
    });

    req.setTimeout(5000, () => {
      console.log('⚠️  Emulator UI timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function runTests() {
  const tests = [
    { name: 'Firestore', test: testFirestore },
    { name: 'Auth', test: testAuth },
    { name: 'Emulator UI', test: testEmulatorUI }
  ];

  console.log('🧪 Running Firebase Emulator tests...\n');

  let passed = 0;
  let failed = 0;

  for (const { name, test } of tests) {
    try {
      await test();
      passed++;
    } catch (error) {
      failed++;
      console.log(`❌ ${name} test failed`);
    }
  }

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

  if (passed === tests.length) {
    console.log('🎉 All Firebase Emulator tests passed!');
    console.log('\n📋 Your Firebase setup is ready for development!');
    console.log('   🌐 Emulator UI: http://127.0.0.1:4000');
    console.log('   🔥 Firestore: http://127.0.0.1:8081');
    console.log('   🔐 Auth: http://127.0.0.1:9099');
    console.log('\n🚀 You can now start your applications!');
  } else {
    console.log('\n❌ Some tests failed. Make sure Firebase emulator is running:');
    console.log('   firebase emulators:start --project scalix-ai-platform');
  }

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
