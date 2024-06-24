import FeedbackPopup from "@/components/FeedbackPopup";
import Modal1 from "@/components/modal";
import SPInfo from "@/components/spInfo";
import {
  getTopRatedScreenplay,
  getUserScreenplays,
} from "@/lib/Screenplay/Sphelpers";
import FormatPrice from "@/utils/FormatPrice";
import React, { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
} from "react-bootstrap-table2-paginator";
import { useMutation, useQueries, useQuery, useQueryClient } from "react-query";
import styles from "../../../styles/admin.module.css";
import { useRouter } from "next/router";
import {
  ButtonGroup,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import ReaderJobs from "@/components/ReaderDashboard";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import { handleupdateScreenplay } from "@/lib/Screenplay/updateScreenplay";

function SPTable({ data, type, is_marketplace }) {
  const [showSPInfo, setshowSPInfo] = useState(false);
  const [showReview, setShowReview] = useState();
  const [radioValue, setRadioValue] = useState("No");

  const router = useRouter();

  function handleSPOpen(row) {
    setShowReview(row);
    setshowSPInfo(true);
  }

  function handleSPClose() {
    setshowSPInfo(false);
  }

  const queryClient = useQueryClient();
  const UpdateMutation = useMutation(
    (newData) => handleupdateScreenplay(newData.id, newData),
    {
      onSuccess: async (data) => {
        await queryClient.prefetchQuery(
          ["TopScreenplay", router.query["user_id"]],
          () => getTopRatedScreenplay(router.query["user_id"])
        );
      },
    }
  );

  const columns = [
    {
      dataField: "id",
      text: "Screen play id",
      hidden: true,
    },
    {
      dataField: "title",
      text: "Screenplay",
      sort: true,
      editable: false,
      // filter: textFilter(),
      formatter: (cell, row) => (
        <>
          <div style={{ textAlign: "left" }} className="text-nowrap">
            <img
              onClick={() => {
                handleSPOpen(row);
              }}
              src="/sp_icon.png"
              alt="pencil"
              style={{ cursor: "pointer" }}
            />
            <span className="ms-2" style={{ cursor: "pointer" }}>
              {cell}
            </span>
          </div>
        </>
      ),
    },
    {
      dataField: "infiction_rating",
      text: "InFiction Rating(5)",
      sort: true,
      editable: false,
      formatter: (cell, row) => (
        <FeedbackPopup
          type={"infiction"}
          screenplay_id={row.id}
          rating={row.infiction_rating}
          feedback={row.infiction_feedback}
        />
      ),
    },
    {
      dataField: "industry_rating",
      text: "Industry Rating(10)",
      sort: true,
      editable: false,
      style: {
        whiteSpace: "nowrap",
      },
      formatter: (cell, row) => (
        <FeedbackPopup
        type={"industry"}
          screenplay_id={row.id}
          rating={row.industry_rating}
          feedback={row.industry_feedback}
        />
      ),
    },
    {
      dataField: "reserved_price",
      text: "Reserved Price(₹)",
      sort: true,
      editable: false,
      align:'center',
      formatter: (cell) => (cell ? <FormatPrice price={cell} /> : "-"),
      editor: {
        style: {
          backgroundColor: "transparent",
          color: "white",
          outline: "none !important",
          border: "none",
        },
        autoSelectText: false,
      },
    },
    {
      dataField: "ihf",
      text: "IHF",
      sort: true,
      editable: true,
      editor: {
        type: Type.SELECT,
        options: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No",
            label: "No",
          },
        ],
      },
      formatter: (cell) => (
        <>
          <style jsx>{`
            .ihf_style {
              border-radius: 40px;
              text-transform: uppercase;
              font-size: 10px;
            }
          `}</style>
          <span className="btn btn-outline-warning px-3 py-2 ihf_style">
            {cell}
          </span>
        </>
      ),
    },
    {
      dataField: "industry_views",
      text: "Industry views",
      sort: true,
      editable: false,
      align:'center',
      formatter: (cell) => (
        <>
          <img src="/table_eyes.svg" alt="table_eyes" />
          <span className="ms-2">{cell}</span>
        </>
      ),
    },
    {
      dataField: "is_listed",
      text: "Listed",
      editable: false,
      hidden: type === "Industry Member",
      align:'center',
      formatter: (cell, row) => (
        <>
          <p className={`badge ${cell === true  ? "bg-success" : "bg-danger"}`}>{cell === true ? "Yes" : "No"}</p>
        </>
      ),
    },
    {
      dataField: "is_bought",
      text: "Bought?",
      editable: false,
      hidden: type === "Industry Member",
      align:'center',
      formatter: (cell) => (
        <>
          <span className={`badge ${cell === true  ? "bg-success" : "bg-danger"}`}>{cell === true ? "Yes" : "No"}</span>
        </>
      ),
    },
    {
      dataField: "is_holded",
      text: "Holded?",
      editable: false,
      hidden: is_marketplace === false,
      align:'center',
      formatter: (cell) => (
        <>
          <span className={`badge ${cell === true ? "bg-success" : "bg-danger"}`}>{cell === true ? "Yes" : "No"}</span>
        </>
      ),
    },
   
  ];

  const pageButtonRenderer = ({
    page,
    active,
    disable,
    title,
    onPageChange,
  }) => {
    const handleClick = (e) => {
      e.preventDefault();
      onPageChange(page);
    };
    const activeStyle = {};
    if (active) {
      activeStyle.backgroundColor = "black";
      activeStyle.color = "white";
    } else {
      activeStyle.backgroundColor = "";
      activeStyle.color = "black";
    }
    if (typeof page === "string") {
      activeStyle.backgroundColor = "";
      activeStyle.color = "black";
    }
    return (
      <>
        <style jsx>
          {`
            .btn_pagination {
              border-radius: 4px 0px 0px 4px;
              background: white;
              color: black;

              // box-shadow: 0px 4px 1px rgba(0, 0, 0, 0.01), 0px 2px 1px rgba(0, 0, 0, 0.05), 0px 1px 1px rgba(0, 0, 0, 0.09), 0px 0px 0px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
            }
            .page-link,
            .page-item,
            .page-item.disabled {
              background-color: white !important;
              border: none;
              color: black;
            }

            .page-item:first-child {
              border-radius: 4px 0px 0px 4px;
              color: black;
            }

            .page-item:last-child {
              border-radius: 0px 4px 4px 0px;
            }

            .page-link:last-child {
              color: black;
            }

            .active > .page-link {
              background-color: #f3ae09 !important;
              margin: 2px;
              border-radius: 4px;
              color: black;
            }
          `}
        </style>
        <li className="page-item btn_pagination">
          <button className="btn" onClick={handleClick} style={activeStyle}>
            {page}
          </button>
        </li>
      </>
    );
  };

  const options = {
    pageButtonRenderer,
    custom: true,
    totalSize: data ? data?.length : 0,
    sizePerPage: 7,
    hideSizePerPage: true,
    hidePageListOnlyOnePage: true,
    paginationTotalStandalone: true,
    alwaysShowAllBtns: true,
    withFirstAndLast: false,
    paginationTotalRenderer: (from, to, size) => (
      <span style={{ color: "#7A7A7A" }}>
        {" "}
        {to}/{size} Items{" "}
      </span>
    ),
  };

  return (
    <>
      <PaginationProvider pagination={paginationFactory(options)}>
        {({ paginationProps, paginationTableProps }) => (
          <div>
            <BootstrapTable
              bootstrap4
              responsive
              keyField="id"
              data={data ? data : []}
              bordered={false}
              columns={columns}
              wrapperClasses="table-responsive"
              noDataIndication={() => (
                <div className="text-center">No data available</div>
              )}
              headerClasses={styles.user_header}
              cellEdit={cellEditFactory({
                mode: "click",
                afterSaveCell: async (oldValue, newValue, row, column) => {
                  const updateData = Object.assign(
                    {},
                    {
                      id: parseInt(row.id),
                      ihf: row.ihf,
                    }
                  );
                  await UpdateMutation.mutate(updateData);
                },
                blurToSave: true,
              })}
              {...paginationTableProps}
            />
            <div className="d-flex justify-content-between px-2">
              <PaginationTotalStandalone {...paginationProps} />
              <PaginationListStandalone {...paginationProps} />
            </div>
          </div>
        )}
      </PaginationProvider>
      <Modal1
        showModal={showSPInfo}
        component={
          <SPInfo
            showReview={showReview}
            type={"infiction"}
            onClose={handleSPClose}
          />
        }
        onClose={handleSPClose}
      />
    </>
  );
}

export default function MemberScreenplay(props) {
  console.log("props", props);
  
  const router = useRouter();

  const queryKey =
    router.query["type"] === "Screen Writer"
      ? ["UserscreenplayData", router.query["user_id"]]
      : ["TopScreenplay"];

  const fetchData =
    router.query["type"] === "Screen Writer"
      ? () => getUserScreenplays(router.query["user_id"])
      : () => getTopRatedScreenplay(router.query["user_id"]);

  const { isLoading, isError, data, error } = useQuery(queryKey, fetchData);

  const wishedData = data?.rows?.filter((obj) => obj.is_wished === true);
  const purchasedData = data?.rows?.filter(
    (obj) => obj.is_bought && obj.buyer_id === router.query["user_id"]
  );

  if (isLoading)
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  if (isError) return <div>Got Error {error}</div>;

  return (
    <section id="content">
      <div
        className="p-0 w-100 border"
        style={{
          backgroundColor:
            router.query["type"] === "infiction_reader" ||
              router.query["type"] === "industries_reader"
              ? "white"
              : "white",
        }}
      >
        {router.query["type"] === "Industry Member" ? (
          <div className="member_dash_tab dash_tab">
            <Tabs
              defaultActiveKey="Wishlist"
              transition={false}
              id="noanim-tab-example"
            >
              <Tab eventKey="Wishlist" title="Wishlist">
                <div style={{ color: "#666873" }}>
                  <hr />
                </div>
                <SPTable
                  data={wishedData ? wishedData : []}
                  type={router.query["type"]}
                  is_marketplace={false}
                />
              </Tab>
              <Tab eventKey="Purchased" title="Purchased">
                <div style={{ color: "#666873" }}>
                  <hr />
                </div>
                <SPTable
                  data={purchasedData ? purchasedData : []}
                  type={router.query["type"]}
                  is_marketplace={false}
                />
              </Tab>
            </Tabs>
          </div>
        ) : router.query["type"] === "infiction_reader" ||
          router.query["type"] === "industries_reader" ? (
          <div className="member_dash_tab dash_tab mt-4 text-dark">
            <Tabs
              defaultActiveKey="Assigned Jobs"
              transition={false}
              id="noanim-tab-example"
            // className="mb-3"
            >
              <Tab eventKey="Assigned Jobs" title="Assigned Jobs">
                <div style={{ color: "#666873" }}>
                  <hr />
                </div>
                {router.query["type"] === "infiction_reader" ? (
                  <ReaderJobs
                    user_id={router.query["user_id"]}
                    type={"infiction"}
                    status={"Active"}
                    loggedInUser={"admin"}
                  />
                ) : (
                  <ReaderJobs
                    user_id={router.query["user_id"]}
                    type={"industry"}
                    status={"Active"}
                    loggedInUser={"admin"}
                  />
                )}
              </Tab>
              <Tab eventKey="Done Jobs" title="Done Jobs">
                <div style={{ color: "#666873" }}>
                  <hr />
                </div>
                {router.query["type"] === "infiction_reader" ? (
                  <ReaderJobs
                    user_id={router.query["user_id"]}
                    type={"infiction"}
                    status={"Done"}
                    loggedInUser={"admin"}
                  />
                ) : (
                  <ReaderJobs
                    user_id={router.query["user_id"]}
                    type={"industry"}
                    status={"Done"}
                    loggedInUser={"admin"}
                  />
                )}
              </Tab>
            </Tabs>
          </div>
        ) : props.detailedSP ? (
          <SPTable data={props.detailedSP} type={router.query["type"]} is_marketplace={true} />
        )  : (
          <SPTable data={data} type={router.query["type"]} is_marketplace={false}/>
        )}
      </div>
    </section>
  );
}
