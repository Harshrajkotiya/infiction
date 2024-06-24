import { createHold } from "@/lib/hold/createHold";
import { getHoldbyScreenplayID } from "@/lib/hold/getHold";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import styles from "../styles/Profile.module.css";
import BuyScreen from "./buy_screen";
import Modal1 from "./modal";
import { handleupdateScreenplay } from "@/lib/Screenplay/updateScreenplay";
import { getUserScreenplays } from "@/lib/Screenplay/Sphelpers";
import { getBidbyScreenplayID } from "@/lib/Bid/getBid";

export default function RenderHoldTab({ props }) {
  const [showBuyPay, setBuyPay] = useState(false);
  const [userHold, setUserHold] = useState(null);
  const [isHolded, setIsHolded] = useState(false);
  const [userBid, setUserBid] = useState(null);

  function OpenBuypayment() {
    setBuyPay(true);
  }
  function CloseBuypayment() {
    setBuyPay(false);
  }

  const {
    isLoading,
    isError,
    data: HoldUsers,
    error,
  } = useQuery(["ScreenplayHolds"], () => getHoldbyScreenplayID(props.sp_id));

  const {
    isLoading: bidLoading,
    isError: bidisError,
    data: biddedUsers,
    error: bidError,
  } = useQuery(["ScreenplayBids"], () => getBidbyScreenplayID(props.sp_id));

  const queryClient = useQueryClient();
  const AddMutation = useMutation(createHold, {
    onSuccess: async (data) => {
      queryClient.prefetchQuery(["ScreenplayHolds", props.sp_id], () =>
        getHoldbyScreenplayID(props.sp_id)
      );
    },
  });

  const UpdateMutation = useMutation(
    (newData) => handleupdateScreenplay(props.id, newData, props.onCancel),
    {
      onSuccess: async (data) => {
        queryClient.prefetchQuery(["UserscreenplayData", props.user_id], () =>
          getUserScreenplays(props.user_id)
        );
      },
    }
  );

  function addHoldData() {
    const holdData = {
      screenplay_id: props.sp_id,
      user_id: props.user_id,
      status: "onhold",
    };
    AddMutation.mutate(holdData);
    // const updateListed = Object.assign(
    //   {},
    //   { id: parseInt(props.sp_id), is_listed: false }
    // );
    // UpdateMutation.mutate(updateListed);
  }

  function getRemainingDays(createdAt) {
    var createdDate = new Date(createdAt); // Replace with your created date
    var currentDate = new Date();

    // Calculate the remaining days out of 30
    var timeDiff = currentDate.getTime() - createdDate.getTime();
    var remainingDays = Math.floor((parseInt(process.env.NEXT_PUBLIC_HOLDING_PERIOD) - timeDiff / (1000 * 3600 * 24)) % parseInt(process.env.NEXT_PUBLIC_HOLDING_PERIOD));

    if (remainingDays <= 0) {
      setIsHolded(false);
      const holdData = {
        screenplay_id: props.sp_id,
        user_id: props.user_id,
        status: "expired",
      };
      AddMutation.mutate(holdData);
    }

    return remainingDays < 0 ? 0 : remainingDays;
  }

  useEffect(() => {
    const checkHolded = (HoldUsers?.data?.rows)?.filter(
      (obj) => obj.user_id === props.user_id
    )[0];
    if (checkHolded) {
      // Output the remaining days
      setUserHold(checkHolded);
      setIsHolded(true);
    } else {
      setIsHolded(false)
    }

    const checkBidded = (biddedUsers?.data?.rows)?.filter(
      (obj) => obj.bider_id === props.user_id && obj.status === "approved"
    )[0];

    if (checkBidded) {
      setUserBid(checkBidded);
    }
  }, [props.sp_id, biddedUsers, HoldUsers]);

  function calcBidAmount(amount) {
    return amount - amount * (parseInt(process.env.NEXT_PUBLIC_TOKEN_CHARGE_PER) / 100);
  }

  return (
    <>
      <div className="d-flex justify-content-center m-5 flex-column">
        {isHolded ? (
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
                    Holded On
                  </p>
                  <p
                    className="card-text text-light"
                    style={{ fontSize: "1.1rem" }}
                  >
                    {userHold.createdat?.slice(0, 10)}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p
                    className="card-text fw-bolder text-light"
                    style={{ fontSize: "1.1rem" }}
                  >
                    Remaining Days
                  </p>
                  <p
                    className="card-text text-light"
                    style={{ fontSize: "1.1rem" }}
                  >
                    {getRemainingDays(userHold.createdat)}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p
                    className="card-text fw-bolder text-light"
                    style={{ fontSize: "1.1rem" }}
                  >
                    Status
                  </p>
                  <p
                    className="card-text text-light"
                    style={{ fontSize: "1.1rem" }}
                  >
                    {getRemainingDays(userHold.createdat) === 0
                      ? "Expired"
                      : userHold.status}
                  </p>
                </div>
              </div>
            </div>
            <hr style={{ color: "#666873" }} />
            <button
              onClick={props.onClose}
              type="button"
              className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn}`}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="d-grid gap-3">
              <button
                type="submit"
                className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn}`}
                onClick={OpenBuypayment}
              >
                Hold Now
              </button>

              <button
                onClick={props.onClose}
                type="button"
                className={`btn-lg btn btn-outline-secondary mb-2 ${styles.cancel_btn}`}
                style={{ float: "right" }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
      <Modal1
        showModal={showBuyPay}
        component={
          <BuyScreen
            onClose={CloseBuypayment}
            amount={
              userBid
                ? calcBidAmount(userBid.bid_amount) * (parseInt(process.env.NEXT_PUBLIC_TOKEN_CHARGE_PER) / 100)
                : props.reserved_price * (parseInt(process.env.NEXT_PUBLIC_TOKEN_CHARGE_PER) / 100)
            }
            balance={props.balance}
            title={"Temporary Hold"}
            sucsessMethod={addHoldData}
            sp_id={props.sp_id}
            user_id={props.user_id}
          />
        }
        onClose={CloseBuypayment}
      />
    </>
  );
}
