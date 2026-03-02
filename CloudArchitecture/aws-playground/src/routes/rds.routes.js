/**
 * RDS (PostgreSQL) routes
 *
 * POST /rds/create  – body: { title, status? }  → create document, return it
 * GET  /rds/:id     – get document by UUID
 */

const express = require('express');
const rdsService = require('../services/rds.service');
const { trackEvent, trackException } = require('../config/cloudWatch');

const router = express.Router();

router.post('/create', async (req, res, next) => {
  try {
    const { title, status } = req.body || {};
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }
    const doc = await rdsService.createDocument(title, status || 'draft');
    trackEvent('RDS_INSERT_SUCCESS', { id: doc?.id });
    res.status(201).json(doc);
  } catch (err) {
    trackException(err, { operation: 'rds_create' });
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await rdsService.getDocumentById(id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(doc);
  } catch (err) {
    trackException(err, { operation: 'rds_get' });
    next(err);
  }
});

module.exports = router;
