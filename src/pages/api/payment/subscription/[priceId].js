import Stripe from 'stripe';
import { processGetuser } from '@/lib/users';
import {Amplify} from 'aws-amplify';
import config from "src/aws-exports"

Amplify.configure({...config,ssr:true});

async function CreateStripeSubscription(req, res) {
  const stripe_key = `${process.env.STRIPE_SECRET_KEY}`;

  if (!stripe_key){
    return res.status(400); 
  }

  const stripe = new Stripe(stripe_key);
  const { priceId, userId } = req.query;

  const stripeUser = await processGetuser(userId);

  const lineItems = [
    {
      price: priceId,
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    customer: stripeUser.rows[0].stripeid,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${process.env.CLIENT_URL}/dashboard`,
    cancel_url: `${process.env.CLIENT_URL}/payment?user_id=${userId}&status=cancelled`,
    metadata: {
      userId: stripeUser.rows[0].id,
    },
    subscription_data: {
      "trial_period_days": 365,
      trial_settings:{
        end_behavior:{
          missing_payment_method: "cancel"
        }
      }
    },
    
  });

  return res.json({ id: session.id });
};

export default CreateStripeSubscription;