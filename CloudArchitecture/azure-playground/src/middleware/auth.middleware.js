/**
 * Entra ID (Azure AD) JWT Validation Middleware
 *
 * INTERVIEW CONCEPTS:
 * - OAuth2 / OIDC: Client gets token from Entra ID; we validate issuer, audience, and signature.
 * - JWKS: JSON Web Key Set – public keys to verify JWT signature (fetched from Entra's discovery endpoint).
 * - RBAC: After validating token, you can read claims (roles, scopes) and enforce authorization.
 * - Managed Identity vs Service Principal: For server-to-server, use Managed Identity; for dev/test, use SP with client secret.
 *
 * Usage: Authorization: Bearer <token>
 * Set SKIP_AUTH=true to bypass (local dev only).
 */

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const SKIP_AUTH = process.env.SKIP_AUTH === 'true';
const ENTRA_ISSUER = process.env.ENTRA_ISSUER;
const ENTRA_AUDIENCE = process.env.ENTRA_AUDIENCE;
const ENTRA_JWKS_URI = process.env.ENTRA_JWKS_URI;

let jwks = null;

function getJwksClient() {
  if (!ENTRA_JWKS_URI) return null;
  if (!jwks) {
    jwks = jwksClient({
      jwksUri: ENTRA_JWKS_URI,
      cache: true,
      cacheMaxAge: 600000,
    });
  }
  return jwks;
}

function getSigningKey(header, callback) {
  const client = getJwksClient();
  if (!client) return callback(new Error('JWKS not configured'));
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key?.publicKey || key?.rsaPublicKey;
    callback(null, signingKey);
  });
}

/**
 * Middleware: validate JWT and attach decoded payload to req.user (for RBAC later).
 */
function authMiddleware(req, res, next) {
  if (SKIP_AUTH) {
    return next();
  }
  if (!ENTRA_ISSUER || !ENTRA_AUDIENCE) {
    return res.status(501).json({
      error: 'Auth not configured',
      hint: 'Set ENTRA_ISSUER, ENTRA_AUDIENCE, ENTRA_JWKS_URI, or SKIP_AUTH=true for local dev',
    });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.slice(7);

  const options = {
    audience: ENTRA_AUDIENCE,
    issuer: ENTRA_ISSUER,
    algorithms: ['RS256'],
  };

  jwt.verify(token, getSigningKey, options, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token', detail: err.message });
    }
    req.user = decoded;
    next();
  });
}

module.exports = { authMiddleware };
