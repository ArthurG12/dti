const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../data/shop.db');

let db;

async function initDb() {
  if (db) return db;

  const initSqlJs = require('sql.js');
  const SQL = await initSqlJs();

  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  initSchema();
  seedProducts();
  persist();

  return db;
}

function bindParams(sql, params = []) {
  let i = 0;
  return sql.replace(/\?/g, () => {
    const val = params[i++];
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return val;
    return `'${String(val).replace(/'/g, "''")}'`;
  });
}

function query(sql, params = []) {
  const result = db.exec(bindParams(sql, params));
  if (!result || result.length === 0) return [];
  const { columns, values } = result[0];
  return values.map(row =>
    Object.fromEntries(columns.map((col, i) => [col, row[i]]))
  );
}

function queryOne(sql, params = []) {
  return query(sql, params)[0] || null;
}

function run(sql, params = []) {
  db.exec(bindParams(sql, params));
  const lastId = db.exec('SELECT last_insert_rowid() as id');
  return { lastInsertRowid: lastId?.[0]?.values?.[0]?.[0] ?? null };
}

function persist() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT
    );
    CREATE TABLE IF NOT EXISTS carts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cart_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (cart_id) REFERENCES carts(id),
      FOREIGN KEY (product_id) REFERENCES products(id),
      UNIQUE(cart_id, product_id)
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cart_id INTEGER NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'placed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cart_id) REFERENCES carts(id)
    );
  `);
}

function seedProducts() {
  const count = queryOne('SELECT COUNT(*) as count FROM products');
  if (count && count.count > 0) return;

  const products = [
    ['Fone de Ouvido Sem Fio', 'Fone over-ear premium com cancelamento de ruído e bateria de 30h.', 899.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'],
    ['Teclado Mecânico', 'Teclado mecânico TKL com iluminação RGB e switches táteis.', 5299.99, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80'],
    ['Hub USB-C 7 em 1', 'Hub USB-C com HDMI 4K, 3x USB-A, leitor de cartão SD e carregamento PD.', 299.99, 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&q=80'],
    ['Webcam Full HD 1080p', 'Webcam Full HD com microfone embutido e correção automática de luz.', 429.99, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80'],
    ['Mouse Ergonômico', 'Mouse vertical ergonômico, reduz fadiga no pulso, 6 botões programáveis.', 239.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80'],
    ['Suporte para Monitor', 'Suporte ajustável de alumínio com hub USB e gaveta de armazenamento.', 369.99, 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80'],
    ['Luminária LED de Mesa', 'Luminária LED inteligente com carregador wireless e porta USB.', 2129.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80'],
    ['Kit Organizador de Cabos', 'Kit com 50 peças para organização de cabos: velcro, clips e capas.', 129.99, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'],
  ];

  for (const [name, description, price, image] of products) {
    run(`INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)`,
      [name, description, price, image]);
  }
  persist();
}

module.exports = { initDb, query, queryOne, run, persist };
