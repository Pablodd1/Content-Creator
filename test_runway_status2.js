fetch('http://localhost:3000/api/runway/status/486cad47-70bd-42c4-88c0-b7ca15ca6711', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer use_server_key'
  }
}).then(res => res.json()).then(console.log).catch(console.error);
