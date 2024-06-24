import { loadStripe } from '@stripe/stripe-js'
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const processPayment = async (SPId, userId, amount, paymentFor) => {
    try {
        const stripe = await loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);
        stripe.apiKey = `${process.env.STRIPE_SECRET_KEY}`;

        const response = await fetch(`/api/payment/charge-card/${SPId}?userId=${userId}&amount=${amount}&paymentFor=${paymentFor}`)
        const data = await response.json();
        await stripe.redirectToCheckout({ sessionId: data.id })
    } catch (error) {
        return { code: 400, message: "payment failed", error }
    }
}

const processSubscription = async (priceId, userId) => {
    const stripe = await loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);
    stripe.apiKey = `${process.env.STRIPE_SECRET_KEY}`;

    const response = await fetch(`/api/payment/subscription/${priceId}?userId=${userId}`);
    const data = await response.json();
    await stripe.redirectToCheckout({ sessionId: data.id });
}

const loadPortal = async (userId) => {
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    stripe.apiKey = process.env.STRIPE_SECRET_KEY;

    const response = await fetch(`/api/payment/portal?userId=${userId}`)
    const data = await response.json();
    window.open(data.url, '_blank');
}

const processPaymentIntent = async (amount, userId) => {
    const stripe = await loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);
    stripe.apiKey = `${process.env.STRIPE_SECRET_KEY}`;

    const response = await fetch(`/api/payment/wallet/${amount}?userId=${userId}`)
    const data = await response.json();

    return data;
}

const processPayout = async (amount, userId) => {

    try {
        const stripe = await loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);
        stripe.apiKey = `${process.env.STRIPE_SECRET_KEY}`;

        const response = await fetch(`/api/payment/payout/${amount}?userId=${userId}`)
        const data = await response.json();

        return data;
    } catch (error) {
        return { code: 400, message: "Withdraw failed", error }
    }
}

export { processPayment, processSubscription, loadPortal, processPaymentIntent, processPayout }
