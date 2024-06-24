import React from "react";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/LoginSignup.module.css";
import { Variants, motion } from "framer-motion";
import Signup from "../components/signup";
import Signin from "../components/signin";
import Forgotpassword from "../components/forgotPassword";

export default function LoginSignup({ userRole }) {
  const [isElement1Visible22, setIsElement1Visible22] = useState(true);
  const [isForgotVisible, setIsForgotVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileScreenn, setIsMobileScreenn] = useState(false);
  const [isTabletScreen, setIsTabletScreen] = useState(false);


  const toggleElementsVisibility = () => {
    setIsElement1Visible22(!isElement1Visible22);
    setIsOpen((isOpen) => !isOpen);
  };
  const toggleForgotVisibility = () => {
    setIsForgotVisible(!isForgotVisible);
    setIsOpen((isOpen) => !isOpen);
  };

  useEffect(() => {
    const isTabletOrMobile = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const tabletBreakpoint = 998; // Adjust this value based on your desired tablet breakpoint
      const mobileBreakpoint = 375; // Adjust this value based on your desired mobile breakpoint

      if (width <= mobileBreakpoint ) {
        return "mobile";
      } else if (width > mobileBreakpoint  && width <= tabletBreakpoint) {
        return "tablet";
      } else {
        return "desktop";
      }

    };

    const screenSize = isTabletOrMobile();
    if (screenSize === "mobile") {
      setIsMobileScreenn(true);
      setIsTabletScreen(false);
    } else if(screenSize === "tablet") {
      setIsTabletScreen(true);
      setIsMobileScreenn(false);
    }else{
      setIsMobileScreenn(false);
      setIsTabletScreen(false);

    }
    // console.log("Screen size response from fun: ", screenSize);
  }, []);


  const animat1: Variants = {
    hide: {
      opacity: 1,
      x: "-100%",
      transition: {
        duration: 1,
      },
    },
    show: {
      opacity: 1,
      x: "0%",
      transition: {
        duration: 1,
      },
    },
  };

  const animat2: Variants = {
    hide: {
      x: "98%",
      transition: {
        duration: 1,
      },
    },
    show: {
      x: "1%",
      transition: {
        duration: 1,
      },
    },
  };

  const tabletVariants1: Variants = {
    hide: {
      opacity: 1,
      y: "-45%",
      transition: {
        duration: 1,
      },
    },
    show: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 1,
      },
    },
  };

  const tabletVariants2: Variants = {
    hide: {
      opacity: 1,
      y: "210%",
      transition: {
        duration: 1,
      },
    },
    show: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 1,
      },
    },
  };

  const mobileVariant: Variants = {
    hide: {
      opacity: 1,
      y: "270%",
      transition: {
        duration: 1,
      },
    },
    show: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 1,
      },
    },
  };

  const mobileVariant2: Variants = {
    hide: {
      opacity: 1,
      y: "-36%",
      transition: {
        duration: 1,
      },
    },
    show: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 1,
      },
    },
  };


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthYear: 0,
  });

  return (
    <>
      <style jsx>
        {`
          * {
            font-family: "courier";
          }
          form {
            background-color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 0 50px;
            height: 100%;
            text-align: center;
          }

          input {
            background-color: #eee;
            border: none;
            padding: 12px 15px;
            margin: 8px 0;
            width: 100%;
          }
          button {
            border-radius: 10px;
            background-color: #000000;
            border-color: transparent;
            color: #ffffff;
            font-size: 12px;
            font-weight: bold;
            padding: 12px 45px;
            letter-spacing: 1px;
            text-transform: uppercase;
            transition: transform 80ms ease-in;
          }
        `}
      </style>
      <div className={`row ${styles.heightRow}`}>
        <motion.div
          className={`col-lg-6 ${styles.centerCol} ${styles.leftRadius} `}
          style={{
            backgroundImage: "url(../Signup_doodle.png)",
            backgroundSize: "cover",
            borderTopRightRadius: "7px",
            borderBottomRightRadius: "10px",
            zIndex: "10",
          }}
          animate={isOpen ? "hide" : "show"}
          variants={isMobileScreenn ? mobileVariant : isTabletScreen ? tabletVariants2 : animat2}
        >
          <div
            className="overlay-panel overlay-right text-center"
            style={{ marginTop: "-100" }}
          >
            {/* <h1>Hello, Creators!</h1> */}
            <h4 className="text-white">
              {isElement1Visible22
                ? (isForgotVisible ? "Enter your personal details and start your journey with us." : <div><h1>Forgot password</h1><p>To reset your password, enter the registered E-mail address.</p></div>)
                : "Welcome Back, Please login to Your account."}
            </h4>
            <button
              onClick={() => { isForgotVisible ? toggleElementsVisibility() : toggleForgotVisibility() }}
              style={{ backgroundColor: "#F3AE09", borderColor: "transparent" }}
            >
              {isElement1Visible22 ? (isForgotVisible ? "Signup" : "Back") : "Signin"}
            </button>
          </div>
        </motion.div>

        <motion.div
          className={`col-lg-6 ${styles.rightRadius}  ${styles.centerVerticleRow}`}
          animate={isOpen ? "hide" : "show"}
          variants={isMobileScreenn ?  mobileVariant2 : isTabletScreen ? tabletVariants1 : animat1}
        >
          {isElement1Visible22 ? (
            // <form action="../../profile_update" method="post" className={styles.rightRadius}>
            //     <h1 className="text-black">Login</h1>
            //     <input type="email" name="email" placeholder="Email"  required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />
            //     <input type="password" name="password" placeholder="Password" required/>
            //     <a href="#">Forgot your password?</a>
            //     <button>Sign In</button>
            // </form>
            (isForgotVisible ? <Signin userRole={userRole} onToggle={toggleForgotVisibility} /> : <Forgotpassword toggleForgotVisibility={toggleForgotVisibility} />)

          ) : (
            // <form action="#" method="post" className={styles.leftRadius}>
            //     <h1 className="text-black">Sign Up</h1>
            //     <input type="text" name="name" placeholder="Name" required/>
            //     <input type="email" name="email" placeholder="Email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />
            //     <input type="password" name="password" placeholder="Password" required/>
            //     <button>Sign Up</button>
            // </form>
            <Signup userRole={userRole} toggleElementsVisibility={toggleElementsVisibility} />
          )}
        </motion.div>
      </div>
    </>
  );
}
