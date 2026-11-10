const http = require('http');
const VERSION = '2.0';

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Andina Market</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #b8472a, #f2a541);
    }
    .card {
      background: #fff;
      padding: 48px 56px;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 12px 30px rgba(0,0,0,.25);
      max-width: 90%;
    }
    h1 { color: #b8472a; font-size: 2.4rem; margin-bottom: 8px; }
    .version {
      display: inline-block;
      background: #2e7d32;
      color: #fff;
      padding: 4px 16px;
      border-radius: 20px;
      font-weight: bold;
      margin: 12px 0;
    }
    p { color: #555; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Andina Market</h1>
    <span class="version">Versión ${VERSION}</span>
    <p>Desplegado automáticamente desde GitHub</p>
  </div>
</body>
</html>`;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}).listen(3000);
