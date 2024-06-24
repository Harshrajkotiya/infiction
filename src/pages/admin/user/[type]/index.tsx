import React, { useContext, useEffect } from "react";
import Router, { useRouter } from "next/router";
import AdminSideBar from "@/components/admin";
import { UserContext } from "@/store/CognitoUser/CognitoUserContext";
import MemberList from "@/components/admin/MemberList";
import styles from "../../../../styles/admin.module.css";

export default function InfictionUserData({ CongnitoData }) {
  const router = useRouter();

  const { cognitoUsers, setCognitoUsers } = useContext(UserContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/getUsers");
        const data = await response.json();
        setCognitoUsers(data.message);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <main className="p-3 w-100 bg-light">
        <div className="row">
          <div className="row">
            <div className="col-12">
              <section id="title">
                <h3 className="fw-bold">
                  {router.query["type"] === "Industry Member"
                    ? "Industry Members"
                    : router.query["type"] === "infiction_reader" ? "Infiction Readers" : router.query["type"] === "industries_reader" ? "Industry Readers" : "Screen Writers"}
                </h3>
              </section>
              <MemberList type={router.query["type"]} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
