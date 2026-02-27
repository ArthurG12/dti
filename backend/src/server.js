const express = require('express');
const cors = require('cors');
const { initDb } = require('./database/db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api', routes);
app.use(errorHandler);

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 DTI Order System API rodando em http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Falha ao inicializar o banco de dados:', err);
  process.exit(1);
});

module.exports = app;
