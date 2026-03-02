/**
 * Entry point – start HTTP server
 *
 * Run: node src/server.js  (or npm start)
 * Requires .env with AWS config (see .env.example).
 */

require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`AWS Playground API listening on http://localhost:${PORT}`);
  console.log('  Health:   GET /health');
  console.log('  RDS:      POST /rds/create, GET /rds/:id');
  console.log('  DynamoDB: POST /dynamodb/create, GET /dynamodb/:userId');
  console.log('  Queue:    POST /queue/send, POST /queue/receive');
  console.log('  Secret:   GET /secret');
});
