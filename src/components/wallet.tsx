import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import styles from "../styles/Profile.module.css";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Wallet_transaction_history from "./wallet_transaction_history";
import Earning from "./wallet_earning";
import Add_funds from "./add_funds";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { getTransactionDetails } from "@/lib/Transaction/getTransaction";
import WithdrawFunds from "./withdraw_funds";
import { useQuery } from "react-query";

const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);

export default function Wallet(props) {
  stripePromise.apiKey = `${process.env.STRIPE_SECRET_KEY}`;

  const [Addfunds, showAddfunds] = useState(false);
  const [withdrawfunds, showWithdrawfunds] = useState(false);

  const [walletData, setWalletData] = useState(null);

  function openAddfunds() {
    showAddfunds(true)
  }
  function closeAddfunds() {
    showAddfunds(false)
  }

  useEffect(() => {
    async function fetchWalletData() {
      try {
        const data = await getTransactionDetails(props.user_id);
        // console.log("data", data);
        
        setWalletData(data?.data.rows[0]);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    }

    fetchWalletData();
  }, []);

  return (
    <>
      <Elements stripe={stripePromise}>
        <Offcanvas
          className="p-2"
          show={props.show}
          onHide={props.onClose}
          placement={"end"}
          style={{ backgroundColor: "#040910" }}>
          <Offcanvas.Header closeButton className="canvasclose" />
          {!Addfunds && !withdrawfunds ? (
            <div className="p-1" style={{ overflow: "auto", }}>
              <h2
                className=" ms-3"
                style={{ color: "white", fontWeight: "bolder" }}>
                InFiction Wallet
              </h2>
              <div
                style={{
                  background: "rgba(64, 68, 73, 0.4)",
                  borderRadius: "10px",
                }}
                className="p-2 pb-4">
                <img src="../wallet_icon_yellow.svg" alt="edit_profile_icon" />{" "}
                <span style={{ color: "rgba(79, 83, 88, 0.8)" }}>
                  My SIKKA Balance
                </span>
                <div className="d-flex justify-content-between">
                  <h3 className="ms-4" style={{ color: "white" }}>
                    ₹{walletData ? walletData.balance === null ? 0 : walletData.balance : 0}
                  </h3>
                  <div className="" style={{ textAlign: "right" }}>
                    <button
                      onClick={openAddfunds}
                      type="submit"
                      className={`btn btn-outline-secondary ${styles.cancel_btn}`}>
                      Add Balance
                    </button>
                  </div>
                </div>
              </div>

              <div
                style={{
                  border: "1px solid #666873",
                  borderRadius: "5px",
                }}
                className="p-2 pb-4 mt-3">
                <img src="../wallet_icon_yellow.svg" alt="edit_profile_icon" />{" "}
                <span style={{ color: "rgba(79, 83, 88, 0.8)" }}>
                  Withdrawal
                </span>
                <div className="d-flex justify-content-between">
                  <h3 className="ms-4" style={{ color: "white" }}>
                    ₹{walletData ? walletData.withdraw === null ? 0 : walletData.withdraw.slice(1,walletData.withdraw.length) : 0}
                  </h3>
                  <div className="" style={{ textAlign: "right" }}>
                      <button
                        disabled={walletData && walletData.balance <= 0}
                        onClick={() => showWithdrawfunds(true)}
                        type="submit"
                        className={`btn btn-outline-secondary ₹{styles.cancel_btn}`}>
                        Withdraw
                      </button>
                  </div>
                </div>
              </div>

              <div className="dash_tab">
                <Tabs
                  defaultActiveKey="Transaction_History"
                  transition={false}
                  id="noanim-tab-example"
                // className="mb-3"
                >
                  <Tab eventKey="Transaction_History" title="Transaction History">
                    <Wallet_transaction_history user_id={props.user_id}/>
                  </Tab>
                  <Tab eventKey="Earning" title="Earning">
                    <Earning user_id={props.user_id}/>
                  </Tab>
                </Tabs>
              </div>


            </div>
          ) : withdrawfunds ? (
            <WithdrawFunds onHide={() => showWithdrawfunds(false)} user_id={props.user_id} balance={walletData ? walletData.balance : 0}/>
          ): (
            <Add_funds onHide={closeAddfunds} user_id={props.user_id} balance={walletData ? walletData.balance : 0} setWalletData={setWalletData}/>
          )}

        </Offcanvas>
      </Elements>
    </>
  );
}
