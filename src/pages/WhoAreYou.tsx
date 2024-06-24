import styles from "@/styles/WhoAreYou.module.css";
import { useRef, useState } from "react";
import Arrow from "../components/arrow";
import styles1 from "../styles/arrow.module.css";
import Layout from "@/components/layout";
import { motion, useInView } from "framer-motion";
import { Modal } from 'react-bootstrap';
import LoginSignup from "./login_signup";
import Header from "@/components/header";

export default function Screen3() {
  const [LoadScreen, setLoadScreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState('');

  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 1 })

  const shuttleVariant = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 1,
        delayChildren: 2,
        duration: 3,
      },
    }
  };

  const doddleVariant = {
    hidden: { opacity: 0 },
    show: {
      opacity: [0, 0.5, 1],
      transition: {
        duration: 3,
        delay: 5,
      },
    },
  };

  const shuttleAnimation = {
    hidden: { scale: 0, y: 500 },
    show: {
      scale: 1, y: 0, transition: {
        duration: 2
      }
    },

  };

  const textAnimation = {
    hidden: { scale: 0, x: 1000 },
    show: { scale: 1, x: 0 },

  };

  const eclipseAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: [0, 0.5, 1], transition: {
        delay: 3
      }
    },

  };

  return (
    <>
      {/* <Layout> */}
      <Header imgSrc="/email_logo.png" />

      <a href="/">
        <div className={styles1.black_Uparrow}>
          <Arrow />
        </div>
      </a>
      <motion.div className={`container-fuild ${styles.S4_container}`}>
        <motion.div ref={ref} className={styles.S4_bg} variants={shuttleVariant}
          initial="hidden"
          animate="show">

          <div className={styles.S4_speace_shuttle}>
            <motion.img
              className={styles.S4_speace_shuttle_img}
              src="/S4_space_shuttle_with_WRY.svg"
              alt="S4_speace_shuttle_with_line"
              variants={shuttleAnimation}
            />
            <motion.h1 className={`text-dark ${styles.whoRUText}`} variants={textAnimation}>
              Who Are You ?

            </motion.h1>
          </div>
          <div className="row m-0">
            <motion.div className={`col-lg-6 text-center ml-5`} variants={eclipseAnimation}>
              <div onClick={() => { setShowModal(true); setUserRole("Screen Writer") }}
                className={`${styles.leftEcllipse} ${styles.ecllipse}`}>
                {/* <div className={styles.blob}>
                    <span></span>
                    <span></span>  
                    <span></span>  
                  </div>   */}
                <h2 className={`mb-0 ${styles.eclipseText}`}>Screen Writer</h2>
                <h3 className={`mb-0 ${styles.eclipseText}`}>(Creator)</h3>
              </div>
            </motion.div>

            <motion.div
              className={`col-lg-6 text-center ml-5`} variants={eclipseAnimation}>
              <div
                onClick={() => { setShowModal(true); setUserRole("Industry Member") }}
                className={`${styles.rightEcllipse} ${styles.ecllipse}`}>
                <h2 className={`mb-0 ${styles.eclipseText}`}>Industry Member</h2>
                <h3 className={`mb-0 ${styles.eclipseText}`}>(Maker)</h3>
              </div>

            </motion.div>
          </div>

        </motion.div>
        <motion.div variants={doddleVariant}
          initial="hidden"
          animate="show">
          <img
            className={styles.star_5}
            src="/S4_5_star.svg"
            alt="S4_5_star"
          />
          <img
            className={styles.star_1}
            src="/S4_star.svg"
            alt="S4_star"
          />
          <img
            className={styles.earth}
            src="/S4_earth.svg"
            alt="S4_earth"
          />
          <img
            className={styles.s4_shooting_star}
            src="/S4_shooting_star.svg"
            alt="S4_shooting_star"
          />
          <img
            className={styles.s4_planet}
            src="/S4_planet.svg"
            alt="S4_planet"
          />
          <img
            className={styles.S4_2_star}
            src="/S4_2_star.svg"
            alt="S4_2_star"
          />
          <img
            className={styles.star_1_bottom}
            src="/S4_star.svg"
            alt="S4_star"
          />
          <img
            className={styles.s4_shooting_star_right}
            src="/S4_shooting_star.svg"
            alt="S4_shooting_star"
          />
          <img
            className={styles.s4_Rocket}
            src="/S4_Rocket.svg"
            alt="S4_Rocket"
          />
          <img
            className={styles.s4_3_star}
            src="/S4_3_star.svg"
            alt="S4_3_star"
          />
          <img
            className={styles.s4_space_ship}
            src="/S4_space_ship.svg"
            alt="S4_space_ship"
          />
          <img
            className={styles.s4_galaxy}
            src="/S4_galaxy.svg"
            alt="S4_galaxy"
          />
          <img
            className={styles.star_1_top}
            src="/S4_star.svg"
            alt="S4_star"
          />
        </motion.div>
      </motion.div>
      <a href="/marketplace" className={styles1.black_arrow}>
        <Arrow />
      </a>

      {/* </Layout> */}
      <Modal centered className="modal-xl modal-dialog-centered" show={showModal} onHide={() => setShowModal(false)} >
        {/* <Modal.Header closeButton/> */}
        <LoginSignup userRole={userRole} />
      </Modal>

    </>
  );
}
