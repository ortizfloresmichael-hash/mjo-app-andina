const http = require('http');
const VERSION = '3.0';

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Andina Market</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #faf6f1; color: #2b2b2b; }
    .promo { background: #2e7d32; color: #fff; text-align: center; padding: 8px; font-size: .9rem; }
    header { background: #b8472a; color: #fff; padding: 14px 32px; display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
    .logo { font-size: 1.6rem; font-weight: bold; }
    .logo span { color: #f2a541; }
    .search { flex: 1; min-width: 200px; display: flex; }
    .search input { flex: 1; padding: 10px 14px; border: none; border-radius: 8px 0 0 8px; font-size: 1rem; }
    .search button { padding: 10px 18px; border: none; background: #f2a541; font-weight: bold; border-radius: 0 8px 8px 0; cursor: pointer; }
    .cart { background: #fff; color: #b8472a; padding: 10px 16px; border-radius: 8px; font-weight: bold; }
    nav { background: #fff; padding: 12px 32px; display: flex; gap: 24px; flex-wrap: wrap; border-bottom: 1px solid #e8dfd5; font-size: .95rem; }
    nav a { color: #555; text-decoration: none; }
    nav a:hover { color: #b8472a; }
    .banner { margin: 24px 32px; padding: 40px; border-radius: 16px; color: #fff;
      background: linear-gradient(135deg, #b8472a, #f2a541); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    .banner h2 { font-size: 2rem; margin-bottom: 8px; }
    .banner .big { font-size: 5rem; }
    main { padding: 0 32px 32px; }
    h3.title { margin: 8px 0 16px; font-size: 1.4rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 20px; }
    .product { background: #fff; border-radius: 14px; padding: 20px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,.08); position: relative; transition: transform .15s; }
    .product:hover { transform: translateY(-4px); }
    .tag { position: absolute; top: 12px; left: 12px; background: #c62828; color: #fff; font-size: .75rem; padding: 3px 10px; border-radius: 12px; font-weight: bold; }
    .emoji { font-size: 4rem; margin: 12px 0; }
    .product h4 { margin-bottom: 4px; }
    .origin { color: #888; font-size: .85rem; margin-bottom: 10px; }
    .price { color: #b8472a; font-size: 1.3rem; font-weight: bold; margin-bottom: 12px; }
    .old { color: #999; text-decoration: line-through; font-size: .9rem; font-weight: normal; margin-left: 6px; }
    .add { width: 100%; padding: 10px; border: none; background: #2e7d32; color: #fff; font-weight: bold; border-radius: 8px; cursor: pointer; }
    .add:hover { background: #1b5e20; }
    .benefits { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; padding: 24px 32px; background: #fff; border-top: 1px solid #e8dfd5; text-align: center; }
    .benefits div { font-size: .95rem; }
    .benefits b { display: block; font-size: 1.6rem; margin-bottom: 4px; }
    footer { background: #2b2b2b; color: #ccc; text-align: center; padding: 20px; font-size: .85rem; }
    footer .ver { display: inline-block; background: #2e7d32; color: #fff; padding: 3px 12px; border-radius: 12px; margin-left: 8px; font-weight: bold; }
    #toast { position: fixed; bottom: 24px; right: 24px; background: #2e7d32; color: #fff; padding: 12px 20px; border-radius: 8px; opacity: 0; transition: opacity .3s; }
  </style>
</head>
<body>
  <div class="promo">Envío gratis en compras desde S/ 100 a todo el Perú</div>
  <header>
    <div class="logo">Andina<span>Market</span></div>
    <div class="search">
      <input id="q" type="text" placeholder="Buscar productos andinos...">
      <button onclick="buscar()">Buscar</button>
    </div>
    <div class="cart">🛒 Carrito: <span id="count">0</span> | S/ <span id="total">0.00</span></div>
  </header>
  <nav>
    <a href="#">Granos</a><a href="#">Superalimentos</a><a href="#">Café y cacao</a>
    <a href="#">Miel y dulces</a><a href="#">Ofertas</a>
  </nav>

  <section class="banner">
    <div>
      <h2>Sabores de los Andes, en tu puerta</h2>
      <p>Productos directo del productor, frescos y de comercio justo.</p>
    </div>
    <div class="big">🏔️</div>
  </section>

  <main>
    <h3 class="title">Productos destacados</h3>
    <div class="grid" id="grid"></div>
  </main>

  <section class="benefits">
    <div><b>🚚</b>Envíos a todo el país</div>
    <div><b>🌱</b>100% natural y orgánico</div>
    <div><b>🤝</b>Comercio justo</div>
    <div><b>🔒</b>Pago seguro</div>
  </section>

  <footer>
    © 2026 Andina Market · Lima, Perú · Desplegado automáticamente desde GitHub
    <span class="ver">Versión ${VERSION}</span>
  </footer>
  <div id="toast"></div>

  <script>
    var productos = [
      { n: 'Quinua blanca', o: 'Puno', p: 12.90, old: 15.90, e: '🌾', tag: 'Oferta' },
      { n: 'Papa nativa', o: 'Huancavelica', p: 8.50, e: '🥔' },
      { n: 'Café de altura', o: 'Cusco', p: 28.00, e: '☕', tag: 'Nuevo' },
      { n: 'Cacao orgánico', o: 'San Martín', p: 22.50, e: '🍫' },
      { n: 'Maca en polvo', o: 'Junín', p: 18.00, old: 21.00, e: '🥣', tag: 'Oferta' },
      { n: 'Miel de abeja', o: 'Ayacucho', p: 16.50, e: '🍯' },
      { n: 'Maíz morado', o: 'Arequipa', p: 9.90, e: '🌽' },
      { n: 'Palta Hass', o: 'La Libertad', p: 11.00, e: '🥑', tag: 'Nuevo' }
    ];
    var count = 0, total = 0;

    function mostrar(lista) {
      var g = document.getElementById('grid');
      g.innerHTML = '';
      lista.forEach(function (x) {
        var d = document.createElement('div');
        d.className = 'product';
        d.innerHTML =
          (x.tag ? '<span class="tag">' + x.tag + '</span>' : '') +
          '<div class="emoji">' + x.e + '</div>' +
          '<h4>' + x.n + '</h4>' +
          '<div class="origin">Origen: ' + x.o + '</div>' +
          '<div class="price">S/ ' + x.p.toFixed(2) +
          (x.old ? '<span class="old">S/ ' + x.old.toFixed(2) + '</span>' : '') + '</div>' +
          '<button class="add">Agregar al carrito</button>';
        d.querySelector('.add').onclick = function () { agregar(x); };
        g.appendChild(d);
      });
    }

    function agregar(x) {
      count++;
      total += x.p;
      document.getElementById('count').textContent = count;
      document.getElementById('total').textContent = total.toFixed(2);
      var t = document.getElementById('toast');
      t.textContent = x.n + ' agregado al carrito';
      t.style.opacity = 1;
      setTimeout(function () { t.style.opacity = 0; }, 1500);
    }

    function buscar() {
      var q = document.getElementById('q').value.toLowerCase();
      mostrar(productos.filter(function (x) {
        return x.n.toLowerCase().indexOf(q) !== -1 || x.o.toLowerCase().indexOf(q) !== -1;
      }));
    }

    mostrar(productos);
  </script>
</body>
</html>`;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}).listen(3000);
