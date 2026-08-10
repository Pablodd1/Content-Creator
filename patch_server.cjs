const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace the hardcoded systemInstruction
code = code.replace(
  /const systemInstruction = \`You are a world-class creative director.+?;\s*$/m,
  "const systemInstruction = `You are a world-class creative director and senior social media strategist. Your task is to write high-converting, highly engaging, professional social media copy tailored to ${tone} tone and targeted for ${platform}. Maintain a sleek, modern, sophisticated voice.`;"
);
code = code.replace(
  /Your task is to write high-converting, highly engaging, professional social media copy tailored to \$\{tone\} tone and targeted for \$\{platform\}\.\\nMaintain a sleek, modern, sophisticated voice. Integrate high-value interior architecture terminology \\(e\.g\., 3D reliefs, 100% waterproof PVC, European design, NSR-10 fire retardation standards, FOB container wholesale distribution\\)\.\`;/,
  "Your task is to write high-converting, highly engaging, professional social media copy tailored to ${tone} tone and targeted for ${platform}.\\nMaintain a sleek, modern, sophisticated voice.`;"
);

// We need to do a safer replace using index or replace multiple
fs.writeFileSync('server.ts', code);
