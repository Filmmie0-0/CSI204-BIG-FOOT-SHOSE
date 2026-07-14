async function test() {
  try {
    const loginRes = await fetch('http://localhost:3000/api/users/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@bigfoot.com',
        password: 'admin1234'
      })
    });
    
    if (!loginRes.ok) throw new Error('Login failed: ' + loginRes.status);
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login successful');

    const res = await fetch('http://localhost:3000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const text = await res.text();
    console.log('Response string length:', text.length);
    console.log('Response string starts with:', text.substring(0, 50));
    try {
      const data = JSON.parse(text);
      console.log('Type of data:', typeof data);
      console.log('Is Array?', Array.isArray(data));
      // console.log('Data:', data);
    } catch(e) {
      console.log('Failed to parse JSON');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
