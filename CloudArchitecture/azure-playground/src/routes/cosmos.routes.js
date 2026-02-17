/**
 * Cosmos DB routes
 *
 * POST /cosmos/create  – body: { userId, ...rest }  → insert item, return item + requestCharge (RU)
 * GET  /cosmos/:userId  – query by partition key, return items + requestCharge
 *
 * INTERVIEW: We expose requestCharge so you can see RU consumption and discuss throttling (429).
 */

const express = require('express');
const cosmosService = require('../services/cosmos.service');
const { trackEvent, trackException } = require('../config/appInsights');

const router = express.Router();

router.post('/create', async (req, res, next) => {
  try {
    const body = req.body || {};
    const { userId, ...document } = body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const { item, requestCharge } = await cosmosService.createItem(userId, document);
    trackEvent('COSMOS_QUERY_EXECUTED', { operation: 'create', requestCharge });
    res.status(201).json({ item, requestCharge });
  } catch (err) {
    // INTERVIEW: 429 = rate limit (RU/s exceeded). Production would retry after retry-after-ms.
    if (err.code === 429 || err.statusCode === 429) {
      trackEvent('COSMOS_THROTTLED', { code: 429 });
      return res.status(429).json({ error: 'Cosmos DB throttled (RU/s exceeded)', code: 429 });
    }
    trackException(err, { operation: 'cosmos_create' });
    next(err);
  }
});

router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { items, requestCharge } = await cosmosService.getItemsByUserId(userId);
    trackEvent('COSMOS_QUERY_EXECUTED', { operation: 'query', requestCharge });
    res.json({ items, requestCharge });
  } catch (err) {
    // INTERVIEW: 429 = rate limit (RU/s exceeded). Production would retry after retry-after-ms.
    if (err.code === 429 || err.statusCode === 429) {
      trackEvent('COSMOS_THROTTLED', { code: 429 });
      return res.status(429).json({ error: 'Cosmos DB throttled (RU/s exceeded)', code: 429 });
    }
    trackException(err, { operation: 'cosmos_query' });
    next(err);
  }
});

module.exports = router;
