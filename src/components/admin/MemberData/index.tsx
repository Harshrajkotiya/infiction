import { UserContext } from "@/store/CognitoUser/CognitoUserContext";
import React, { useContext, useEffect, useState } from "react";
import styles from "../../../styles/admin.module.css";
import { useRouter } from "next/router";

export default function MemberData() {
  const router = useRouter();
  const [ cognitoUsers, setCognitoUsers ] = useState([]);
  const [curCognitoUser, setCurCognitoUser] = useState({});

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/getUsers");
      const data = await response.json();
      setCognitoUsers(data.message);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  },[]);

  useEffect(()=>{
    const curUserData = cognitoUsers.filter((user) => user.Username === router.query["user_id"]);

    const updatedArray = curUserData.map(item => {
      const { Attributes, ...rest } = item;
      return rest;
    });

    const expandedAttributes = curUserData[0] && curUserData[0].Attributes.reduce((acc, attr) => {
      acc[attr.Name] = attr.Value;
      return acc;
    }, {});

    const updatedcurUserData = { ...updatedArray[0], ...expandedAttributes };
    setCurCognitoUser(updatedcurUserData)
    // console.log("updatedcurUserData", updatedcurUserData);
  },[cognitoUsers]);

  return (
    <>
      <div className={`${styles.user_header} py-2 px-3 border-bottom d-flex justify-content-between`} >
        <h3 className="fw-bold">User Information</h3>
        {/* <button className={`btn btn-warning `} onClick={() => router.push(`/admin/user/${router.query["type"]}/${router.query["user_id"]}/edituser`)}>
          Edit
        </button> */}
      </div>
      <div className="row px-3">
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
          <div className="my-2" style={{ borderRight: "1px solid grey" }}>
            <div className="row mb-2">
              <div>
                <span className="fw-bold">Infiction ID</span><br />
                <span className="text-muted">{curCognitoUser.Username}</span>
              </div>
            </div>
            <div className="row mb-2">
              <div>
                <span className="fw-bold">Infiction Username</span><br />
                <span className="text-muted">{curCognitoUser["custome:inf_username"] ? curCognitoUser["custome:inf_username"] : "-"}</span>
              </div>
            </div>
            <div className="row mb-2">
              <div>
                <span className="fw-bold">Role</span><br />
                <span className="text-muted">{curCognitoUser["custom:role"]}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
          <div className="my-2" style={{ borderRight: "1px solid grey" }}>

            <div className="row mb-2">
              <div>
                <span className="fw-bold">Name</span><br />
                <span className="text-muted">{curCognitoUser.name}</span>
              </div>
            </div>
            <div className="row mb-2">
              <div>
                <span className="fw-bold">Email</span><br />
                <span className="text-muted">{curCognitoUser.email}</span>
              </div>
            </div>
            <div className="row mb-2">
              <div>
                <span className="fw-bold">Phone Number</span><br />
                <span className="text-muted">{curCognitoUser.phone_number ? curCognitoUser.phone_number : "-"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
          <div className="my-2">
            <div className="row mb-2">
              <div>
                <span className="fw-bold">Created Date</span><br />
                <span className="text-muted">{curCognitoUser.UserCreateDate}</span>
              </div>
            </div>
            <div className="row mb-2">
              <div>
                <span className="fw-bold">Last Modified Date</span><br />
                <span className="text-muted">{curCognitoUser.UserLastModifiedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
