/**
 * Cognito JWT Validation Middleware
 *
 * INTERVIEW CONCEPTS:
 * - OAuth2 / OIDC: Client gets token from Cognito User Pool; we validate issuer, audience, and signature.
 * - JWKS: JSON Web Key Set – public keys to verify JWT signature (fetched from Cognito's .well-known/jwks.json).
 * - RBAC: After validating token, you can read claims (cognito:groups, scopes) and enforce authorization.
 * - IAM vs Cognito: For user auth use Cognito; for service-to-service use IAM roles.
 *
 * Usage: Authorization: Bearer <token>
 * Set SKIP_AUTH=true to bypass (local dev only).
 */

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const SKIP_AUTH = process.env.SKIP_AUTH === 'true';
const COGNITO_ISSUER = process.env.COGNITO_ISSUER;
const COGNITO_AUDIENCE = process.env.COGNITO_AUDIENCE;
const COGNITO_JWKS_URI = process.env.COGNITO_JWKS_URI;

let jwks = null;

function getJwksClient() {
  if (!COGNITO_JWKS_URI) return null;
  if (!jwks) {
    jwks = jwksClient({
      jwksUri: COGNITO_JWKS_URI,
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
  if (!COGNITO_ISSUER || !COGNITO_AUDIENCE) {
    return res.status(501).json({
      error: 'Auth not configured',
      hint: 'Set COGNITO_ISSUER, COGNITO_AUDIENCE, COGNITO_JWKS_URI, or SKIP_AUTH=true for local dev',
    });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.slice(7);

  const options = {
    audience: COGNITO_AUDIENCE,
    issuer: COGNITO_ISSUER,
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
