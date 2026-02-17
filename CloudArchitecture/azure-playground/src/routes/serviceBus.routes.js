/**
 * Service Bus routes
 *
 * POST /queue/send    – body: any JSON  → send message to playground-queue
 * POST /queue/receive – receive one message (peek-lock), return body; optional ?complete=true to complete
 *
 * INTERVIEW: Peek-lock = message locked until complete/abandon. We complete in this demo when ?complete=true.
 */

const express = require('express');
const serviceBusService = require('../services/serviceBus.service');
const { trackEvent, trackException } = require('../config/appInsights');

const router = express.Router();

router.post('/send', async (req, res, next) => {
  try {
    const body = req.body || {};
    await serviceBusService.sendMessage(body);
    trackEvent('SERVICE_BUS_MESSAGE_SENT', {});
    res.status(202).json({ status: 'sent' });
  } catch (err) {
    trackException(err, { operation: 'queue_send' });
    next(err);
  }
});

router.post('/receive', async (req, res, next) => {
  let receiver;
  try {
    const complete = req.query.complete === 'true';
    const { message, receiver: rec } = await serviceBusService.receiveOneMessage();
    receiver = rec;

    if (!message) {
      await receiver.close();
      return res.json({ message: null, hint: 'No message in queue or timeout' });
    }

    const body = message.body;
    if (complete) {
      await serviceBusService.completeMessage(receiver, message);
      return res.json({ message: body, completed: true });
    }
    // Leave message locked – in real app you'd have another endpoint to complete by messageId
    await serviceBusService.abandonMessage(receiver, message);
    res.json({ message: body, completed: false, hint: 'Use ?complete=true to remove from queue' });
  } catch (err) {
    if (receiver) {
      try {
        await receiver.close();
      } catch (_) {}
    }
    trackException(err, { operation: 'queue_receive' });
    next(err);
  }
});

module.exports = router;
