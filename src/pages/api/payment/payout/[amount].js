import Stripe from 'stripe';
import { processGetuser } from '@/lib/users';
import { Amplify } from 'aws-amplify';
import config from "src/aws-exports"

Amplify.configure({ ...config, ssr: true });

async function CreatePayout(req, res) {
    const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

    const { amount, userId } = req.query;

    const stripeUser = await processGetuser(userId);

    const payouts = await stripe.payouts.create({
        amount: amount * 100,
        currency: 'inr',
    });

    return res.json({ payouts });
};

export default CreatePayout;