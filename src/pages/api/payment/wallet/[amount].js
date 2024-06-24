import Stripe from 'stripe';
import { processGetuser } from '@/lib/users';
import {Amplify} from 'aws-amplify';
import config from "src/aws-exports"

Amplify.configure({...config,ssr:true});

async function CreatePaymentIntent(req, res) {
  const stripe_key = `${process.env.STRIPE_SECRET_KEY}`;

  if (!stripe_key){
    return res.status(400); 
  }

  const stripe = new Stripe(stripe_key);
  try {
    const { amount, userId } = req.query;
    const stripeUser = await processGetuser(userId);
    const paymentIntent = await stripe.paymentIntents.create({
      customer: stripeUser?.rows[0].stripeid,
      amount: amount * 100,
      currency: "inr"
    });
    return res.json({ paymentIntent });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default CreatePaymentIntent;