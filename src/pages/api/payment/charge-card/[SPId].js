import Stripe from 'stripe';
import { processGetuser } from '@/lib/users';
import {Amplify} from 'aws-amplify';
import config from "src/aws-exports"

Amplify.configure({...config,ssr:true});

async function CreateStripePayment(req, res){
  const stripe_key = `${process.env.STRIPE_SECRET_KEY}`;

  if (!stripe_key){
    return res.status(400); 
  }

  const stripe = new Stripe(stripe_key);

  const { SPId, userId, amount, paymentFor } = req.query;

  const stripeUser = await processGetuser(userId);

  const lineItems = [
    {
      price_data: {
        currency: 'inr',
        product_data: {
          name: paymentFor,
        },
        unit_amount: parseInt(amount) * 100,
      },
      quantity: 1,
    },
  ]

  const session = await stripe.checkout.sessions.create({
    customer: stripeUser?.rows[0].stripeid || stripeUser?.stripeid,
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/payment?user_id=${stripeUser?.rows[0].user_id}&status=success&open=true`,
    cancel_url: `${process.env.CLIENT_URL}/payment?user_id=${stripeUser?.rows[0].user_id}&status=cancelled&open=true`,
    payment_intent_data: {
      metadata: {
        userId: stripeUser?.rows[0].id,
        SPId, 
      },
    },
  })
  return res.json({ id: session.id });
};

export default CreateStripePayment;