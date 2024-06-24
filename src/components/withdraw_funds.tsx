import { useState } from "react";
import styles from "../styles/Profile.module.css";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { processPaymentIntent, processPayout } from "@/utils/payment";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";


export default function WithdrawFunds(props) {
    const [inputValue, setInputValue] = useState('');
    const stripe = useStripe();
    const elements = useElements();
    const [checkoutError, setCheckoutError] = useState("");
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    stripe.key = `${process.env.STRIPE_SECRET_KEY}`
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = async e => {
        setIsLoading(true)
        e.preventDefault();
        try {
            const response = await processPayout(100, props.user_id)
            if (response.code === 400){
                setCheckoutSuccess(false);
                setCheckoutError(response.message);
            }else{
                setCheckoutSuccess(true);
            }
        } catch (error) {
            setCheckoutSuccess(false);
            setCheckoutError(error.message);
        }
        
        setIsLoading(false)
        props.onHide();
    };
    return (
        <>
            {/* <img onClick={props.onHide} src="../back_wallet_icon.svg" alt="back_wallet_icon" style={{
                width: "9%", position: "absolute",
                right: "6%", top: "2.5%"
            }} /> */}
            <div className="p-1" style={{ overflow: "auto" }}>
                <h3
                    style={{ color: "white", fontWeight: "bold" }}>
                    Withdraw Funds
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
                            ₹{props.balance}
                        </h3>
                    </div>
                </div>
                {/* <h5 className="mt-3" style={{ color: "white", fontWeight: "bold" }}>Fund Details</h5>
                <p style={{ color: "rgba(79, 83, 88, 0.8)" }}>
                    Lorem ipsum dolor sit amet consectetur. Est tincidunt donec bibendum
                    turpis erat.
                </p> */}
                <form onSubmit={handleSubmit}>
                    <div className="Add_funds mt-3">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Amount to withdraw"
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
                                : " Withdraw Balance"
                            }
                        </button>
                    </div>
                    <div className="w-75">
                        {checkoutSuccess && (
                            <Snackbar
                                open={checkoutSuccess}
                                autoHideDuration={6000}
                                onClose={() => setCheckoutSuccess(false)}
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            >
                                <Alert onClose={() => setCheckoutSuccess(false)} severity="success">
                                    Withdraw done successfully.
                                </Alert>
                            </Snackbar>
                        )}
                        {checkoutError && (
                            <Snackbar
                                open={checkoutError != null}
                                autoHideDuration={6000}
                                onClose={() => setCheckoutError(null)}
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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