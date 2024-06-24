import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Form, Modal, Toast } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaEnvelopeOpen, FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../../../styles/LoginSignup.module.css";
import Image from "next/image";
import { UserAuthentication } from "@/utils/userAuthentication";

interface IFormInput {
  username: string;
  password: string;
}


function Login() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [signInError, setSignInError] = useState<string>("");

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();


  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const response = await UserAuthentication(data.username, data.password, "admin");
    if (response?.statusCode === 400 && response.error){
      setSignInError(response.error);
      setOpen(true);
    }

  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <style jsx>
        {`
            * {
              font-family: "courier";
            }
            form {
              // background-image: url("../mainimg.jpg");
              background-color: white;
              background-size: cover;
              background-repeat: no-repeat;
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
              // border-radius: 10px;
              background-color: black;
              border-color: transparent;
              color: #ffffff;
              font-size: 12px;
              font-weight: bold;
              padding: 12px 45px;
              letter-spacing: 1px;
              text-transform: uppercase;
              transition: transform 80ms ease-in;
            }
            button:hover{
              background-color: black;
              color: #ffffff;

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

      <div className="row align-items-center justify-content-center mx-0 h-75">
        <div className="col-5 mx-auto">
          <div className="card card-body">
            <div className="errors">
              <Toast
                show={open}
                onClose={handleClose}
                delay={6000}
                className="col-12 w-100"
              >
                <Toast.Header>
                  {/* <i className="fa-solid fa-circle-exclamation fa-sm" style={{color: "#f24207"}}></i> */}
                  <strong className="mr-auto text-danger">{signInError}</strong>
                </Toast.Header>
              </Toast>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
              method="post"
              className={`p-4 ${styles.rightRadius}`}
            >

              <Form.Group controlId="username" className="userform mt-2">
                <div className="input-group">
                  <Form.Control
                    type="email"
                    isInvalid={errors.username ? true : false}
                    placeholder={"Enter Email"}
                    {...register("username")}
                  />

                  <div className="input-group-append">
                    <span className="input-group-text">
                      <FaEnvelopeOpen />
                    </span>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.username ? errors.username.message : null}
                  </Form.Control.Feedback>

                </div>
              </Form.Group>

              <Form.Group controlId="password" className="userform mt-3 mb-3">
                <div className="input-group">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    isInvalid={errors.password ? true : false}
                    placeholder="Enter password"
                    {...register("password")}
                  />
                  <div className="input-group-append" onClick={toggleShowPassword}>
                    <span className="input-group-text">
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.password ? errors.password.message : null}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              <button className="btn btn-lg w-100" type="submit">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>


      {/* {showForgotpass &&
         <Modal centered className="modal-xl modal-dialog-centered" show={showForgotpass} onHide={() => setShowForgotpass(false)} >
         
         <Forgot showAbout={showForgotpass} component={Forgot} onClose={handleClose1} />
       </Modal>
  
          } */}
    </>
  );
}

export default function AdminLogin() {
  const router = useRouter();
  return (
    <>
      <div style={{ height: "100vh", background: "#eee" }}>

        <img src="../logo.png" className={` ${styles.logo_stick}`}
          alt="InFiction White Logo"
          width={100}
          height={100}
        />
        <Login />
      </div>
    </>
  );
}

