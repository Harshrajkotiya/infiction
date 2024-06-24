import Stripe from 'stripe';
const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, { apiVersion: '2022-11-15' })

const createCustomer = async (email) => {
  const customer = await stripe.customers.create({
    email,
  });
  return customer
}

export { createCustomer }