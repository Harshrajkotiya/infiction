import Stripe from 'stripe';
import { processGetuser } from '@/lib/users';
import {Amplify} from 'aws-amplify';
import config from "src/aws-exports"

Amplify.configure({...config,ssr:true});

export default async (req, res) => {
  const stripe_key = process.env.STRIPE_SECRET_KEY;

  if (!stripe_key){
    return res.status(400); 
  }

  const stripe = new Stripe(stripe_key);

  const { userId } = req.query;

  const stripeUser = await processGetuser(userId);
  // console.log("stripeUser", stripeUser);

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeUser?.rows[0].stripeid,
    return_url: process.env.CLIENT_URL,
  })

  return res.json({ url: session.url });
}