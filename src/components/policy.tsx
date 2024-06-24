import { FaCheck, FaTimes } from "react-icons/fa";
import styles from "../styles/Profile.module.css";

export default function Policy(props) {
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
          .policy_mobile
          {
            width: 75%;
          }

          @media only screen and (max-width: 426px) {
            .policy_mobile {
              width: 100%;
          
            }
          }
        `}
      </style>
      <div className="container p-0">
        <div className="row">
          <form>
            <div className={`card mx-auto policy_mobile ${styles.cardBg}`}>
              <div className="card-body text-white">
                <div className="card-title">
                  <h1 className="fw-bold">Do's and Dont's</h1>
                </div>
                <div className="row mx-auto mb-3" style={{
                  width: "100%",
                  background: "black",
                  color: "white",
                }}>
                  <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    <span style={{ color: "white", fontWeight: "bolder" }}> DO’s: </span>
                    <br />
                    <FaCheck color="#02B74A" /> Proofread your screenplay before uploading. <br />
                    <FaCheck color="#02B74A" /> Provide a logline and synopsis that effectively summarizes the
                    story. <br />
                    <FaCheck color="#02B74A" /> Ensure that your screenplay adheres to industry-standard
                    formatting. <br />
                    <FaCheck color="#02B74A" /> Register your screenplay with appropriate industry
                    organizations, such as the <a href="https://www.swaindia.org/" target="_blank" rel="nooopener noreferrer">Screen Writers Association</a>
                    <br />
                    <FaCheck color="#02B74A" /> Include a title page with the title of your screenplay. <br />
                    <FaCheck color="#02B74A" /> Use appropriate and descriptive tags to help industry users find
                    your screenplay. <br /><FaCheck color="#02B74A" /> Follow the website guidelines and <a href="/marketplace?component=TC&open=true" target="_blank" rel="nooopener noreferrer">T&C</a>
                    <br />
                    <br />
                    <span style={{ color: "white", fontWeight: "bolder" }}> DON’Ts: </span>

                    <br />
                    <FaTimes color="#DD3B3B" /> Upload a screenplay that contains copyrighted material or
                    plagiarized content.
                    <br />
                    <FaTimes color="#DD3B3B" /> Include personal information or identifying details in the
                    screenplay.
                    <br />
                    <FaTimes color="#DD3B3B" /> Upload a screenplay that is unfinished or in a draft stage.
                    <br />
                    <FaTimes color="#DD3B3B" /> Post inappropriate content.
                    <br />
                  </p>
                </div>

                <div className="row mt-5 d-inline justify-content-between w-100%">
                  <div
                    className={`col-lg-2 col-md-4 col-sm-5 d-inline w-100% `}
                  >
                    {/* <a href="../../spPayment"> */}
                    <button
                      onClick={props.onCancel}
                      type="button"
                      className={`btn-lg btn btn-outline-secondary text-left ${styles.cancel_btn}`}
                      style={{ float: "left" }}>
                      Cancel
                    </button>
                    <button
                      onClick={props.nextStep}
                      type="button"
                      className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn}`}
                      style={{ float: "right" }}>
                      Next
                    </button>
                    {/* </a> */}
                  </div>



                  <div
                    className="col-lg-2 col-md-4 col-sm-5"
                    style={{ textAlign: "right" }}>
                    {/* <a href="../../dashboard"> */}

                    {/* </a> */}
                  </div>
                </div>

              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
