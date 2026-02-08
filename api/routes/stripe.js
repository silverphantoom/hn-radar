const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'HN Radar Pro',
            description: 'AI-curated business opportunities daily',
          },
          unit_amount: 1200, // $12/month
          recurring: { interval: 'month' }
        },
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${req.headers.origin}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/landing.html`,
    });
    
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook handler
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle events
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Add subscriber to database
      console.log('Payment succeeded:', session.customer_email);
      break;
    case 'invoice.paid':
      // Handle recurring payment
      break;
    case 'invoice.payment_failed':
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  res.json({received: true});
});

module.exports = router;