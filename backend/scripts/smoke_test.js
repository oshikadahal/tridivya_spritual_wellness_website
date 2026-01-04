const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function run() {
  try {
    const registerRes = await fetch('http://localhost:5050/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Smoke',
        lastName: 'Test',
        email: 'smoke@example.com',
        username: 'smoketest',
        password: 'passpass',
        confirmPassword: 'passpass'
      })
    });
    console.log('Register status:', registerRes.status);
    console.log('Register body:', await registerRes.text());

    const loginRes = await fetch('http://localhost:5050/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'smoke@example.com', password: 'passpass' })
    });
    console.log('Login status:', loginRes.status);
    console.log('Login body:', await loginRes.text());
  } catch (err) {
    console.error('Smoke test failed:', err);
  }
}

run();
