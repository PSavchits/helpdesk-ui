const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use('/helpdesk-service', createProxyMiddleware({ target: 'http://localhost:8765', changeOrigin: true }));
    app.use('/history-service', createProxyMiddleware({ target: 'http://localhost:8765', changeOrigin: true }));
};
