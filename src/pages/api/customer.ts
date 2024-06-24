import Stripe from 'stripe';
import { Amplify } from 'aws-amplify';
import config from "src/aws-exports"
import { processCreateUser } from '@/lib/users';

Amplify.configure({ ...config, ssr: true });

export default async function handle(req, res) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
        const { email, user_id } = req.body;

        const customer = await stripe.customers.create({
            email,
        });

        const userData = {stripeId: customer.id, email: email, user_id: user_id}
        const stripeCustomer = await processCreateUser(userData)        
        
        return res.status(200).json({
            code: 'store_customer_created',
            customer,
            stripeCustomer
        });
        
    } catch (e) {
        console.error(e);
        return res.status(400).json({
            code: 'customer_creation_failed',
            error: e,
        });
    }
}
