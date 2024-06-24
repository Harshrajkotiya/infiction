import React, { useContext } from "react";
import Router, { useRouter } from "next/router";
import AdminSideBar from "@/components/admin";
import MemberScreenplay from "@/components/admin/MemberScreenplay";
import MemberData from "@/components/admin/MemberData";
import styles from "../../../../../styles/admin.module.css";
import { UserContext } from "@/store/CognitoUser/CognitoUserContext";

export default function UserScreenplayData() {
  const router = useRouter();
  const { cognitoUsers, setCognitoUsers } = useContext(UserContext);
  async function deleteCognitoUser() {

    try {
      const response = await fetch(`/api/DeleteUser?userId=${router.query["user_id"]}`);
      const data = await response.json();

      try {
        const responseDB = await fetch(`/api/reader?userId=${router.query["user_id"]}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const deletedReader = await responseDB.json();
        console.log("deletedReader", deletedReader);
        
        router.back()
      } catch (err) {
        console.log("error", err);

      }
    } catch (err) {
      console.log("error", err);

    }


  }
  return (
    <>
      <main className={`p-3 w-100 bg-light ${styles.adminPanelChild}`}>
        <div className="row gap-3">
          <div className="row">
            <div className="col-12 text-end">
              <button className="btn btn-dark" onClick={deleteCognitoUser}>
                Delete User
              </button>
            </div>
          </div>
          <div className="row ">
            <div className="col-12 bg-white border p-0 ms-2">
              <MemberData />
            </div>
          </div>
          <div className="row">
            <div className="col-12 px-0 ms-2">
              <MemberScreenplay />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
