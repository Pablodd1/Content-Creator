import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
`      task = await (runway.textToVideo.create as any)({
        model: 'gen3a_turbo',
        promptText: promptText,
        ratio: ratio || '720:1280',
        duration: seconds || 5
      });`,
`      task = await (runway.textToVideo.create as any)({
        model: model || 'gen3a_turbo',
        promptText: promptText,
        ratio: ratio || '720:1280',
        duration: seconds || 5
      });`
);
fs.writeFileSync('server.ts', code);
