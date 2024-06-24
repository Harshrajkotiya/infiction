import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Form, Toast } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import styles from "../styles/LoginSignup.module.css";
import { FaEnvelopeOpen, FaEye, FaEyeSlash } from "react-icons/fa";

interface IFormInput {
  email: string;
  code: string;
  password: string;
}

export default function Forgotpassword(props) {
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const [ErrorMsg, setErrorMsg] = useState<string>("");
  const [isEmailsent, setisEmailsent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [SuccessMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/getUsers");
      const data = await response.json();
      return data.message;

    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    const data1 = await fetchUsers();

    const findUser = data1?.find((e) => e?.Attributes.find((obj) => (obj.Name === "email" && obj.Value == data.email)))?.Attributes.find((att) => att.Name === "custom:role" && att.Value === props.userRole);
    if (!findUser) {
      setIsError(true);
      setErrorMsg(
        "User Does not exist!"
      );
    } else {
      if (props.userRole === "reader") {
        const adminResetPassword = async () => {
          const formDataString = JSON.stringify(data);
          try {
            const response = await fetch("/api/resetPasword", {
              headers: {
                "Content-Type": "application/json",
              },
              body: formDataString,
            });
            const data = await response.json();
          } catch (error) {
            console.log("Error fetching users:", error);
          }
        };
        adminResetPassword();
      }
      else if (isEmailsent) {
        try {
          await Auth.forgotPasswordSubmit(data.email, data.code, data.password);
          console.log("Password reset successfully");
          setSuccessMsg("Password reset successfully");
          props.toggleForgotVisibility();
        } catch (error) {
          console.log("Error resetting password:", error);
          setIsError(true);
          setErrorMsg(
            "Password reset failed! Please double-check your code or try again later."
          );
        }
      } else {
        // Reset the user's password using the reset code and new password
        try {
          // console.log("data.email", data.email);
          await Auth.forgotPassword(data.email);
          console.log("Password reset successfully");
          setisEmailsent(true);
          setIsSuccess(true);
          setSuccessMsg(
            "Reset password code has sent successfully on your e-mail! Please,check your e-mail!"
          );
        } catch (error) {
          console.log("Error send reset password code:", error);
          setIsError(true);
          if (error.code === "UserNotFoundException") {
            setErrorMsg("Please check your e-mail!");
          } else {
            setErrorMsg(
              "Unable to send a code to reset your password to your registered email! After some time, try again."
            );
          }
          setIsError(true);
        }
      }
    }

    setIsLoading(false)
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setIsError(false);
  };

  return (
    <>
      <style jsx>
        {`
                    * {
                        font-family: "courier";
                    }
                    // .container_bg
                    // {
                    //     background-image: url("../Signup_doodle.png");
                    //     background-repeat: no-repeat;
                    //     background-size: cover;
                    //     // width: 40%;
                    //     }
        }
          }
        //   form {
        //     background-color: #ffffff;
        //     display: flex;
        //     align-items: center;
        //     justify-content: center;
        //     flex-direction: column;
        //     padding: 0 50px;
        //     height: 100%;
        //     text-align: center;
        //   }

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
        
          .forgotform{
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            justify-content: center;
            align-items: center;
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
      {isSuccess && (
        <Snackbar
          open={isSuccess}
          autoHideDuration={6000}
          onClose={() => setIsSuccess(false)}
        >
          <Alert onClose={() => setIsSuccess(false)} severity="success">
            {SuccessMsg}
          </Alert>
        </Snackbar>
      )}
      {isError && (
        <Snackbar
          open={isError}
          autoHideDuration={6000}
          onClose={() => setIsError(false)}
        >
          <Alert onClose={() => setIsError(false)} severity="Error">
            {ErrorMsg}
          </Alert>
        </Snackbar>
      )}

      <div className="container d-flex justify-content-center">
        {!isEmailsent ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            method="post"
            className={styles.rightRadius}
          >
            <h1 className="text-black fw-bold">Forgot Password</h1>
            <div className="">
              <Form.Group controlId="email" className="userform mb-3">
                <div className="input-group">
                  <Form.Control
                    type="email"
                    isInvalid={errors.email ? true : false}
                    placeholder="Enter Registered Email"
                    {...register("email")}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">
                      <FaEnvelopeOpen />
                    </span>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.email ? errors.email.message : null}
                  </Form.Control.Feedback>
                </div>
                <p className="text-end" onClick={() => setisEmailsent(true)}>Already have a code?</p>
              </Form.Group>

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={props.onClose}
                  type="submit"
                >
                  {isLoading ?
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    : "Reset Password"
                  }
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            method="post"
            className={styles.rightRadius}
            style={{ textAlign: "center" }}
          >
            <h1 className="text-black fw-bold">Reset Password</h1>
            <div className="">
              <Form.Group controlId="code" className="userform mb-3">
                <Form.Control
                  type="text"
                  isInvalid={errors.code ? true : false}
                  placeholder="Enter code"
                  {...register("code", {
                    required: { value: true, message: "Please enter Code." },
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.code ? errors.code.message : null}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="password" className="userform mb-3">
                <div className="input-group">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    isInvalid={errors.password ? true : false}
                    placeholder="Enter password"
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Please enter a password.",
                      },
                    })}
                  />
                  <div
                    className="input-group-append"
                    onClick={toggleShowPassword}
                  >
                    <span className="input-group-text">
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.password ? errors.password.message : null}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              <div style={{ marginTop: 16 }}>
                <button
                  onClick={props.onClose}
                  type="submit"
                >
                  {isLoading ?
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    : "Submit"
                  }
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
