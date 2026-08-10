const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace("CheckCircle", "CheckCircle, Copy");
fs.writeFileSync('src/App.tsx', code);
