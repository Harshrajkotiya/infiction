//import { useState, useEffect } from 'react';
import { uploadScreenplay } from "@/lib/Screenplay/uploadScreenplay";
import { createTransaction } from "@/lib/Transaction/createTransaction";
import { createWishlist } from "@/lib/Wishlist/createWishlist";
import { processGetuser } from "@/lib/users";
import { AssignIndustriesReaders } from "@/utils/assignIndustriesReader";
import { AssignReaders } from "@/utils/assignReaders";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getTopRatedScreenplay,
  getUserScreenplays,
} from "../lib/Screenplay/Sphelpers";
import styles from "../styles/Profile.module.css";
import { addBidWithNotification } from "@/utils/addBidAndNotification";
import { getBidbyScreenplayID } from "@/lib/Bid/getBid";
import { createNotification } from "@/lib/Notification/createNotification";
import { createBid } from "@/lib/Bid/createBid";
import { getHoldbyScreenplayID } from "@/lib/hold/getHold";
import { createHold } from "@/lib/hold/createHold";
import { handleupdateScreenplay } from "@/lib/Screenplay/updateScreenplay";
import { deleteHold } from "@/lib/hold/deleteHold";

export default function Preview(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const router = useRouter();
  const queryClient = useQueryClient();

  const addMutation = useMutation(uploadScreenplay, {
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["UserscreenplayData", props.formData.user_id],
        data
      );
      queryClient.prefetchQuery(
        ["UserscreenplayData", props.formData.user_id],
        () => getUserScreenplays(props.formData.user_id)
      );

      AssignReaders(data?.data?.rows[0]);
      // props.onCancel();
    },
  });

  const addWishlistMutation = useMutation(createWishlist, {
    onSuccess: async (data) => {
      queryClient.prefetchQuery(["TopScreenplay", props.user_id], () =>
        getTopRatedScreenplay(props.user_id)
      );
    },
  });

  const AddHoldMutation = useMutation(createHold, {
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

  const AddBidMutation = useMutation(createBid);

  const {
    isLoading: bidLoading,
    isError,
    data: biddedUsers,
    error,
  } = useQuery(["ScreenplayBids"], () => getBidbyScreenplayID(props.sp_id));

  const AddNotifictionMutation = useMutation(createNotification);

  async function handlePayWithWallet() {
    const amount =
      typeof window !== "undefined" && localStorage.getItem("paymentAmount");
    const userId =
      typeof window !== "undefined" && localStorage.getItem("ownerId");

    const stripeUser = await processGetuser(userId);
    const stripeUserData = stripeUser.rows[0];

    const userData = {
      userid: userId,
      stripeid: stripeUserData.stripeid,
      trx_type: "earning",
      trx_amount: parseInt(amount) - parseInt(amount) * (parseInt(process.env.NEXT_PUBLIC_COMMISSION_PER) / 100),
      status: "completed",
    };
    const isSuccess = createTransaction(userData);

    typeof window !== "undefined" && localStorage.setItem("paymentAmount", "");
    typeof window !== "undefined" && localStorage.setItem("ownerId", "");
  }

  const handleSPUpload = () => {
    setIsLoading(true);
    try {
      addMutation.mutate(JSON.parse(props.formData));
      router.push("/dashboard");
      typeof window !== "undefined" &&
        localStorage.setItem("SPFormData", JSON.stringify({}));
      typeof window !== "undefined" && localStorage.setItem("paymentType", "");
    } catch (e) {
      // console.log("error", e);
      return e;
    }
    setIsLoading(false);
  };

  const handleBuy = () => {
    setIsLoading(true);
    try {
      const { user_id, screenplay_id, is_wished, is_bought } = JSON.parse(
        props.curUser
      );
      addWishlistMutation.mutate({
        user_id: props.user_id,
        screenplay_id: screenplay_id,
        is_wished: is_wished,
        is_bought: is_bought,
      });

      const updateListed = Object.assign(
        {},
        { id: parseInt(screenplay_id), is_listed: false }
      );
      UpdateMutation.mutate(updateListed);

      const deleteBought = { screenplay_id: parseInt(screenplay_id), user_id: props.user_id };
      deleteHold(deleteBought);

      handlePayWithWallet();
      router.push("/dashboard");
      typeof window !== "undefined" &&
        localStorage.setItem("curSPData", JSON.stringify({}));
      typeof window !== "undefined" && localStorage.setItem("paymentType", "");
    } catch (e) {
      // console.log("error", e);
      return e;
    }
    setIsLoading(false);
  };

  function handleApplyRating() {
    setIsLoading(true);
    try {
      const industryReaders = AssignIndustriesReaders(
        JSON.parse(props.curUser)?.screenplay_id
      );
      router.push("/dashboard");
      typeof window !== "undefined" &&
        localStorage.setItem("curSPData", JSON.stringify({}));
      typeof window !== "undefined" && localStorage.setItem("paymentType", "");
    } catch (e) {
      // console.log("error", e);
      return e;
    }
    setIsLoading(false);
  }

  function handleSubmitBid() {
    const { user_id, screenplay_id, is_wished, is_bought } = JSON.parse(
      props.curUser
    );

    addBidWithNotification(
      screenplay_id,
      user_id,
      props.BidAmount,
      biddedUsers?.data?.rows,
      AddBidMutation,
      AddNotifictionMutation
    );
    router.push("/dashboard");
    typeof window !== "undefined" &&
      localStorage.setItem("curSPData", JSON.stringify({}));
    typeof window !== "undefined" && localStorage.setItem("paymentType", "");
  }

  function handleSubmitHold() {
    const { user_id, screenplay_id, is_wished, is_bought } = JSON.parse(
      props.curUser
    );

    const holdData = {
      screenplay_id: screenplay_id,
      user_id: props.user_id,
      status: "onhold",
    };
    AddHoldMutation.mutate(holdData);

    // const updateListed = Object.assign(
    //   {},
    //   { id: parseInt(screenplay_id), is_listed: false }
    // );
    // UpdateMutation.mutate(updateListed);

    router.push("/dashboard");
    typeof window !== "undefined" &&
      localStorage.setItem("curSPData", JSON.stringify({}));
    typeof window !== "undefined" && localStorage.setItem("paymentType", "");
  }

  function handleSuccessMethod() {
    setDoneCount(doneCount + 1);
    setIsLoading(true);
    if (doneCount < 1) {
      if (props.status === "success") {
        if (props.paymentType === "Upload Screenplay") {
          handleSPUpload();
        } else if (props.paymentType === "Buy Screenplay") {
          handleBuy();
        } else if (props.paymentType === "Apply Industries Rating") {
          handleApplyRating();
        } else if (props.paymentType === "Set Bid") {
          handleSubmitBid();
        } else if (props.paymentType === "Temporary Hold") {
          handleSubmitHold();
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }
    }

    setIsLoading(false);
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
            width: 100px;
            margin: auto;
            height: 3px;
            background-color: #f3ae09;
            border: none;
            opacity: 1;
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
            <div className="col-12 text-center text-black">
              {/* <h1>Upload Screenplay</h1> */}
            </div>

            {/* <div className="row text-center">
              <div className="col-lg-3"></div>
              <div className={`col-lg-3 ${styles.step_row}`}>
                <h4 className={`${styles.step_circle}`}>1</h4>{" "}
                <h4>Information &gt;</h4>
              </div>
              <div className={`col-lg-2 ${styles.step_row}`}>
                <h4 className={`${styles.step_circle}`}>2</h4>{" "}
                <h4>Payment &gt;</h4>
              </div>
              <div className={`col-lg-2 ${styles.step_row}`}>
                <h4 className={`${styles.step_circle}`}>3</h4>
                 <h4>Preview</h4>
              </div>
              <div className="col-lg-2"></div>
            </div> */}
            <form onSubmit={handleSPUpload}>
              <div className={`card  ${styles.cardBg}`}>
                <div className="card-body text-center text-white">
                  <div className="row mt-5 d-flex justify-content-center">
                    <div className="row">
                      <div className="mt-3">
                        <img
                          src={
                            props.status === "success"
                              ? "../preview_icon.svg"
                              : "../cancel_payment.svg"
                          }
                          alt="preview_icon"
                        />
                      </div>
                      <div className={`mt-5  ${styles.text1}`}>
                        <h3 style={{ width: "100%" }}>
                          {props.status === "success"
                            ? "Payment Successful"
                            : "Payment Cancelled"}
                        </h3>
                      </div>
                    </div>

                    <div className="row mt-5" style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={handleSuccessMethod}
                        className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn}`}
                      >
                        {isLoading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          "Done"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
