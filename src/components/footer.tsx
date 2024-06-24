import { useEffect, useRef, useState } from "react";
import Modal1 from "../components/modal";
import About from "./about";
import Career from "./careers";
import TC from "./terms_and_conditions";
import CG from "./community_guideline";
import FAQ from "./faq";
import styles from "../styles/footer.module.css";
import styles1 from "../styles/modal.module.css";

import BookModal from "./bookModel";
import { useRouter } from "next/router";

export default function Footer(props) {
  const [showModal, setShowModal] = useState(false);
  const [showCareers, setShowCareers] = useState(false);
  const [showTC, setShowTC] = useState(false);
  const [showCG, setShowCG] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const ref = useRef(null);
  const router = useRouter();
  useEffect(() => {
    if (props.component === "TC") {
      setShowTC(props.open === "true");
    }
  }, [props.open]);

  function handleClose() {
    setShowModal(false);
  }
  function handleCareerClose() {
    setShowCareers(false);
  }
  function handleTCClose() {
    setShowTC(false);
  }
  function handleCGClose() {
    setShowCG(false);
  }
  function handleFAQClose() {
    setShowFAQ(false);
  }

  return (
    <>
      <footer className={styles.FooterBg}>
        <div className="footer-top">
          <div className="container-fluid">
            <div className="row">
              <div
                className={`col-lg-3 col-md-6 col-sm-6 ${styles.media_image}`}
              >
                <div className="widget company-intro-widget">
                  <a href="/" className="site-logo">
                    <img
                      className="mb-2"
                      src="../InFiction Logo White.png"
                      alt="InFiction Logo White"
                      width={100}
                      height={100}
                    />
                  </a>
                  <p className={`${styles.media_image}`}>
                    The search for top quality content ends here.
                  </p>
                </div>
              </div>

              <div className={`${styles.about_company}`}>
                <div className="col-lg-3 col-md-6 col-sm-6">
                  <div className={`widget course-links-widget`}>
                    <h5 className={`"widget-title fw-bolder`}>Portfolio</h5>
                    <ul className={styles.UlStyle}>
                      <li onClick={() => setShowFAQ(true)}>FAQ</li>
                      <li onClick={() => setShowCG(true)}>
                        Community Guidelines
                      </li>
                      {/* <li>Contact us</li> */}
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6">
                  <div className={`widget latest-news-widget `}>
                    <h5
                      className={`widget-title fw-bolder`}
                      style={{ letterSpacing: "1px" }}
                    >
                      Company
                    </h5>
                    <ul className={styles.UlStyle}>
                      <li onClick={() => setShowModal(true)}>About Us</li>
                      <li onClick={() => setShowCareers(true)}>Careers</li>
                      <li onClick={() => setShowTC(true)}>
                        Terms & Conditions
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-3">
                <a
                  className={styles.AStlye}
                  href="mailto:hello@infictionapp.com"
                >
                  hello@infictionapp.com
                </a>
                <h6 className="mt-3">
                  2 Venture Drive, #07-29, Vision Exchange, Singapore (608526)
                </h6>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              {/* <div className=""> */}
              <button
                className="btn btn-warning"
                onClick={() => router.push("/reader/login?open=true")}
              >
                Staff Login
              </button>
              {/* </div > */}
              {/* {window && window.innerWidth <= 425 && ( */}
                <a href="/WhoAreYou" className={styles.footerArrow} style={{ transform: "rotate(180deg)" }}>
                  <img src="/arrow.svg" alt="up arrow"></img>
                </a>
              {/* )} */}
            </div>
          </div>
        </div>
        <hr />
        <div className="footer-bottom">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3 col-sm-3">
                <div className={`d-flex gap-2 ${styles.SocialMedia}`}>
                  {/* <a className="facebook" href="" target="_blank" rel="noopener noreferrer"> */}
                  <img className={styles.facebook} src="" alt="facebook" />
                  {/* </a> */}
                  {/* <a className="twitter" href="" target="_blank" rel="noopener noreferrer"> */}
                  <img className={styles.twitter} src="" alt="twitter" />
                  {/* </a> */}
                  {/* <a
                    className="linkdin"
                    href="https://sg.linkedin.com/company/kalgalabs"
                    target="_blank"
                    rel="noopener noreferrer"
                  > */}
                  <img
                    className={styles.linkdin}
                    src=""
                    alt="linkdin"
                    onClick={() =>
                      window.open(
                        "https://sg.linkedin.com/company/kalgalabs",
                        "_blank"
                      )
                    }
                  />
                  {/* </a> */}
                  {/* <a className="instagram" href="" target="_blank" rel="noopener noreferrer"> */}
                  <img className={styles.instagram} src="" alt="instagram" />
                  {/* </a> */}
                </div>
              </div>
              <div className="col-md-3 col-sm-3"></div>
              <div className="col-md-3 col-sm-3"></div>
              <div className="col-md-3 col-sm-3 text-sm-left">
                <p>Copyright © 2023 All rights reserved</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <BookModal
        showModal={showModal}
        component={<About />}
        onClose={handleClose}
        isSP={false}
      />
      <BookModal
        showModal={showCareers}
        component={<Career />}
        onClose={handleCareerClose}
        isSP={false}
      />
      <BookModal
        showModal={showTC}
        component={<TC />}
        onClose={handleTCClose}
        isSP={false}
      />
      <BookModal
        showModal={showCG}
        component={<CG />}
        onClose={handleCGClose}
        isSP={false}
      />
      <BookModal
        showModal={showFAQ}
        component={<FAQ />}
        onClose={handleFAQClose}
        isSP={false}
      />
    </>
  );
}
