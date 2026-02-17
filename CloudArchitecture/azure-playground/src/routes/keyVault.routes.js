/**
 * Key Vault route
 *
 * GET /secret – fetch PLAYGROUND_SECRET from Key Vault (using DefaultAzureCredential)
 *
 * INTERVIEW: No secret in code or env for this value – fetched at runtime from Key Vault.
 */

const express = require('express');
const keyVaultService = require('../services/keyVault.service');
const { trackException } = require('../config/appInsights');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const value = await keyVaultService.getSecret();
    res.json({ secret: value });
  } catch (err) {
    trackException(err, { operation: 'keyvault_get' });
    next(err);
  }
});

module.exports = router;
