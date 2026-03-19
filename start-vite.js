const path = require('path');
const clientDir = path.join(__dirname, 'client');
process.chdir(clientDir);
import(path.join(clientDir, 'node_modules', 'vite', 'dist', 'node', 'index.js')).then(async ({ createServer }) => {
  const server = await createServer({
    root: clientDir,
    server: { port: 5173 },
  });
  await server.listen();
  server.printUrls();
});
