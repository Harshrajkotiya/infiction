import Stripe from 'stripe';
import { buffer } from 'micro';
import { processUpdateUser } from '../../../lib/users';
import { createTransaction } from '../../../lib/Transaction/createTransaction';
import { Amplify } from 'aws-amplify';
// import config from "src/aws-exports"

// Amplify.configure({...config,ssr:true});


export const config = { api: { bodyParser: false } }

export default async (req, res) => {
  const stripe_key = `${process.env.STRIPE_SECRET_KEY}`;

  if (!stripe_key) {
    return res.status(400);
  }

  const stripe = new Stripe(stripe_key);

  const reqBuffer = await buffer(req)
  const signature = req.headers['stripe-signature']
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret)
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  const { metadata } = event.data.object
  const stripeId = event.data.object.customer

  switch (event.type) {
    case 'charge.succeeded':
      if (metadata?.userId && metadata?.courseId) {
        // await processUpdateUser()

      }
      break
    case 'customer.subscription.created':
      const product = await stripe.products.retrieve(event.data.object.plan.product);
      if (stripeId) {
        const data = {
          isSubscribed: true,
          productid: event.data.object.plan.product,
          productname: product.name
        }

        const updatedUser = await processUpdateUser(stripeId, data);
      }
      break
    case 'customer.subscription.updated':
      if (stripeId) {
        // console.log("event.data", event.data.status)
        const data = {
          "isSubscribed": true,
        }
        // if(event.data.status === 'canceled'){
          // data["isSubscribed"] = false
        // }
        const updatedUser = await processUpdateUser(stripeId, data);
      }
      break
    case 'customer.subscription.paused':
      if (stripeId) {
        const data = {
          "isSubscribed": false,
        }
        const updatedUser = await processUpdateUser(stripeId, data);
      }
      break
    case 'customer.subscription.resumed':
      if (stripeId) {
        const data = {
          "isSubscribed": true,
        }
        const updatedUser = await processUpdateUser(stripeId, data);
      }
      break
    case 'customer.subscription.deleted':
      if (stripeId) {
        const data = {
          "isSubscribed": false,
        }
        const updatedUser = await processUpdateUser(stripeId, data);
      }
      break
      case 'payment_intent.payment_failed':
        if (stripeId) {
          const data= {
            stripeid : stripeId,
            trx_type: "topup",
            trx_amount: event.data.object.amount /100,
            status: "failed"
          }
          const transaction = await createTransaction(data);
        }
        break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.send({ received: true })
}