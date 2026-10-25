const http = require('http');

const testRegistration = (name, email, phone) => {
  const data = JSON.stringify({
    name,
    email,
    password: 'test123',
    phone,
  });

  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            response: JSON.parse(body),
          });
        } catch {
          resolve({
            status: res.statusCode,
            response: body,
          });
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

(async () => {
  console.log('\n=== TEST 1: Register with new email and phone ===');
  let result = await testRegistration('Fresh User 1', 'fresh1@test.com', '+91 1111111111');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.response);

  console.log('\n=== TEST 2: Try duplicate email (should fail) ===');
  result = await testRegistration('Fresh User 2', 'fresh1@test.com', '+91 2222222222');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.response);

  console.log('\n=== TEST 3: Try duplicate phone (should fail) ===');
  result = await testRegistration('Fresh User 3', 'fresh3@test.com', '+91 1111111111');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.response);

  console.log('\n=== TEST 4: Register with different email and phone (should succeed) ===');
  result = await testRegistration('Fresh User 4', 'fresh4@test.com', '+91 4444444444');
  console.log(`Status: ${result.status}`);
  console.log(`Response:`, result.response);
})();
