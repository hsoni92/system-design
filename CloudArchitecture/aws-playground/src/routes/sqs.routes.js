/**
 * SQS routes
 *
 * POST /queue/send    – body: any JSON  → send message to queue
 * POST /queue/receive – receive one message; optional ?delete=true to delete after receive
 *
 * INTERVIEW: Visibility timeout hides message until delete or timeout; then redelivery. Use delete=true to remove after processing.
 */

const express = require('express');
const sqsService = require('../services/sqs.service');
const { trackEvent, trackException } = require('../config/cloudWatch');

const router = express.Router();

router.post('/send', async (req, res, next) => {
  try {
    const body = req.body || {};
    await sqsService.sendMessage(body);
    trackEvent('SQS_MESSAGE_SENT', {});
    res.status(202).json({ status: 'sent' });
  } catch (err) {
    trackException(err, { operation: 'queue_send' });
    next(err);
  }
});

router.post('/receive', async (req, res, next) => {
  try {
    const shouldDelete = req.query.delete === 'true';
    const { message, receiptHandle } = await sqsService.receiveOneMessage();

    if (!message) {
      return res.json({ message: null, hint: 'No message in queue or timeout' });
    }

    if (shouldDelete && receiptHandle) {
      await sqsService.deleteMessage(receiptHandle);
      return res.json({ message, deleted: true });
    }
    res.json({
      message,
      deleted: false,
      hint: 'Use ?delete=true to remove message from queue after receive',
    });
  } catch (err) {
    trackException(err, { operation: 'queue_receive' });
    next(err);
  }
});

module.exports = router;
