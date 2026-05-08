const axios = require('axios');

async function test() {
  const server = 'http://localhost:5000';
  let token = '';
  
  try {
    const signup = await axios.post(`${server}/api/auth/signup`, {
      name: 'Tester',
      email: `test${Date.now()}@test.com`,
      password: 'password'
    });
    token = signup.data.token;
  } catch(e) {
    if (e.response && e.response.status === 400) {
      const login = await axios.post(`${server}/api/auth/login`, {
        email: 'test@farm.com', password: 'password'
      });
      token = login.data.token;
    }
  }

  const headers = { Authorization: `Bearer ${token}` };

  const tests = [
    { name: 'Coimbatore', lat: 10.89, lng: 76.96 },
    { name: 'Bhopal', lat: 23.39, lng: 77.35 },
    { name: 'Kerala coast', lat: 10.0, lng: 76.5 }
  ];

  for (let t of tests) {
    console.log(`\n--- Testing ${t.name} ---`);
    try {
      const res = await axios.post(`${server}/api/recommend`, {lat: t.lat, lng: t.lng}, { headers });
      console.log(`Recommended: ${res.data.primaryCrop} (${res.data.confidence}%)`);
    } catch(e) {
      console.error('Error:', e.response ? e.response.data.error : e.message);
    }
  }
}
test();
