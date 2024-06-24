import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Profile.module.css";
import { processPayment } from "@/utils/payment";
import { Auth } from "aws-amplify";
import { getTransactionDetails } from "@/lib/Transaction/getTransaction";
import WalletBalance from './wallet_balance_card';
import { createTransaction } from "@/lib/Transaction/createTransaction";
import { processGetuser } from '@/lib/users';

export default function Apply_industries_rating(props) {

    const [walletData, setWalletData] = useState(null);

    function handleModalClose() {
        props.onClose();
    }

    // useEffect hook is used to fetch data on component mount
    useEffect(() => {
        async function fetchWalletData() {
            try {
                const data = await getTransactionDetails(props.user_id);
                setWalletData(data?.data.rows[0].balance);
                // console.log("apply bal : ", data?.data.row[0].balance);

            } catch (error) {
                console.error("Error fetching wallet data:", error);
            }
        }

        fetchWalletData();

    }, []);

    function handleSubmit() {
        props.onSubmit();
    }

    async function handleWalletPay() {
        //1.get Wallet balance for current user
        //2. check balance is > 5,000
        //3. them process and deduct from wallet balance
        //4. Update wallet balance (-5,000)

        //Get user data from stipeuser table
        const stripeUser = await processGetuser(props.user_id);
        const dataGet = stripeUser.rows[0];
        // console.log("Stripe Id: ", stripeUser.rows[0]);

        // console.log("Balance: ", walletData);

        if (walletData > 5000) {
            const userData = { userid: dataGet.user_id, stripeid: dataGet.stripeid, trx_type: "retrieve", trx_amount: parseInt("-5000"), status: "complete" }
            createTransaction(userData);
        }
    }

    function handleDirectPay() {
        const apply_ind_amt = 5000;
        const paymentFor = "Apply For industries Rating"
        processPayment(props.sp_id, props.user_id, apply_ind_amt, paymentFor); //sending temporary SPId
        //console.log("sp_id and user id:", props.sp_id, " - ", user?.attributes?.sub);
    }


    return (
        <>
            <style jsx>
                {`
            * {
              color: white;
              font-family: courier;
            }
  
            hr {
              // width: 100px;
              // margin: auto;
              // height: 3px;
              // background-color: #f3ae09;
              // border: none;
              // opacity: 1;
            }
  
            input.input-box,
            textarea {
              background: black;
              border-color: black;
            }
  
            input.input-box,
            input {
              background: black;
              border-color: black;
              padding: 12px 10px 12px 10px;
            }
  
            ::placeholder {
              color: #b8b8b8;
              opacity: 1;
            }
  
            :-ms-input-placeholder {
              color: #b8b8b8;
            }
  
            ::-ms-input-placeholder {
              color: #b8b8b8;
            }
          `}
            </style>
            <div className={styles.bg_black}>
                <div className="">
                    <div className="row">
                        <div className={`card  ${styles.cardBg}`}>
                            <div className="card-body text-center text-white">
                                <h3>Please Enter Payment Details</h3>
                                <hr
                                    className="mb-4"
                                    style={{
                                        width: "100px",
                                        height: "3px",
                                        margin: "auto",
                                        backgroundColor: "#f3ae09",
                                        border: "none",
                                        opacity: 1,
                                    }}
                                />

                                <hr style={{ color: "#666873" }} />
                                <p>My Balance</p>
                                <h1>INR 5000</h1>
                                <hr style={{ color: "#666873" }} />
                                <form className="mt-4">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Card Number"
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Name of Card"
                                            />
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                                            <input
                                                type="date"
                                                className="form-control"
                                                placeholder="MM/YY"
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="cvv"
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-4">
                                        <div
                                            className={`col-lg-2 col-md-4 col-sm-5`}
                                            style={{ textAlign: "left" }}>
                                            {/* <a href="../../spUpload"> */}
                                            <button
                                                onClick={handleModalClose}
                                                type="button"
                                                className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn} `}>
                                                Cancel
                                            </button>
                                            {/* </a> */}
                                        </div>
                                        <div className="col-lg-8 col-md-4 col-sm-2"></div>

                                        <div
                                            className="col-lg-2 col-md-4 col-sm-5"
                                            style={{ textAlign: "right" }}>
                                            {/* <a href="../../spPreview"> */}
                                            <button
                                                onClick={handleSubmit}
                                                type="button"
                                                className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn}`}>
                                                Submit
                                            </button>

                                            {/* </a> */}
                                        </div>
                                        {/* from balance or direct pay start */}
                                        <div className="d-flex">
                                            <button
                                                onClick={handleWalletPay}
                                                type="button"
                                                className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn}`}>
                                                Wallet
                                            </button>

                                            <button
                                                onClick={handleDirectPay}
                                                type="button"
                                                className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn}`}>
                                                Payment Getaway
                                            </button>
                                        </div>


                                        {/* from balance or direct pay end */}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}