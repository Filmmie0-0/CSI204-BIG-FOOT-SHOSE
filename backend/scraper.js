const https = require('https');
https.get('https://unsplash.com/s/photos/kids-shoes', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /"id":"([a-zA-Z0-9_-]{10,12})"/g;
    let match;
    let ids = new Set();
    while ((match = regex.exec(data)) !== null && ids.size < 20) {
      if(match[1].length === 11) ids.add(match[1]); // Unsplash IDs are typically 11 chars
    }
    console.log(Array.from(ids));
  });
});
