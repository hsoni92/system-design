/**
 * Entry point – start HTTP server
 *
 * Run: node src/server.js  (or npm start)
 * Requires .env with Azure config (see .env.example).
 */

require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Azure Playground API listening on http://localhost:${PORT}`);
  console.log('  Health: GET /health');
  console.log('  SQL:    POST /sql/create, GET /sql/:id');
  console.log('  Cosmos: POST /cosmos/create, GET /cosmos/:userId');
  console.log('  Queue:  POST /queue/send, POST /queue/receive');
  console.log('  Secret: GET /secret');
});
