//import { useState, useEffect } from 'react';
import { Auth } from "aws-amplify";
import router from "next/router";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import styles from "../styles/Profile.module.css";
import { GetUserImg } from "./get_profile_img";
import { updateUserData } from "./update_user_data";
// import styles from '@/styles/screen1.module.css';
import {
  FaChevronDown,
  FaEnvelope,
  FaGlobe,
  FaMailBulk,
  FaPen,
  FaPhone,
  FaUser,
  FaAddressBook,
} from "react-icons/fa";
import { MdSchool } from "react-icons/md";

interface IFormInput {
  name: string;
  username: string;
  dob: string;
  email: string;
  phone_number: string;
  education: string;
  user_bio: string;
  picture: string;
  inf_username: String;
  picture_prefix: String;
  website: String;
}

export default function Profile(props) {
  let data = {};

  const [getData, setGetData] = useState("");
  const [file, setFile] = useState<any>();
  const [fileName, setFileName] = useState<any>();
  const [userFile, setUserFile] = useState<any>();
  const [user, setUser] = useState("");
  const [userImg, setUserImg] = useState("");
  const [phone, setPhone] = useState("");
  const [userRole, setUserRole] = useState("");

  const inputFile = useRef(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    data.picture = fileName || "";
    data.picture_prefix = "profile";
    data.email = data.email || user?.attributes?.email;
    data.phone_number = phone ? "+" + phone : user?.attributes?.phone_number;
    data.user_bio = data.user_bio || user?.attributes?.["custom:user_desc"];
    data.name = data.name || user?.attributes?.name;
    data.dob = data.dob || user?.attributes?.birthdate;
    data.education =
      data.education || user?.attributes?.["custom:qualification"];
    data.inf_username =
      data.username || user?.attributes?.["custom:inf_username"];
    data.website = data.website || user?.attributes?.["custom:website"];

    const result = await updateUserData(data);
    props.updateData();
    props.onClose();
  };

  const uploadFilen = (e) => {
    if (inputFile.current != null) {
      inputFile.current.click();
    }
  };

  const selectFile = (e) => {
    setFile(URL.createObjectURL(e.target.files[0]));
    setFileName(e.target.files[0]);

    // console.log("Upload file data is :", file);
  };

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setUser(user);
        setUserRole(user?.attributes?.["custom:role"]);
        GetUserImg(`profile_${user?.attributes?.picture}`)
          .then((user_img) => {
            setUserImg(user_img);
            // console.log("user.attributes?.picture", user.attributes?.picture);
            // console.log("user_img....", user_img);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log("User is not authenticated", err));
  }, []);

  return (
    <>
      <style jsx>
        {`
          * {
            color: white;
            font-family: courier;
          }

          // hr {
          //   width: 100px;
          //   margin: auto;
          //   height: 3px;
          //   background-color: #f3ae09;
          //   border: none;
          //   opacity: 1;
          // }

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

          input:focus,
          textarea:focus {
            background-color: #000000;
            color: white;
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
            background: none;
          }
         
        `}
      </style>
      <div className="container">
        <div className="row">
          <div className={`card  ${styles.cardBg}`}>
            <div className="card-body text-center text-white">
              <h3>Create/Update InFiction Profile</h3>
              {/* <hr className="mb-4" style={{ width: "100px", margin: "auto" }} /> */}

              <form
                className="mt-4 profile_update_form"
                onSubmit={handleSubmit(onSubmit)}
                method="post"
              >
                <div className="col-lg-12">
                  <img
                    className={`img-thumbnail ${styles.imgCircle}`}
                    src={file ? file : userImg ? userImg : `/profile_avtar.png`}
                    alt=""
                    onClick={uploadFilen}
                    style={{ width: "180px", height: "190px" }}
                  />
                  <input
                    type="file"
                    id="picture"
                    onChange={(e) => selectFile(e)}
                    style={{ display: "none" }}
                    ref={inputFile}
                  />

                  {!file && (
                    <img
                      className={`img-thumbnail ${styles.center_img}`}
                      src="/upload.png"
                      alt=""
                      onClick={uploadFilen}
                    />
                  )}
                </div>

                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                    <Form.Group controlId="name">
                      <div className="input-group">
                        <Form.Control
                          type="text"
                          placeholder={
                            userRole === "Industry Member"
                              ? "Company Name"
                              : "Actual Name"
                          }
                          defaultValue={user.attributes?.name || ""}
                          {...register("name")}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">
                            <FaUser />
                          </span>
                        </div>
                      </div>
                    </Form.Group>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                    <Form.Group controlId="username">
                      <div className="input-group">
                        <Form.Control
                          type="text"
                          placeholder="InFiction Username"
                          defaultValue={
                            user.attributes?.["custom:inf_username"] || ""
                          }
                          {...register("username")}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">
                            <FaUser />
                          </span>
                        </div>
                      </div>
                    </Form.Group>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                    <Form.Group controlId="dob">
                      <Form.Control
                        type="date"
                        placeholder="DOB"
                        defaultValue={user.attributes?.birthdate || ""}
                        {...register("dob")}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-2 ">
                    <Form.Group controlId="email">
                      <div className="input-group">
                        <Form.Control
                          className="text-muted"
                          type="email"
                          placeholder="Email"
                          defaultValue={user.attributes?.email || ""}
                          {...register("email")}
                          disabled
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">
                            <FaEnvelope />
                          </span>
                        </div>
                      </div>
                    </Form.Group>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                    <div className="input-group">
                      <PhoneInput
                        country={"in"}
                        value={user.attributes?.phone_number || ""}
                        // defaultValue= {user.attributes?.phone_number || ""},
                        inputProps={{
                          name: "phone_number",
                          id: "phone_number",
                          placeholder: "Phone Number",
                        }}
                        {...register("phone_number")}
                        onChange={setPhone}
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <FaPhone />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                    <Form.Group controlId="education">
                      <div className="input-group">
                        <Form.Control
                          type="text"
                          placeholder={
                            userRole === "Industry Member"
                              ? "Address"
                              : "Education"
                          }
                          defaultValue={
                            user.attributes?.["custom:qualification"] || ""
                          }
                          {...register("education")}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">
                            {userRole === "Industry Member" ? (
                              <FaAddressBook />
                            ) : (
                              <MdSchool />
                            )}
                          </span>
                        </div>
                      </div>
                    </Form.Group>
                  </div>
                </div>
                {userRole === "Industry Member" && (
                  <div className="col-lg-12 col-md-12 col-sm-12 mt-2">
                    <Form.Group controlId="website">
                      <div className="input-group">
                        <Form.Control
                          type="text"
                          placeholder="Company Website"
                          defaultValue={
                            user.attributes?.["custom:website"] || ""
                          }
                          {...register("website")}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">
                            <FaGlobe />
                          </span>
                        </div>
                      </div>
                    </Form.Group>
                  </div>
                )}
                <div className="form-group mt-3">
                  <Form.Group controlId="user_bio">
                    <div className="input-group">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Short bio"
                        maxLength={350}
                        defaultValue={
                          user.attributes?.["custom:user_desc"] || ""
                        }
                        {...register("user_bio")}
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <FaPen />
                        </span>
                      </div>
                    </div>
                  </Form.Group>
                </div>

                <div className="row d-inline mt-2">
                  <div
                    className={`col-lg-2 col-md-4 col-sm-5 d-inline`}
                    onClick={props.onClose}
                  >
                    <button
                      style={{ float: "left" }}
                      type="button"
                      className={`btn-lg btn btn-outline-secondary mt-3 ${styles.cancel_btn} `}
                    >
                      Cancel
                    </button>
                    <button
                      style={{ float: "right" }}
                      type="submit"
                      className={`btn-lg btn btn-outline-secondary mt-3 ${styles.cancel_btn}`}
                    >
                      Save
                    </button>
                  </div>

                  {/* <div
                    className="col-lg-2 col-md-4 col-sm-5"
                    style={{ textAlign: "right" }}
                  >
                   
                  </div> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
