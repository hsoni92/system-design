/**
 * Azure SQL routes
 *
 * POST /sql/create  – body: { title, status? }  → create document, return it
 * GET  /sql/:id     – get document by UUID
 */

const express = require('express');
const sqlService = require('../services/sql.service');
const { trackEvent, trackException } = require('../config/appInsights');

const router = express.Router();

router.post('/create', async (req, res, next) => {
  try {
    const { title, status } = req.body || {};
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }
    const doc = await sqlService.createDocument(title, status || 'draft');
    trackEvent('SQL_INSERT_SUCCESS', { id: doc.id });
    res.status(201).json(doc);
  } catch (err) {
    trackException(err, { operation: 'sql_create' });
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await sqlService.getDocumentById(id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(doc);
  } catch (err) {
    trackException(err, { operation: 'sql_get' });
    next(err);
  }
});

module.exports = router;
