const http = require('http');
const https = require('https');
const PORT = process.env.PORT || 10000;
const server = http.createServer((req, res) => {
    // Разрешаем CORS-запросы
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    // Подменяем хост на официальный API Google
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: req.url,
        method: req.method,
        headers: { ...req.headers, host: 'generativelanguage.googleapis.com' }
    };
    const proxyReq = https.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });
    req.pipe(proxyReq);
    proxyReq.on('error', (e) => {
        res.writeHead(500);
        res.end(e.message);
    });
});
server.listen(PORT, () => {
    console.log('Proxy running on port ${PORT}');
});
