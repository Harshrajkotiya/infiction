// import { CognitoUser } from "@aws-amplify/auth";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Auth } from "aws-amplify";
import React, { useState } from "react";
import { Form, Toast } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaAt, FaEnvelopeOpen, FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../styles/LoginSignup.module.css";

interface IFormInput {
  name: string;
  email: string;
  password: string;
  code: string;
}

export default function Signup(props) {
  // const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);
  const [signUpError, setSignUpError] = useState<string>("");
  const [showCode, setShowCode] = useState<boolean>(false);
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  async function signUpWithEmailAndPassword(
    data: IFormInput
  ): Promise<CognitoUser> {
    const { name, password, email } = data;
    try {
      const resUser = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          phone_number: "",
          birthdate: "",
          name: name,
          picture: "",
          "custom:role": props.userRole,
          "custom:user_desc": "-",
        },
      });
      // console.log("Signed up a user:", resUser.user);
      resUser.user.id = resUser.userSub;
      return resUser.user;
    } catch (error) {
      throw error;
    }
  }

  async function confirmSignUp(data: IFormInput) {
    const { name, email, password, code } = data;
    try {
      await Auth.confirmSignUp(email, code);
      const amplifyUser = await Auth.signIn(email, password);
      // console.log("Success, singed in a user", amplifyUser);
      if (amplifyUser) {
        props.toggleElementsVisibility();
      } else {
        setSignUpError("Something went wrong :'(");
        setOpen(true);
        throw new Error("Something went wrong :'(");
      }
    } catch (error) {
      console.log("error confirming sign up", error);
      setSignUpError(error.message);
      setOpen(true);
    }
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      if (showCode) {
        confirmSignUp(data);
      } else {
        const user = await signUpWithEmailAndPassword(data);
        const custData = { email: user.username, user_id: user.id };
        const customerResponse = await fetch("/api/customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(custData),
        });
        const customer = await customerResponse.json();

        setIsSignupSuccess(true);
        setShowCode(true);
      }
    } catch (err) {
      // console.log(err);
      setSignUpError(err.message);
      setOpen(true);
    }
    setIsLoading(false);
  };

  // console.log("The value of the user from the hook is:", user);

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
            background-color: #eee !important;
            border: none !important;
            padding: 12px 15px !important;
            margin: 8px 0;
            width: 100% !important;
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

          .input-group {
            position: relative !important;
            display: flex !important;
            flex-wrap: wrap !important;
            align-items: stretch !important;
            width: 100% !important;
          }
          .input-group > .form-control {
            position: relative !important;
            flex: 1 1 auto;
            width: 1%;
            margin-bottom: 0;
          }
          .input-group > .input-group-append {
            position: absolute !important;
            top: 0;
            right: 0;
            z-index: 99;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2.5rem;
            height: 100%;
            pointer-events: all;
          }
          .input-group > .input-group-append > .input-group-text {
            display: flex !important;
            align-items: center !important;
            justify-content: center;
            width: 100% !important;
            height: 100%;
            padding: 0.375rem 0.75rem !important;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: #495057;
            text-align: center;
            white-space: nowrap;
            border: 0;
            pointer-events: all;
          }
        `}
      </style>
      {isSignupSuccess && (
        <Snackbar
          open={isSignupSuccess}
          autoHideDuration={6000}
          onClose={() => setIsSignupSuccess(false)}
        >
          <Alert onClose={() => setIsSignupSuccess(false)} severity="success">
            You have registered successfully! Please check your email for the
            verification code.
          </Alert>
        </Snackbar>
      )}
      <div className="errors">
        <Toast
          show={open}
          onClose={handleClose}
          delay={6000}
          className="col-12 w-100"
        >
          <Toast.Header>
            {open}
            {/* <i className="fa-solid fa-circle-exclamation fa-sm" style={{color: "#f24207"}}></i> */}
            <strong className={`mr-auto text-danger`}>{signUpError}</strong>
          </Toast.Header>
        </Toast>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        method="post"
        className={styles.leftRadius}
      >
        <h1 className="text-black fw-bold">Sign Up</h1>

        <Form.Group controlId="name" className={`userform ${styles.userform_resp}`}>
          <div className="input-group">
            <Form.Control
              type="text"
              isInvalid={errors.name ? true : false}
              placeholder={
                props.userRole === "Industry Member"
                  ? "Company Name"
                  : "Enter name"
              }
              required
              {...register("name", {
                required: { value: true, message: "Please enter a username." },
              })}

            />
            {errors != "" && (
              <div className="input-group-append">
                <span className="input-group-text">
                  <FaAt />
                </span>
              </div>
            )}
            <Form.Control.Feedback type="invalid">
              {errors.name ? errors.name.message : null}
            </Form.Control.Feedback>
          </div>
        </Form.Group>

        <Form.Group controlId="email" className={`userform ${styles.userform_resp}`}>
          <div className="input-group">
            <Form.Control
              type="email"
              isInvalid={errors.email ? true : false}
              placeholder={
                props.userRole === "Industry Member"
                  ? "Company Email"
                  : "Enter Email"
              }
              required
              {...register("email", {
                required: {
                  value: true,
                  message: "Please enter a valid email.",
                },
              })}
            />
            {errors != "" && (
              <div className="input-group-append">
                <span className="input-group-text">
                  <FaEnvelopeOpen />
                </span>
              </div>
            )}
            <Form.Control.Feedback type="invalid">
              {errors.email ? errors.email.message : null}
            </Form.Control.Feedback>
          </div>
        </Form.Group>

        <Form.Group controlId="password" className={`userform ${styles.userform_resp}`}>
          <div className="input-group">
            <Form.Control
              type={showPassword ? "text" : "password"}
              isInvalid={errors.password ? true : false}
              placeholder="Enter password"
              required
              {...register("password", {
                required: { value: true, message: "Please enter a password." },
                // minLength: {
                //   value: 8,
                //   message: "Please enter a stronger password.",
                // },
              })}
            />
            {errors != "" && (
              <div className="input-group-append" onClick={toggleShowPassword}>
                <span className="input-group-text">
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            )}
            <Form.Control.Feedback type="invalid">
              {errors.password ? errors.password.message : null}
            </Form.Control.Feedback>
          </div>
          {!showCode && <p className="text-end" onClick={() => setShowCode(true)}>Already have a code?</p>}
        </Form.Group>
        {showCode && (
          <Form.Group controlId="code" className={`userform pb-0 ${styles.userform_resp}`}>
            <Form.Control
              type="text"
              isInvalid={errors.code ? true : false}
              placeholder="Enter Verification code"
              {...register("code", {
                required: { value: true, message: "Please enter a code." },
                minLength: {
                  value: 6,
                  message: "Your verification code must be 6 characters long.",
                },
                maxLength: {
                  value: 6,
                  message: "Your verification code must be 6 characters long.",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.code ? errors.code.message : null}
            </Form.Control.Feedback>
          </Form.Group>
        )}

        <div style={{ marginTop: showCode ? 8 : 24}}>
          <button type="submit">
            {isLoading ?
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> :
              showCode ? "Confirm Code" : "Sign Up"}
          </button>
        </div>
      </form>
    </>
  );
}
