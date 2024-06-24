import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
} from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { FaCaretUp, FaCaretDown, FaTrashAlt } from "react-icons/fa";
import { Auth } from "aws-amplify";
import spUpload from "../components/spUpload";
import Modal1 from "./modal";
import { getUserScreenplays } from  "@/lib/Screenplay/Sphelpers";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { handleupdateScreenplay } from "@/lib/Screenplay/updateScreenplay";
import FormatPrice from "@/utils/FormatPrice";

export default function Table() {
  const [userData, setUserScreenplay] = useState([]);
  const [user, setuser] = useState(null);
  const [showEditfile, setShowEditfile] = useState(false);

  // get data of screenplay
  const { isLoading, isError, data, error } = useQuery(
    ["UserscreenplayData", user?.attributes?.sub],
    () => getUserScreenplays(user?.attributes?.sub)
  );
  
  const queryClient = useQueryClient();

  const UpdateMutation = useMutation(
    (newData) => handleupdateScreenplay(newData?.id, newData),
    {
      onSuccess: async (data) => {
        queryClient.setQueryData(
          ["UserscreenplayData", user?.attributes?.sub],
          data
        );
        queryClient.prefetchQuery(
          ["UserscreenplayData", user?.attributes?.sub],
          () => getUserScreenplays(user?.attributes?.sub)
        );
      },
    }
  );

  function handleClose() {
    setShowEditfile(false);
  }

  // useEffect hook is used to fetch data on component mount
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setuser(user);
      })
      .catch((error) => console.log("unable to get Logged in user", error));
  }, []);

  useEffect(() => {
    setUserScreenplay(data?.rows);
  }, []);

  const customSortCaret = (order, column) => {
    if (!order)
      return (
        <span>
          <FaCaretUp
            className="fa-thin fa-caret-up fa-sm"
            style={{ color: "#f3ae09" }}
          />
          <FaCaretDown
            className="fa-thin fa-caret-down fa-sm"
            style={{ color: "#f3ae09" }}
          />
        </span>
      );
    else if (order === "asc")
      return (
        <span>
          <FaCaretUp
            className="fa-thin fa-caret-up fa-sm"
            style={{ color: "#f3ae09" }}
          />
        </span>
      );
    else if (order === "desc")
      return (
        <span>
          <FaCaretDown
            className="fa-thin fa-caret-down fa-sm"
            style={{ color: "#f3ae09" }}
          />
        </span>
      );
    return null;
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch("/api/screenplay", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: parseInt(id) }),
      });
      // Code to handle successful screenplay deleteion
      const data = await response.json();
      const code = await response.status;
      setUserScreenplay(userData.filter((item) => item.id !== id));
      // console.log("Delete with Code:", { [code]: data });
    } catch (error) {
      // Code to handle error
      console.error("Unable to Delete Screenplay:", error);
    }
  };

  const handleUpdate = async (id, reserved_price) => {
    // try {
    //   const response = await fetch("/api/screenplay", {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       id: parseInt(id),
    //       reserved_price: reserved_price,
    //     }),
    //   });
    //   // Code to handle successful screenplay updation
    //   const data = await response.json();
    //   const code = await response.status;
    //   const newData = userData.map((item) =>
    //     item.id === id ? { ...item, reserved_price: reserved_price } : item
    //   );
    //   setUserScreenplay(newData);
    //   console.log("Update with Code:", { [code]: data });
    // } catch (error) {
    //   // Code to handle error
    //   console.error("Unable to Update Screenplay:", error);
    // }
    const UpdatedData = {id: parseInt(id), reserved_price: reserved_price}
    UpdateMutation.mutate(UpdatedData);
  };

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
      sortCaret: customSortCaret,
      editable: false,
      formatter: (cell, row) => (
        <>
          <div style={{ textAlign: "left" }} className="text-nowrap">
            <img
              onClick={() => setShowEditfile(true)}
              src="../sp_icon.png"
              alt="pencil"
              style={{ cursor: "pointer" }}
            />
            <span className="ms-2">{cell}</span>
          </div>
        </>
      ),
    },
    {
      dataField: "infiction_rating",
      text: "InFiction Rating(5)",
      sort: true,
      sortCaret: customSortCaret,
      editable: false,

      formatter: (cell) => (
        <>
          <span
            className="badge rounded-pill text-light px-3 py-2 rating_bg ms-2"
            style={{ backgroundColor: "#424242" }}
          >
            <img src="../table_star.svg" alt="table_star" /> {cell}
          </span>
        </>
      ),
    },
    {
      dataField: "industry_rating",
      text: "Industry Rating(10)",
      sort: true,
      sortCaret: customSortCaret,
      editable: false,
      formatter: (cell) => (
        <>
          <span
            className="badge rounded-pill text-light px-3 py-2 rating_bg ms-2"
            style={{ backgroundColor: "#424242" }}
          >
            <img src="../table_star.svg" alt="table_star" /> {cell}
          </span>
        </>
      ),
    },
    {
      dataField: "reserved_price",
      text: "Reserved Price(₹)",
      sort: true,
      sortCaret: customSortCaret,
      editable: true,
      formatter: (cell) => (cell ? <FormatPrice price={cell}/> : "-"),
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
      sortCaret: customSortCaret,
      editable: false,
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
      sortCaret: customSortCaret,
      editable: false,
      formatter: (cell) => (
        <>
          <img src="../table_eyes.svg" alt="table_eyes" />
          <span className="ms-2">{cell}</span>
        </>
      ),
    },

    {
      dataField: "action",
      text: "Action",
      editable: false,
      formatter: (cell, row) => (
        <>
          <button className="btn" onClick={() => handleDelete(row.id)}>
            {/* <img src="../delect_white_icon.svg" alt="table_eyes" /> */}
            <FaTrashAlt
              className="fa-thin fa-trash-alt fa-sm"
              style={{ color: "#f3ae09" }}
            />
          </button>
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
      activeStyle.backgroundColor = "#F3AE09";
      activeStyle.color = "black";
    } else {
      activeStyle.backgroundColor = "";
      activeStyle.color = "white";
    }
    if (typeof page === "string") {
      activeStyle.backgroundColor = "";
      activeStyle.color = "#8A93A6";
    }
    return (
      <>
        <style jsx>
          {`
            .btn_pagination {
              border-radius: 4px 0px 0px 4px;
              background: #292929;
              // box-shadow: 0px 4px 1px rgba(0, 0, 0, 0.01), 0px 2px 1px rgba(0, 0, 0, 0.05), 0px 1px 1px rgba(0, 0, 0, 0.09), 0px 0px 0px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
            }
            .page-link,
            .page-item,
            .page-item.disabled {
              background-color: #292929 !important;
              border: none;
              color: white;
            }

            .page-item:first-child {
              border-radius: 4px 0px 0px 4px;
              color: #7a7a7a;
            }

            .page-item:last-child {
              border-radius: 0px 4px 4px 0px;
            }

            .page-link:last-child {
              color: #7a7a7a;
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
          <button
            className="btn"
            href="#"
            onClick={handleClick}
            style={activeStyle}
          >
            {page}
          </button>
        </li>
      </>
    );
  };

  const options = {
    pageButtonRenderer,
    custom: true,
    totalSize: userData.length,
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
      <style jsx>{``}</style>
      <div className="container-fluid p-0 dash_table">
        <PaginationProvider pagination={paginationFactory(options)}>
          {({ paginationProps, paginationTableProps }) => (
            <div>
              <BootstrapTable
                bootstrap4
                keyField="id"
                data={userData}
                columns={columns}
                bordered={false}
                noDataIndication={() => (
                  <div className="text-center">No data available</div>
                )}
                cellEdit={cellEditFactory({
                  mode: "dbclick",
                  afterSaveCell: (oldValue, newValue, row, column) => {
                    handleUpdate(row.id, newValue);
                  },
                })}
                {...paginationTableProps}
              />
              <div className="d-flex justify-content-between">
                <PaginationTotalStandalone {...paginationProps} />
                <PaginationListStandalone {...paginationProps} />
              </div>
            </div>
          )}
        </PaginationProvider>
        {/* <Modal1 showAbout={showEditfile} component={<spUpload />} onClose={handleClose} /> */}
      </div>
    </>
  );
}

// const [selectedOption, setSelectedOption] = useState('list');

// const handleOptionChange = (event) => {
//   setSelectedOption(event.target.value);
// };
// {
//   dataField: "list/dilist",
//   text: "List/Dilist",
//   // sort: true,
//   editable: false,
//   formatter:(cell) => (
//     <>
//   <style jsx>{`
//     .pricing-toggle {
//       background-color: black;
//       border-radius: 10px;
//       display: inline-block;
//       margin-left:50px;

//     }
//     .pricing-toggle [name="pricing"] {
//       display: none;
//       border-color:transperant;

//     }
//     .pricing-toggle input[type="radio"]+label {
//       background-color:black;
//       color: white;
//       padding: 5px 5px;
//       border-radius: 10px;
//       cursor: pointer;
//       user-select: none;
//       margin-left:0px;

//       width: 50px;

//     }
//     .pricing-toggle input[type="radio"]:checked+label {
//       background-color:  #f3ae09;
//       color: #00008B;
//       border-radius:10px;

//     }
//     input#pricing-toggle-list:checked+label {
//         border-radius: 10px 0px 0px 10px;
//         padding-left:10px !important;
//       }
//       input#pricing-toggle-delist:checked+label {
//         border-radius: 0px 10px 10px 0px;
//         padding-left:4px !important;
//       }

//   `}</style>
//   <div className="pricing-toggle">
//     <input
//       type="radio"
//       id="pricing-toggle-list"
//       name="pricing"
//       value="list"
//       checked={selectedOption === 'list'}
//       onChange={handleOptionChange}
//     />
//     <label className="radio-button" htmlFor="pricing-toggle-list">
//       List
//     </label>

//     <input
//       type="radio"
//       id="pricing-toggle-delist"
//       name="pricing"
//       value="delist"
//       checked={selectedOption === 'delist'}
//       onChange={handleOptionChange}
//     />
//     <label className="radio-button" htmlFor="pricing-toggle-delist">
//       DeList
//     </label>
//   </div>

// </>
//   )
// },
