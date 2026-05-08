const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 8080;
const buildDir = path.join(__dirname, 'build');

const backendUrl = (() => {
  if (process.env.BACKEND_URL) return process.env.BACKEND_URL;
  if (process.env.PLATFORM_RELATIONSHIPS) {
    const rels = JSON.parse(
      Buffer.from(process.env.PLATFORM_RELATIONSHIPS, 'base64').toString('utf8'),
    );
    if (rels.backend && rels.backend[0]) {
      const r = rels.backend[0];
      return `${r.scheme}://${r.host}:${r.port}`;
    }
  }
  return null;
})();

if (!backendUrl) {
  console.warn('No backend relationship configured; /api requests will 502.');
}

app.use(
  '/api',
  createProxyMiddleware({
    target: backendUrl || 'http://127.0.0.1:0',
    changeOrigin: true,
    xfwd: true,
  }),
);

app.use(express.static(buildDir, { index: false }));
app.get('*', (_req, res) => res.sendFile(path.join(buildDir, 'index.html')));

app.listen(port, () => {
  console.log(`Listening on ${port}; backend=${backendUrl ?? 'unset'}`);
});
