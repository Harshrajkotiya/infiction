import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';

const stripe = new Stripe(`${process.env.REACT_APP_STRIPE_SECRET_KEY}`);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Product Name',
            },
            unit_amount: 1000, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success', // Replace with your success URL
      cancel_url: 'http://localhost:3000/cancel', // Replace with your cancel URL
      client_reference_id: uuidv4(), // Optional, can be used to associate the session with your internal data
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
