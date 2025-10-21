const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY?.trim());

// This route must be mounted before express.json so we can verify the signature
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Delegate to payments router logic by requiring it lazily
  try {
    // Reuse handlers from payments.js by importing its functions if exported
    // For now, just acknowledge; payments.js also has a webhook endpoint for local use
    // The important part is signature verification consistency in production
    res.json({ received: true });
  } catch (e) {
    console.error('Webhook processing error:', e);
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

module.exports = router;


