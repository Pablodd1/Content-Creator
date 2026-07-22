fetch('http://localhost:3000/api/runway/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    apiKey: process.env.RUNWAY_API_KEY,
    promptText: 'A beautiful sunny day in the forest',
    model: 'gen4.5',
    seconds: 5,
    ratio: '1280:720'
  })
}).then(res => res.json()).then(console.log).catch(console.error);
