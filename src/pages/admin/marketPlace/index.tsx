import React, { useContext, useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import styles from "../../../styles/admin.module.css";
import { UserContext } from "@/store/CognitoUser/CognitoUserContext";
import HoldsData from "@/components/admin/HoldsData";
import MemberScreenplay from "@/components/admin/MemberScreenplay";

export default function MarketPlace() {
  const router = useRouter();
  const [detailedSP, setDetailedSP] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [listedCount, setListedCount] = useState(0);
  const [holdedCount, setHoldedCount] = useState(0);
  const [boughtCount, setBoughtCount] = useState(0);
  const [topRatedSP, setTopRatedSP] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/screenplay?detailed=true`);
        const data = await response.json();
        setDetailedSP(data.rows);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (detailedSP?.length != 0) {
      // const expandedAttributes = detailedSP?.map(item => {
      //   if (Array.isArray(item?.Attributes)) {
      //     item.Attributes = item.Attributes.reduce((acc, attr) => {
      //       acc[attr.Name] = attr.Value;
      //       return acc;
      //     }, {});
      //   }
      //   return item;
      // });
      const topRated_SP = detailedSP?.filter((obj) => obj?.is_toprated === true)
      const total_count = detailedSP?.filter((obj) => obj?.is_toprated === true).length
      const listed_count = topRated_SP?.filter((obj) => obj?.is_listed === true).length
      const holded_count = topRated_SP?.filter((obj) => obj?.is_holded === true).length
      const bought_count = topRated_SP?.filter((obj) => obj?.is_bought === true).length
      setTopRatedSP(topRated_SP);
      setTotalCount(total_count);
      setListedCount(listed_count);
      setHoldedCount(holded_count);
      setBoughtCount(bought_count);
    }

  }, [detailedSP])

  return (
    <>
      <main className={`p-3 w-100 bg-light ${styles.adminPanelChild}`}>
        <div className="row gap-3">
          <div className="row p-2 gy-3 justify-content-center align-items-center" style={{
            width: "100%",

          }}>
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="card shadow-sm bg-white rounded" style={{ background: "radial-gradient(circle at 18.7% 57.8%, rgb(250, 250, 250) 0%, #ebebeb 90%)" }}>
                <div className="card-body p-2 text-center">
                  <p className="text-black fw-bold fs-5">Top Rated Screenplay</p>
                  <h2 className="text-black fw-bolder">{totalCount}</h2>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="card shadow-sm bg-white rounded" style={{ background: "radial-gradient(circle at 18.7% 57.8%, rgb(250, 250, 250) 0%, #ebebeb 90%)" }}>
                <div className="card-body p-2 text-center">
                  <p className="text-black fw-bold fs-5">Listed Screenplay</p>
                  <h2 className="text-black fw-bolder">{listedCount}</h2>
                </div>
              </div></div>
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="card shadow-sm bg-white rounded" style={{ background: "radial-gradient(circle at 18.7% 57.8%, rgb(250, 250, 250) 0%, #ebebeb 90%)" }}>
                <div className="card-body p-2 text-center">
                  <p className="text-black fw-bold fs-5">Holded Screenplay</p>
                  <h2 className="text-black fw-bolder">{holdedCount}</h2>
                </div>
              </div></div>
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="card shadow-sm bg-white rounded" style={{ background: "radial-gradient(circle at 18.7% 57.8%, rgb(250, 250, 250) 0%, #ebebeb 90%)" }}>
                <div className="card-body p-2 text-center">
                  <p className="text-black fw-bold fs-5">Bought Screenplay</p>
                  <h2 className="text-black fw-bolder">{boughtCount}</h2>
                </div>
              </div></div>
          </div>
          <div className="row mt-4">
            <div className="col-12 px-0 ms-2">
              <MemberScreenplay detailedSP={topRatedSP}/>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
