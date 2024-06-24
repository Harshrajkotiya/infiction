import { createTransaction } from "@/lib/Transaction/createTransaction";
import { processGetuser } from "@/lib/users";
import { processPayment } from "@/utils/payment";
import storeTransation from "@/utils/storeTransactions";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import styles from "../styles/Profile.module.css";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Tab, Tabs } from "react-bootstrap";
import RenderBidTab from "./bid_screen";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getHoldbyScreenplayID } from "@/lib/hold/getHold";
import RenderHoldTab from "./hold_screen";
import { getBidbyScreenplayID } from "@/lib/Bid/getBid";

function RenderBuyTab({ props }) {
  // console.log("props", props);
  
  const [show, setShow] = useState(false);
  const [isAlert, setAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [userBid, setUserBid] = useState(null);

  const {
    isLoading: bidLoading,
    isError: bidisError,
    data: biddedUsers,
    error: bidError,
  } = useQuery(["ScreenplayBids"], () => getBidbyScreenplayID(props.sp_id));

  const formatter = new Intl.NumberFormat("en-IN");
  const router = useRouter();

  async function handlePayWithWallet() {
    const userId =
      typeof window !== "undefined" && localStorage.getItem("ownerId");
    const stripeUser = await processGetuser(userId);
    const stripeUserData = stripeUser.rows[0];

    const userData = {
      userid: stripeUserData.user_id,
      stripeid: stripeUserData.stripeid,
      trx_type: "earning",
      trx_amount: parseInt(userBid ? calcBidAmount(userBid.bid_amount) : props.amount) - parseInt(props.userBid ? calcBidAmount(userBid.bid_amount) : props.amount) * (parseInt(process.env.NEXT_PUBLIC_COMMISSION_PER) / 100),
      status: "completed",
    };
    const isSuccess = createTransaction(userData);
    typeof window !== "undefined" && localStorage.setItem("ownerId", "");
  }

  async function payWithCard() {
    setIsLoading(true);
    const amount = parseFloat(userBid ? calcBidAmount(userBid.bid_amount) : props.amount);
    // console.log(!isNaN(amount) && amount > 0);

    if (!isNaN(amount) && amount > 0) {
      localStorage.setItem("paymentType", props.title);
      localStorage.setItem("paymentAmount", userBid ? calcBidAmount(userBid.bid_amount) : props.amount);
      const response = await processPayment(
        props.sp_id,
        props.user_id,
        userBid ? calcBidAmount(userBid.bid_amount) : props.amount,
        props.title
      );
    } else {
      setAlert(true);
    }
    setIsLoading(false);
  }

  async function payWithWallet() {
    setIsLoadingWallet(true);
    const amount = parseFloat(userBid ? calcBidAmount(userBid.bid_amount) : props.amount);

    if (!isNaN(amount) && amount > 0) {
      const response = await storeTransation(props.user_id, userBid ? calcBidAmount(userBid.bid_amount) : props.amount);
      if (response.code === 200) {
        if (props.title === "Buy Screenplay") {
          await handlePayWithWallet();
        }
        props.sucsessMethod();
        router.push(
          `/payment?user_id=${props.user_id}&status=success&open=true`
        );
      } else {
        router.push(
          `/payment?user_id=${props.user_id}&status=cancel&open=true`
        );
      }
    } else {
      setAlert(true);
    }
    setIsLoadingWallet(false);
  }

  useEffect(() => {
    const checkBidded = biddedUsers?.data?.rows?.filter(
      (obj) => obj.bider_id === props.user_id && obj.status === "approved"
    )[0];
    if (checkBidded) {
      setUserBid(checkBidded);
    }
  });

  function calcBidAmount(amount){
    return props.title === "Buy Screenplay" ? (amount - amount * (parseInt(process.env.NEXT_PUBLIC_TOKEN_CHARGE_PER) / 100)) : props.amount;
  }

  function ConfirmToast(props) {
    return (
      <Row className="mt-3">
        <Col xs={12}>
          <Toast onClose={() => props.onClose()} show={props.show} delay={3000}>
            <Toast.Header
              className="d-flex justify-content-end"
              style={{ background: "#f3ae09" }}
            ></Toast.Header>
            <Toast.Body
              style={{
                background: "black",
                fontSize: "xx-large",
                fontWeight: "bold",
              }}
            >
              ₹{formatter.format(props.balance)}
              <br />
              <p style={{ fontSize: "medium" }}>
                Confirm Payment of ₹{formatter.format(userBid ? calcBidAmount(userBid.bid_amount) : props.amount)}
              </p>
              <button
                className="btn btn-outline-warning mb-3"
                onClick={() => payWithWallet()}
              >
                {isLoadingWallet ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  "confirm"
                )}
              </button>
            </Toast.Body>
          </Toast>
        </Col>
      </Row>
    );
  }

  function closeToast() {
    setShow(false);
  }

  return (
    <>
      <style jsx>
        {`
          * {
            color: white;
            font-family: courier;
          }
          .card_res {
            margin-right: 0px !important;
            margin-left: 0px !important;
          }
        `}
      </style>
      <div className="card-body text-center text-white">
        {isAlert && (
          <Snackbar
            open={isAlert}
            autoHideDuration={6000}
            onClose={() => setAlert(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert onClose={() => setAlert(false)} severity="error">
              Invalid payable amount. Amount should be greater than zero.
            </Alert>
          </Snackbar>
        )}
        <hr style={{ color: "#666873" }} />
        <div className="d-flex justify-content-center">
          <div
            className="card"
            style={{ width: "15rem", backgroundColor: "#f3ae09" }}
          >
            <div className="card-body">
              <h1
                className="card-title text-dark"
                style={{ fontWeight: "bolder" }}
              >
                ₹{formatter.format(userBid ? calcBidAmount(userBid.bid_amount) : props.amount)}
              </h1>
              <h6
                className="card-subtitle mt-3 text-dark"
                style={{ fontWeight: "bold" }}
              >
                Pay For {props.title}
              </h6>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <div>
            <button
              onClick={() => payWithCard()}
              type="button"
              className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn}`}
            >
              {isLoading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Pay Now"
              )}
            </button>
          </div>
          <div className="mt-2">
            <div>
              <button
                disabled={
                  props.balance == undefined || parseInt(props.balance) <= (userBid ? calcBidAmount(userBid.bid_amount) : parseInt(props.amount))
                }
                type="button"
                className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn}`}
                onClick={() => setShow(true)}
              >
                Pay with Wallet
              </button>
              {show && (
                <ConfirmToast
                  show={show}
                  onClose={closeToast}
                  balance={props.balance}
                  amount={userBid ? calcBidAmount(userBid.bid_amount) : props.amount}
                />
              )}
            </div>
          </div>
        </div>
        <hr style={{ color: "#666873" }} />

        <form className="mt-4">
          <div className="row mt-4 d-inline">
            {props.prevStep && (
              <div className={`col-lg-2 col-md-4 col-sm-5 d-inline`}>
                <button
                  onClick={props.prevStep}
                  type="button"
                  className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn} `}
                  style={{ float: "left" }}
                >
                  Back
                </button>
              </div>
            )}
            <div
              className="col-lg-2 col-md-4 col-sm-5 d-inline"
              style={{ textAlign: "right" }}
            >
              <button
                onClick={props.onClose}
                type="button"
                className={`btn-lg btn btn-outline-secondary mb-2 ${styles.cancel_btn}`}
                style={{ float: "right" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

function BuyScreen(props) {
  
  return (
    <>
      <style jsx>{`
        .main_body {
          background-color: #000000;
          height: 100vh;
        }
        .buy_main {
          background-color: #0000ff;
        }
      `}</style>
      <div>
        <div className="row card_res d-flex justify-content-center align-items-center">
          <div
            className="card"
            style={{ width: "25rem", backgroundColor: "#333333" }}
          >
            <h1 className="text-white pt-3 fw-bold">{props.title}</h1>
            <div className="member_dash_tab dash_tab mt-4">
              {props.title === "Buy Screenplay" ? (
                <>
                  <Tabs
                    defaultActiveKey={props.activeTab}
                    transition={false}
                    id="buy-bid-hold"
                  >
                    <Tab eventKey="bid" title="Bid ">
                      <RenderBidTab props={props} />
                    </Tab>
                    <Tab eventKey="buy" title="Buy">
                      <RenderBuyTab props={props} />
                    </Tab>
                    <Tab eventKey="hold" title="Hold ">
                      <RenderHoldTab props={props} />
                    </Tab>
                  </Tabs>
                </>
              ) : (
                <>
                  <RenderBuyTab props={props} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BuyScreen;
