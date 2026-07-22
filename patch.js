import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
`      if (hasBuild) {
        console.log('Static build files found. Falling back to static file serving.');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      } else {`,
`      if (hasBuild) {
        console.log('Static build files found. Falling back to static file serving.');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          if (fs.existsSync(path.join(distPath, 'index.html'))) {
            res.sendFile(path.join(distPath, 'index.html'));
          } else {
            res.status(503).send('Application is currently starting or building. Please reload in a few seconds.');
          }
        });
      } else {`
);
fs.writeFileSync('server.ts', code);
