import { useEffect, useState } from "react";
import styles from "../styles/Profile.module.css";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { processPaymentIntent } from "@/utils/payment";
import { getTransactionDetails } from "@/lib/Transaction/getTransaction";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { processGetuser } from "@/lib/users";
import { createTransaction } from "@/lib/Transaction/createTransaction";


export default function Add_funds(props) {
    const [inputValue, setInputValue] = useState('');
    const stripe = useStripe();
    const elements = useElements();
    const [checkoutError, setCheckoutError] = useState(null);
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    stripe.key = `${process.env.STRIPE_SECRET_KEY}`
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    async function fetchWalletData() {
        try {
            const data = await getTransactionDetails(props.user_id);
            // console.log("data", data);
            props.setWalletData(data?.data.rows[0]);
        } catch (error) {
            console.error("Error fetching wallet data:", error);
        }
    }

    const inputStyle = {
        // iconColor: '#c4f0ff',
        color: '#f3ae09',
        fontWeight: '500',
        fontFamily: 'courier',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
            color: 'white',
        },
        '::placeholder': {
            color: 'white',
        },
    }

    const handleSubmit = async e => {
        setIsLoading(true)
        e.preventDefault();
        if (parseFloat(inputValue) <= 99999999) {

            const stripeUser = await processGetuser(props.user_id);
            const createdPaymentIntent = await processPaymentIntent(inputValue, props.user_id)

            try {
                const {
                    error,
                    paymentIntent
                } = await stripe.confirmCardPayment(createdPaymentIntent.paymentIntent.client_secret, {
                    payment_method: {
                        card: elements.getElement(CardElement)
                    }
                });

                // console.log("paymentIntent", paymentIntent);
                if (error) throw new Error(error.message);

                if (paymentIntent?.status === "succeeded") {
                    const data = {
                        stripeid: stripeUser?.rows[0].stripeid || stripeUser?.stripeid,
                        userid: props.user_id,
                        trx_type: "topup",
                        trx_amount: inputValue,
                        status: "completed"
                    }
                    const transaction = await createTransaction(data);
                    setCheckoutSuccess(true);
                    fetchWalletData();
                    props.onHide();
                }
            } catch (err) {
                setCheckoutSuccess(false);
                setCheckoutError(err.message);
                props.onHide();

            }
        }else{
            setCheckoutSuccess(false);
            setCheckoutError("Add Fund amount must be no more than ₹999,999.99");
        }
        setIsLoading(false);
    };
    return (
        <>
            <img onClick={props.onHide} src="../back_wallet_icon.svg" alt="back_wallet_icon" style={{
                width: "9%", position: "absolute",
                right: "6%", top: "2.5%"
            }} />
            <div className="p-1" style={{ overflow: "auto" }}>
                <h3
                    style={{ color: "white", fontWeight: "bold" }}>
                    Add Funds
                </h3>
                <div
                    style={{
                        background: "rgba(64, 68, 73, 0.4)",
                        borderRadius: "10px",
                    }}
                    className="p-2 pb-2">
                    <img src="../wallet_icon_yellow.svg" alt="edit_profile_icon" />{" "}
                    <span style={{ color: "rgba(79, 83, 88, 0.8)" }}>
                        My SIKKA Balance
                    </span>
                    <div className="d-flex justify-content-between">
                        <h3 className="ms-4" style={{ color: "white" }}>
                            ₹{props.balance ? props.balance === null ? 0 : props.balance : 0}
                        </h3>
                    </div>
                </div>
                <h5 className="mt-3" style={{ color: "white", fontWeight: "bold" }}>Fund Details</h5>
                <p style={{ color: "rgba(79, 83, 88, 0.8)" }}>
                    Lorem ipsum dolor sit amet consectetur. Est tincidunt donec bibendum
                    turpis erat.
                </p>
                <CardElement options={{
                    style: {
                        base: inputStyle,
                    },
                }} />

                <form onSubmit={handleSubmit}>
                    <div className="Add_funds mt-3">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Amount to be added"
                            name="Amount to be added"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mt-3">
                        <button
                            disabled={!inputValue}
                            type="submit"
                            className={`btn btn-outline-secondary ${styles.cancel_btn}`}>

                            {isLoading ?
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                : "Add Balance"
                            }
                        </button>
                    </div>
                    {/* {checkoutError && <span style={{ color: "red" }}>{checkoutError}</span>}
                    {checkoutSuccess && <span style={{ color: "green" }}>Fund added successfully</span>} */}
                    <div className="w-75">
                        {checkoutSuccess && (
                            <Snackbar
                                open={checkoutSuccess}
                                autoHideDuration={6000}
                                onClose={() => setCheckoutSuccess(false)}
                                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            >
                                <Alert onClose={() => setCheckoutSuccess(false)} severity="success">
                                    Fund added successfully.
                                </Alert>
                            </Snackbar>
                        )}
                        {checkoutError && (
                            <Snackbar
                                open={checkoutError != null}
                                autoHideDuration={6000}
                                onClose={() => setCheckoutError(null)}
                                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            >
                                <Alert onClose={() => setCheckoutError(null)} severity="error">
                                    {checkoutError}
                                </Alert>
                            </Snackbar>
                        )}
                    </div>

                </form>

            </div>
        </>
    )
}
