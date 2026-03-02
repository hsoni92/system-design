/**
 * RDS (PostgreSQL) Service – Relational workload
 *
 * INTERVIEW CONCEPTS:
 * - Connection pooling: pg.Pool reuses connections for efficiency.
 * - Security groups: RDS is in a VPC; allow app SG to reach DB SG on port 5432.
 * - Multi-AZ / read replicas: RDS supports failover and read scaling.
 * - ACID: PostgreSQL is fully transactional.
 *
 * Table: Documents (id UUID, title text, status text, createdAt timestamptz)
 */

const { Pool } = require('pg');
const crypto = require('crypto');

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS "Documents" (
    id UUID PRIMARY KEY,
    title VARCHAR(500),
    status VARCHAR(50),
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
  );
`;

let pool = null;

function getPoolConfig() {
  const host = process.env.PGHOST;
  const port = process.env.PGPORT || 5432;
  const user = process.env.PGUSER;
  const password = process.env.PGPASSWORD;
  const database = process.env.PGDATABASE;
  if (!host || !user || !password || !database) {
    throw new Error('PGHOST, PGUSER, PGPASSWORD, PGDATABASE are required');
  }
  return { host, port: parseInt(port, 10), user, password, database };
}

function getPool() {
  if (!pool) {
    pool = new Pool(getPoolConfig());
  }
  return pool;
}

/**
 * Ensure Documents table exists (idempotent).
 */
async function ensureTable() {
  const p = getPool();
  await p.query(CREATE_TABLE_SQL);
}

/**
 * Create a document row. Returns the created document.
 */
async function createDocument(title, status = 'draft') {
  const id = crypto.randomUUID();
  const p = getPool();
  await ensureTable();
  await p.query(
    'INSERT INTO "Documents" (id, title, status) VALUES ($1, $2, $3)',
    [id, title, status]
  );
  const result = await p.query(
    'SELECT id, title, status, "createdAt" FROM "Documents" WHERE id = $1',
    [id]
  );
  const row = result.rows[0];
  return row ? { id: row.id, title: row.title, status: row.status, createdAt: row.createdAt } : null;
}

/**
 * Get document by id.
 */
async function getDocumentById(id) {
  const p = getPool();
  const result = await p.query(
    'SELECT id, title, status, "createdAt" FROM "Documents" WHERE id = $1',
    [id]
  );
  const row = result.rows[0];
  return row ? { id: row.id, title: row.title, status: row.status, createdAt: row.createdAt } : null;
}

module.exports = { createDocument, getDocumentById };
