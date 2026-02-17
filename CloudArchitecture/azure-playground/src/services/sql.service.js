/**
 * Azure SQL Service – Relational workload
 *
 * INTERVIEW CONCEPTS:
 * - Connection pooling: we use mssql's built-in pool to reuse connections.
 * - Firewall: Azure SQL has a server firewall; your IP (or VNet) must be allowed.
 * - DTU vs vCore: DTU = blended unit; vCore = predictable CPU/memory (mention in interviews).
 * - Geo-replication / read replicas: Azure SQL supports failover and read-scale.
 * - ACID: Azure SQL is fully transactional.
 *
 * Table: Documents (id UUID, title string, status string, createdAt datetime)
 */

const sql = require('mssql');
const crypto = require('crypto');

let pool = null;

async function getPool() {
  const connStr = process.env.AZURE_SQL_CONNECTION_STRING;
  if (!connStr) throw new Error('AZURE_SQL_CONNECTION_STRING is not set');
  if (!pool) {
    pool = await sql.connect(connStr);
  }
  return pool;
}

/**
 * Create a document row. Returns the created document.
 */
async function createDocument(title, status = 'draft') {
  const id = crypto.randomUUID();
  const pool = await getPool();
  await pool.request()
    .input('id', sql.UniqueIdentifier, id)
    .input('title', sql.NVarChar(500), title)
    .input('status', sql.NVarChar(50), status)
    .query(`
      IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Documents')
        CREATE TABLE Documents (
          id UNIQUEIDENTIFIER PRIMARY KEY,
          title NVARCHAR(500),
          status NVARCHAR(50),
          createdAt DATETIME2 DEFAULT GETUTCDATE()
        );
      INSERT INTO Documents (id, title, status) VALUES (@id, @title, @status);
    `);
  const [row] = await pool.request()
    .input('id', sql.UniqueIdentifier, id)
    .query('SELECT id, title, status, createdAt FROM Documents WHERE id = @id')
    .then(r => r.recordset);
  return row;
}

/**
 * Get document by id.
 */
async function getDocumentById(id) {
  const pool = await getPool();
  const result = await pool.request()
    .input('id', sql.UniqueIdentifier, id)
    .query('SELECT id, title, status, createdAt FROM Documents WHERE id = @id');
  return result.recordset[0] || null;
}

module.exports = { createDocument, getDocumentById };
