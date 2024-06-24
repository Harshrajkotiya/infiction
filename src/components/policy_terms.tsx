import { useState } from "react";
import styles from "../styles/Profile.module.css";

export default function Policy_terms(props) {
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };
  return (
    <>
      <style jsx>{`
          .policy_scrollbar.row.mx-auto ::-webkit-scrollbar{
            border-radius: 10px !important;
            color: #F3AE09 !important;
          }
      `}</style>
      <div>
        <div>
          <div className="row">
            <form>
              <div className={`card mx-auto ${styles.cardBg}`} style={{ width: "75%" }}>
                <div className="card-body text-white">
                  <div className="card-title">
                    <h1 style={{ fontWeight: "bolder" }}>Terms and Conditions</h1>
                    <div className="d-flex justify-content-center align-items-center">
                      <p style={{ color: "rgba(255, 255, 255, 0.7)", width: "80%" }}>By using our website, you agree to be bound by the following terms and conditions. If you do not agree to these terms and conditions, please do not use our platform.</p>
                    </div>
                  </div>
                  <div className="policy_scrollbar row mx-auto" style={{
                    width: "50rem",
                    background: "black",
                    color: "white",
                    overflowY: "auto",
                    height: "350px",

                  }}>
                    <p style={{ color: "rgba(255, 255, 255, 0.7)"}}>
                      <span style={{ color: "white", fontWeight:"bolder" }}> License to Use Website </span>
                      <br />
                      <br />
                      We grant you a limited, non-exclusive, revocable license to use
                      our website for personal or commercial purposes. This license does
                      not include the right to:
                      <br />
                      • Reproduce, duplicate, copy or otherwise exploit material on our
                      website for any purposes.
                      <br />
                      • Modify or redistribute any content on our website.
                      <br />
                      • Use our website in a manner that could damage, disable,
                      overburden, or impair our website.
                      <br />
                      • Use our website for illegal or unauthorized purposes.
                      <br />
                      <br />
                      <span style={{ color: "white", fontWeight:"bolder" }}> Restricted Use </span>
                      <br />
                      <br />
                      You may not use our website in a manner that violates any
                      applicable laws or regulations. Additionally, you may not use our
                      website to:
                      <br />
                      • Harass, intimidate, or threaten other users.
                      <br />
                      • Transmit any material that is unlawful, obscene, defamatory,
                      libellous, or invasive of another’s privacy.
                      <br />
                      • Impersonate any person or entity.
                      <br />
                      • Promote any illegal activity.
                      <br />
                      <br />
                      <span style={{ color: "white", fontWeight:"bolder" }}> User Content </span>
                      <br />
                      <br />
                      You are solely responsible for any content you upload to our
                      website. By uploading content to our website, you grant us a
                      non-exclusive, royalty-free, transferable license to use,
                      reproduce, distribute, display, and modify your content. We
                      reserve the right to remove any content that violates these terms
                      and conditions.
                      <br />
                      <br />
                      <span style={{ color: "white", fontWeight:"bolder" }}>No Warranties </span>
                      <br />
                      <br />
                      We make no warranties or representations about the accuracy or
                      completeness of the content on our website. We do not guarantee
                      that our website will be free from errors, viruses, or other
                      harmful components.
                      <br />
                      <br />
                      <span style={{ color: "white", fontWeight:"bolder" }}>Limitations of Liability </span>
                      <br />
                      <br />
                      We are not liable for any damages, including but not limited to
                      direct, indirect, incidental, punitive, and consequential damages,
                      arising from your use of our website. You agree to indemnify and
                      hold us harmless from any claims arising from your use of our
                      website.
                      <br />
                      <br />
                      <span style={{ color: "white", fontWeight:"bolder" }}> Other Parties </span>
                      <br />
                      <br />
                      You acknowledge that our website may contain links to third-party
                      websites. We are not responsible for the content, accuracy, or
                      privacy practices of these third-party websites.
                      <br />
                      <br />
                      <span style={{ color: "white", fontWeight:"bolder" }}> Indemnity </span>
                      <br />
                      <br />
                      You agree to indemnify, defend, and hold us and our affiliates,
                      officers, directors, agents, and employees harmless from any claim
                      or demand, including reasonable attorneys’ fees, made by any
                      third-party due to or arising out of your breach of these terms
                      and conditions or your violation of any law or the rights of a
                      third-party.
                      <br />
                      <br />
                      <span style={{ color: "white", fontWeight:"bolder" }}> Breaches of T&C </span>
                      <br />
                      <br />
                      We reserve the right to terminate or suspend your access to our
                      website if you breach these terms and conditions. In the event of
                      a breach, we may take legal action to recover any damages
                      incurred.
                      <br />
                      <br />
                      <span style={{ color: "white", fontWeight:"bolder" }}> Disputes: </span>
                      <br />
                      <br />
                      Any disputes arising out of or related to these terms and
                      conditions shall be resolved through arbitration in accordance
                      with the rules of the relevant arbitration body.
                      <br />
                      <br />
                      <span style={{ color: "white", fontWeight:"bolder" }}> Law and Jurisdiction: </span>
                      <br />
                      <br />
                      These terms and conditions shall be governed by and construed in
                      accordance with the laws of the jurisdiction in which our company
                      is based. Any disputes arising out of or related to these terms
                      and conditions shall be subject to the exclusive jurisdiction of
                      the courts of that jurisdiction.
                      <br />
                      <br />
                      Thank you for using our website. If you have any questions or
                      concerns about these terms and conditions, please contact us at
                      hello@infictionapp.com
                    </p>
                  </div>
                  <div className="d-flex mt-2 ms-2 accept_checked checkedbox_terms">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={handleCheckboxChange}></input>
                    <p className="mb-0">
                      {" "}
                      <span style={{ color: "white", fontWeight:"bolder"}}> I agree to the Terms & Conditions and the Policy </span>{" "}
                    </p>
                  </div>
                  <div className="row mt-5 d-flex justify-content-between">
                    <div
                      className={`col-lg-2 col-md-4 col-sm-5`}
                      style={{ textAlign: "left" }}>
                      {/* <a href="../../spPayment"> */}
                      <button
      
                        onClick={props.prevStep}
                        type="button"
                        className={`btn-lg btn btn-outline-secondary text-left ${styles.cancel_btn}`}>
                        Back
                      </button>
                      {/* </a> */}
                    </div>

                    <div className="col-lg-8 col-md-4 col-sm-2"></div>

                    <div
                      className="col-lg-2 col-md-4 col-sm-5"
                      style={{ textAlign: "right" }}>
                      {/* <a href="../../dashboard"> */}
                      {!checked && (
                        <button
                          disabled
                          onClick={props.nextStep}
                          type="button"
                          className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn}`}>
                          Accept
                        </button>
                      )}
                       {checked && (<button
                        onClick={props.nextStep}
                        type="button"
                        className={`btn-lg btn btn-outline-secondary ${styles.cancel_btn}`}>
                        Accept
                      </button>
                    )}
                      {/* </a> */}
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
