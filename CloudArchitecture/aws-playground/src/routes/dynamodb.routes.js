/**
 * DynamoDB routes
 *
 * POST /dynamodb/create  – body: { userId, ...rest }  → insert item, return item + consumedCapacity
 * GET  /dynamodb/:userId – query by partition key, return items + consumedCapacity
 *
 * INTERVIEW: We expose consumedCapacity so you can see capacity consumption and discuss throttling (429).
 */

const express = require('express');
const dynamodbService = require('../services/dynamodb.service');
const { trackEvent, trackException } = require('../config/cloudWatch');

const router = express.Router();

router.post('/create', async (req, res, next) => {
  try {
    const body = req.body || {};
    const { userId, ...document } = body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const { item, consumedCapacity } = await dynamodbService.createItem(userId, document);
    trackEvent('DYNAMODB_QUERY_EXECUTED', { operation: 'create', consumedCapacity });
    res.status(201).json({ item, consumedCapacity });
  } catch (err) {
    if (err.name === 'ProvisionedThroughputExceededException' || err.$metadata?.httpStatusCode === 429) {
      trackEvent('DYNAMODB_THROTTLED', { code: 429 });
      return res.status(429).json({
        error: 'DynamoDB throttled (capacity exceeded)',
        code: 429,
      });
    }
    trackException(err, { operation: 'dynamodb_create' });
    next(err);
  }
});

router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { items, consumedCapacity } = await dynamodbService.getItemsByUserId(userId);
    trackEvent('DYNAMODB_QUERY_EXECUTED', { operation: 'query', consumedCapacity });
    res.json({ items, consumedCapacity });
  } catch (err) {
    if (err.name === 'ProvisionedThroughputExceededException' || err.$metadata?.httpStatusCode === 429) {
      trackEvent('DYNAMODB_THROTTLED', { code: 429 });
      return res.status(429).json({
        error: 'DynamoDB throttled (capacity exceeded)',
        code: 429,
      });
    }
    trackException(err, { operation: 'dynamodb_query' });
    next(err);
  }
});

module.exports = router;
