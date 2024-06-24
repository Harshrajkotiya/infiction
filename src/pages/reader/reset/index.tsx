import Header from "@/components/header";
import LoginSignup from "@/pages/login_signup";
import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { Form, Toast } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import styles from "../../../styles/LoginSignup.module.css";
import { FaEnvelopeOpen, FaEye, FaEyeSlash } from "react-icons/fa";

interface IFormInput {
  email: string;
  code: string;
  password: string;
}

function Forgotpassword(props) {
  const [isError, setIsError] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (props.userRole === "reader") {
      const adminResetPassword = async () => {
        const formDataString = JSON.stringify(data);
        try {
          const response = await fetch("/api/resetPasword", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: formDataString,
          });
          const data = await response.json();
          // console.log("data", data, data.statusCode === 200);

          if (data.statusCode === 200) {
            router.push("/reader/login?open=true");
          }

          setIsSuccess(data.statusCode === 200);
          // setOpen(data.message.statusCode === 400);
        } catch (error) {
          console.log("Error fetching users:", error);
        }
      };
      adminResetPassword();
    }
  };

  return (
    <>
      <style jsx>
        {`
          * {
            font-family: "courier";
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

          .forgotform {
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
            {"Password Reset Successfully"}
          </Alert>
        </Snackbar>
      )}
      {isError && (
        <Snackbar
          open={isError}
          autoHideDuration={6000}
          onClose={() => setIsError(false)}
        >
          <Alert onClose={() => setIsError(false)} severity="error">
            {"Unable to reset password"}
          </Alert>
        </Snackbar>
      )}
      <div className="container d-flex justify-content-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          method="post"
          className={styles.rightRadius}
          style={{ textAlign: "center" }}
        >
          <h1 className="text-black fw-bold">Reset Password</h1>
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
            </Form.Group>

            <Form.Group controlId="password" className="userform mb-3">
              <div className="input-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  isInvalid={errors.password ? true : false}
                  placeholder="Enter New password"
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
              <button type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default function ResetReader() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    setShowModal(router.query["open"] === 'true');
  },[router.query["open"]]);

  return (
    <>
      <Header imgSrc="/email_logo.png" />
      <Modal
        centered
        className="modal-xl modal-dialog-centered"
        show={showModal}
        backdrop="static"
        onHide={() => setShowModal(false)}
      >
        <Forgotpassword userRole={"reader"} />
      </Modal>
    </>
  );
}
