/**
 * Production Node.js entry point for Hostinger (and any Node host).
 *
 * Hostinger's Node panel expects a literal .js startup file and assigns the
 * port via process.env.PORT. This wraps Next.js's request handler in a plain
 * http server so the platform proxies us correctly.
 */
const http = require('node:http');
const next = require('next');

const port = parseInt(process.env.PORT || '3000', 10);
// Always bind to all interfaces. Some platforms (Windows, certain containers)
// set HOSTNAME to the machine name, which would make the port unreachable on
// localhost. The host proxy / firewall is responsible for restricting access.
const hostname = process.env.BIND_HOST || '0.0.0.0';
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http
      .createServer((req, res) => {
        handle(req, res).catch((err) => {
          console.error('[server] request error', err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
        });
      })
      .listen(port, hostname, () => {
        console.log(`> Ready on http://${hostname}:${port} (${dev ? 'dev' : 'production'})`);
      });
  })
  .catch((err) => {
    console.error('[server] failed to start', err);
    process.exit(1);
  });
