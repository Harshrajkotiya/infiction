import React from "react";
import styles from "../styles/Profile.module.css";
import { loadPortal } from "@/utils/payment";

export default function viewplan(props) {
  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center p-3"
        style={{ background: "rgba(232, 227, 227, 0.2)" }}
      >
        <div
          className="card"
          style={{
            padding: "2%",
            width: "25rem",
            backgroundColor: "rgba(56, 56, 56)",
          }}
        >
          <div className="card-body">
            <div
              className="d-flex"
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <div>
                <p
                  className="card-title h4"
                  style={{ fontWeight: "bold", color: "white" }}
                >
                  {props.product?.name}
                </p>
                <p
                  className="card-text "
                  style={{ fontWeight: "500", color: "white" }}
                >
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <h3 style={{ fontWeight: "bold", color: "white" }}>
                  ₹{props.product?.price}/{props.product?.interval}
                </h3>
                {/* <h5 style={{marginTop:"55px"}}>Manage your subscription on Stripe.</h5> */}
              </div>

              <button
                type="submit"
                className={`btn btn-warning mt-3`}
                onClick={() => loadPortal(props.product?.user_id)}
              >
                Open Customer Portal
              </button>

              <button
                onClick={props.onClose}
                type="button"
                className={`btn-lg btn btn-outline-secondary m-2 mt-4 text-end ${styles.cancel_btn}`}
                style={{ float: "right" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
