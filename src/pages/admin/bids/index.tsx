import React, { useContext } from "react";
import Router, { useRouter } from "next/router";
import styles from "../../../styles/admin.module.css";
import { UserContext } from "@/store/CognitoUser/CognitoUserContext";
import BidsData from "@/components/admin/BidsData";

export default function UserScreenplayData() {
  const router = useRouter();
  const { cognitoUsers, setCognitoUsers } = useContext(UserContext);

  return (
    <>
      <main className={`p-3 w-100 bg-light ${styles.adminPanelChild}`}>
        <div className="row gap-3">
          <div className="row ">
            <div className="col-12 bg-white border p-0 ms-2">
              <BidsData />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
