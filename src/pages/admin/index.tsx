import React, { useContext, useEffect, useState } from "react";
import AdminSideBar from "@/components/admin";
import { AuthenticateUser } from "@/utils/protecteRoutes";

export default function Admin() {
  const [cognitoUsers, setCognitoUsers] = useState([]);
  const [writerCount, setWriterCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [infReaderCount, setInfReaderCount] = useState(0);
  const [indReaderCount, setIndReaderCount] = useState(0);

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

  useEffect(() => {
    if (cognitoUsers.length != 0) {
      const expandedAttributes = cognitoUsers?.map(item => {
        if (Array.isArray(item?.Attributes)) {
          item.Attributes = item.Attributes.reduce((acc, attr) => {
            acc[attr.Name] = attr.Value;
            return acc;
          }, {});
        }
        return item;
      });
      const writer_count = expandedAttributes?.filter((obj) => obj?.Attributes["custom:role"] === "Screen Writer").length
      const member_count = expandedAttributes?.filter((obj) => obj?.Attributes["custom:role"] === "Industry Member").length
      const infiction_reader_count = expandedAttributes?.filter((obj) => obj?.Attributes["custom:role"] === "infiction_reader").length
      const industry_reader_count = expandedAttributes?.filter((obj) => obj?.Attributes["custom:role"] === "industries_reader").length
      setWriterCount(writer_count);
      setMemberCount(member_count);
      setInfReaderCount(infiction_reader_count);
      setIndReaderCount(industry_reader_count);
    }

  }, [cognitoUsers])

  return (
    <>
      <div className="row p-2 gy-3 justify-content-center align-items-center" style={{
        width: "100%",
        zIndex: "5"

      }}>
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="card shadow-sm bg-white rounded" style={{ background: "radial-gradient(circle at 18.7% 57.8%, rgb(250, 250, 250) 0%, #ebebeb 90%)" }}>
            <div className="card-body p-2 text-center">
              <p className="text-black fw-bold fs-5">Writer Count</p>
              <h2 className="text-black fw-bolder">{writerCount}</h2>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="card shadow-sm bg-white rounded" style={{ background: "radial-gradient(circle at 18.7% 57.8%, rgb(250, 250, 250) 0%, #ebebeb 90%)" }}>
            <div className="card-body p-2 text-center">
              <p className="text-black fw-bold fs-5">Member Count</p>
              <h2 className="text-black fw-bolder">{memberCount}</h2>
            </div>
          </div></div>
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="card shadow-sm bg-white rounded" style={{ background: "radial-gradient(circle at 18.7% 57.8%, rgb(250, 250, 250) 0%, #ebebeb 90%)" }}>
            <div className="card-body p-2 text-center">
              <p className="text-black fw-bold fs-5">Infiction Reader Count</p>
              <h2 className="text-black fw-bolder">{infReaderCount}</h2>
            </div>
          </div></div>
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="card shadow-sm bg-white rounded" style={{ background: "radial-gradient(circle at 18.7% 57.8%, rgb(250, 250, 250) 0%, #ebebeb 90%)" }}>
            <div className="card-body p-2 text-center">
              <p className="text-black fw-bold fs-5">Infiction Reader Count</p>
              <h2 className="text-black fw-bolder">{indReaderCount}</h2>
            </div>
          </div></div>
      </div>
    </>
  );
}
