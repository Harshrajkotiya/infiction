import { addBidWithNotification } from "@/utils/addBidAndNotification";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useEffect, useState } from "react";
import styles from "../styles/Profile.module.css";
import BuyScreen from "./buy_screen";
import Modal1 from "./modal";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createBid } from "@/lib/Bid/createBid";
import { getBidbyScreenplayID } from "@/lib/Bid/getBid";
import { createNotification } from "@/lib/Notification/createNotification";

export default function RenderBidTab({ props }) {
  const [showBidDetails, setBidDetails] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [checkoutError, setCheckoutError] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [showBuyPay, setBuyPay] = useState(false);
  const [userBid, setUserBid] = useState(null);
  const [showRebid, setShowRebid] = useState(false);

  const queryClient = useQueryClient();
  const AddMutation = useMutation(createBid, {
    onSuccess: async (data) => {
      queryClient.prefetchQuery(["ScreenplayBids", props.sp_id], () =>
        getBidbyScreenplayID(props.sp_id)
      );
    },
  });

  const {
    isLoading,
    isError,
    data: biddedData,
    error,
  } = useQuery(["ScreenplayBids"], () => getBidbyScreenplayID(props.sp_id));

  const AddNotifictionMutation = useMutation(createNotification);  
  
  function calcBidAmount(amount){
    return amount - amount * (parseInt(process.env.NEXT_PUBLIC_TOKEN_CHARGE_PER) / 100);
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  function OpenBidDetails() {
    setBidDetails(true);
  }
  function CloseBidDetails() {
    setBidDetails(false);
  }

  function OpenBuypayment() {
    setBuyPay(true);
  }
  function CloseBuypayment() {
    setBuyPay(false);
  }

  function successMethod() {
    addBidWithNotification(props.sp_id, props.user_id, inputValue, biddedData.data.rows, AddMutation, AddNotifictionMutation);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    typeof window !== "undefined" && localStorage.setItem("BidAmount", inputValue);
    if (!inputValue){
      setCheckoutError("Enter Bid Amount");
    }else if (inputValue && parseInt(inputValue) === 0) {
      setCheckoutError("Bid Amount can not be 0");
    }else if(parseInt(inputValue) >= props.amount) {
      setCheckoutError("Bid Amount Should less than Reserved Price");
    } else {
      OpenBidDetails();
    }
  };

  useEffect(() => {
    const checkBidded = (biddedData?.data?.rows)?.filter((obj) => obj.bider_id === props.user_id)[0];
    // console.log("checkBidded",biddedData);
    
    if (checkBidded) {
      setUserBid(checkBidded);
      setShowRebid(true);
    } else {
      setShowRebid(false);
    }
  }, [biddedData]);


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

          input,
          textarea {
            background: black;
            border-color: black;
            color: white;
          }

          input {
            background: black;
            border-color: black;
            padding: 12px 10px 12px 10px;
          }

          input:focus,
          textarea:focus {
            background-color: #000000;
            color: white;
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

          // Bid Details style
          label {
            color: black;
            font-size: 1rem;
          }
        //  button {
        //     background-color: rgb(243, 174, 9);
        //     border-color: rgb(243, 174, 9) !important;
        //   }
        //   button:hover {
        //     border-color: rgb(243, 174, 9);
        //     background-color: none;
        //     color: rgb(243, 174, 9);
        //     font-weight: bolder;
        //     border-color: rgb(243, 174, 9) !important;
        //   }
        `}
      </style>

      <div className="card-body text-center text-white">
        <hr style={{ color: "#666873" }} />
        <form className="mt-4" onSubmit={handleSubmit}>
          {showRebid ? (
            <>
              <div
                className="card mx-auto"
                style={{ width: "18rem", backgroundColor: "black" }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <p
                      className="card-text fw-bolder text-light"
                      style={{ fontSize: "1.1rem" }}
                    >
                      Reserved Price
                    </p>
                    <p
                      className="card-text text-light"
                      style={{ fontSize: "1.1rem" }}
                    >
                      ₹{props.reserved_price}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p
                      className="card-text fw-bolder text-light"
                      style={{ fontSize: "1.1rem" }}
                    >
                      Bidded amount
                    </p>
                    <p
                      className="card-text text-light"
                      style={{ fontSize: "1.1rem" }}
                    >
                      ₹{userBid.bid_amount}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p
                      className="card-text fw-bolder text-light"
                      style={{ fontSize: "1.1rem" }}
                    >
                      status
                    </p>
                    <p
                      className="card-text text-light"
                      style={{ fontSize: "1.1rem" }}
                    >
                      {userBid.status}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn}`}
                    onClick={() => { setShowRebid(false) }}
                  >
                    ReBid
                  </button>
                  {/* {(userBid.status === "approved" && <button
                    type="button"
                    className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn}`}
                    onClick={() => { setShowRebid(false) }}
                  >
                    Buy for ₹{userBid.bid_amount}
                  </button>)} */}
                </div>
              </div>
            </>
          ) : showBidDetails ? (
            <>
              <div
                className="card mx-auto"
                style={{ width: "18rem", backgroundColor: "black" }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <p
                      className="card-text fw-bolder text-light"
                      style={{ fontSize: "1.1rem" }}
                    >
                      Reserved Price
                    </p>
                    <p
                      className="card-text text-light"
                      style={{ fontSize: "1.1rem" }}
                    >
                      ₹{props.reserved_price}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p
                      className="card-text fw-bolder text-light"
                      style={{ fontSize: "1.1rem" }}
                    >
                      Bid amount
                    </p>
                    <p
                      className="card-text text-light"
                      style={{ fontSize: "1.1rem" }}
                    >
                      ₹{inputValue}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between text-start">
                    <p
                      className="card-text fw-bolder text-light d-flex flex-column"
                      style={{ fontSize: "1.1rem" }}
                    >
                      Token amount
                      <br />
                      <span
                        className=" text-muted"
                        style={{ fontSize: "0.9rem" }}
                      >
                        5% of bid amount
                      </span>
                    </p>
                    <p
                      className="card-text text-light"
                      style={{ fontSize: "1.1rem" }}
                    >
                      ₹{parseInt(inputValue) * (parseInt(process.env.NEXT_PUBLIC_TOKEN_CHARGE_PER) / 100)}
                    </p>
                  </div>

                  <button
                    onClick={() => OpenBuypayment()}
                    type="button"
                    className={`btn-lg btn btn-outline-secondary mb-2 ${styles.cancel_btn}`}
                  >
                    Confirm Bid
                  </button>

                </div>
              </div>
              <Modal1
                showModal={showBuyPay}
                component={
                  <BuyScreen
                    onClose={CloseBuypayment}
                    amount={inputValue * (parseInt(process.env.NEXT_PUBLIC_TOKEN_CHARGE_PER) / 100)}
                    balance={props.balance}
                    title={"Set Bid"}
                    sucsessMethod={successMethod}
                    sp_id={props.sp_id}
                    user_id={props.user_id}
                  />
                }
                onClose={CloseBuypayment}
              />
            </>
          ) : (
            <>
              <div className="d-flex justify-content-center">
                <div
                  className="card"
                  style={{ width: "15rem", backgroundColor: "#f3ae09" }}
                >
                  <div className="card-body">
                    {/* <h1 className="card-title text-dark" style={{ fontWeight: "bolder" }}>₹{props.amount}</h1> */}
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      name="Amount"
                      onChange={handleInputChange}
                    />
                    <h6
                      className="card-subtitle mt-3 text-dark"
                      style={{ fontWeight: "bold" }}
                    >
                      {" "}
                      or Buy Now for ₹{userBid ? calcBidAmount(userBid.bid_amount) : props.amount}
                    </h6>
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <div>
                  <button
                    type="submit"
                    className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn}`}
                  >
                    Bid Now
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="w-75">
            {checkoutSuccess && (
              <Snackbar
                open={checkoutSuccess}
                autoHideDuration={6000}
                onClose={() => setCheckoutSuccess(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <Alert
                  onClose={() => setCheckoutSuccess(false)}
                  severity="success"
                >
                  Bid added successfully.
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
        <hr style={{ color: "#666873" }} />

        <button
          onClick={props.onClose}
          type="button"
          className={`btn-lg btn btn-outline-secondary mb-2 ${styles.cancel_btn}`}
          style={{ float: "right" }}
        >
          Cancel
        </button>

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
        </div>
      </div>
    </>
  );
}
