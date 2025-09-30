const { createProxyMiddleware } = require('http-proxy-middleware'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = function setupProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
      secure: false,
      cookieDomainRewrite: {
        '*': 'localhost',
      },
      onProxyReq: (proxyReq, req, _res) => {
        // Forward cookies from the original request
        if (req.headers.cookie) {
          proxyReq.setHeader('cookie', req.headers.cookie);
        }
      },
      onProxyRes: (proxyRes, _req, _res) => {
        // Forward set-cookie headers from the backend
        if (proxyRes.headers['set-cookie']) {
          // eslint-disable-next-line no-param-reassign
          proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map((cookie) => cookie.replace(/; Secure/gi, ''));
        }
      },
    }),
  );
};
