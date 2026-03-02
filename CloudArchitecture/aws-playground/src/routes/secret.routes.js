/**
 * Secrets Manager route
 *
 * GET /secret – fetch secret from Secrets Manager (using default credential chain)
 *
 * INTERVIEW: No secret in code or env for this value – fetched at runtime from Secrets Manager.
 */

const express = require('express');
const secretsManagerService = require('../services/secretsManager.service');
const { trackException } = require('../config/cloudWatch');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const value = await secretsManagerService.getSecret();
    res.json({ secret: value });
  } catch (err) {
    trackException(err, { operation: 'secrets_get' });
    next(err);
  }
});

module.exports = router;
