import { useEffect, useState } from "react";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
} from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import { Button } from "react-bootstrap";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import Modal1 from "@/components/modal";
import FeedBackRating from "@/components/feedback_rating";
import SPInfo from "./spInfo";
import { useRouter } from "next/router";

export default function ReaderJobs({
  user_id,
  type,
  status,
  loggedInUser = "reader",
}) {
  // console.log("type", type);

  const [screenplayByReaderId, setScreenplayByReaderId] = useState([]);
  const [showEditfile, setShowEditfile] = useState(false);
  const [showSPInfo, setshowSPInfo] = useState(false);
  const [showReview, setShowReview] = useState();
  const router = useRouter();

  useEffect(() => {
    fetchScreenplayByReaderId();
  }, []);

  //Get screenplays from reader_id
  async function fetchScreenplayByReaderId() {
    const response = await fetch(
      `/api/reader?${
        type === "infiction" ? "inf_reader_id" : "ind_reader_id"
      }=${user_id}`
    );
    const spData = await response.json();
    // console.log("Assigned Screenplay:", spData.rows);
    const filteredData =
      status === "Done"
        ? spData?.rows?.filter((obj) => obj.status === "Done")
        : spData?.rows?.filter((obj) => obj.status != "Done");
    setScreenplayByReaderId(filteredData);
  }

  function openReviewModel(row) {
    setShowReview(row);
    setShowEditfile(true);
  }

  function handleSPOpen(row) {
    setShowReview(row);
    setshowSPInfo(true);
  }

  function handleClose() {
    setShowEditfile(false);
    setshowSPInfo(false);
  }

  function handleSPClose() {
    setshowSPInfo(false);
  }

  function handleCloseModal() {
    setShowEditfile(false);
  }

  const handleUpdate = async (reader_id, sp_id, rating, status) => {
    // console.log(
    //   "Clicks and get data :",
    //   rating,
    //   " sp_id:",
    //   sp_id,
    //   "Reader Id:",
    //   reader_id
    // );
    const ratingData = {
      reader_id: reader_id,
      screenplay_id: sp_id,
      rating: rating,
      status: status,
    };
    const response = await fetch(
      `/api/${type === "infiction" ? "infiction_rating" : "industries_rating"}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ratingData),
      }
    );
    const ratingUpdate = await response.json();
    const newData = screenplayByReaderId.map((item) =>
      item.id === sp_id ? { ...item, status: "Done" } : item
    );
    setScreenplayByReaderId(newData);
    // console.log("Status of Updated Rating:", ratingUpdate.message);
  };

  const customSortCaret = (order, column) => {
    if (!order)
      return (
        <span>
          <FaCaretUp
            className="fa-thin fa-caret-up fa-sm"
            style={{ color: loggedInUser === "admin" ? "black" : "#f3ae09" }}
          />
          <FaCaretDown
            className="fa-thin fa-caret-down fa-sm"
            style={{ color: loggedInUser === "admin" ? "black" : "#f3ae09" }}
          />
        </span>
      );
    else if (order === "asc")
      return (
        <span>
          <FaCaretUp
            className="fa-thin fa-caret-up fa-sm"
            style={{ color: loggedInUser === "admin" ? "black" : "#f3ae09" }}
          />
        </span>
      );
    else if (order === "desc")
      return (
        <span>
          <FaCaretDown
            className="fa-thin fa-caret-down fa-sm"
            style={{ color: loggedInUser === "admin" ? "black" : "#f3ae09" }}
          />
        </span>
      );
    return null;
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
      align: "center",
      headerAlign: "center",
      sort: true,
      sortCaret: customSortCaret,
      editable: false,
      formatter: (cell, row) => (
        <>
          <div
            style={{ textAlign: "center", cursor: "pointer" }}
            className="text-nowrap"
            onClick={() => {
              handleSPOpen(row);
            }}
          >
            <img src="/../sp_icon.png" alt="pencil" />

            <span className="ms-2">{cell}</span>
          </div>
        </>
      ),
    },
    {
      dataField: "genre",
      text: "Genres",
      align: "center",
      headerAlign: "center",
      // sort: true,
      // sortCaret: customSortCaret,
      editable: false,
      formatter: (cell) => {
        const options = cell.split(",").slice(0, 2);

        const TagButtonStyle = {
          borderRadius: "40px",
          textTransform: "uppercase",
          fontSize: "12px",
        };
        return (
          <>
            <div>
              {options.map((option) => (
                <span key={option}>
                  <Button
                    variant={`${
                      loggedInUser === "admin" ? "dark" : "outline-warning"
                    }`}
                    className="genre_style"
                    style={TagButtonStyle}
                    size="sm"
                  >
                    {option}
                  </Button>{" "}
                </span>
              ))}
            </div>
          </>
        );
      },
    },
    {
      dataField: "tags",
      text: "Tags",
      // sort: true,
      // sortCaret: customSortCaret,
      align: "center",
      headerAlign: "center",
      editable: false,
      style: {
        whiteSpace: "nowrap",
        width: "200px",
        overflow: "auto",
        maxWidth: "300px",
      },
      formatter: (cell) => {
        const options = cell.split(",").slice(0, 2);

        const TagButtonStyle = {
          borderRadius: "40px",
          textTransform: "uppercase",
          fontSize: "12px",
        };
        return (
          <>
            <div>
              {options.map((option) => (
                <span key={option}>
                  <Button
                    variant={`${
                      loggedInUser === "admin" ? "dark" : "outline-warning"
                    }`}
                    className="genre_style"
                    style={TagButtonStyle}
                    size="sm"
                  >
                    {option}
                  </Button>{" "}
                </span>
              ))}
            </div>
          </>
        );
      },
    },
    {
      dataField: "rating",
      text: "Rating",
      sort: true,
      sortCaret: customSortCaret,
      align: "center",
      headerAlign: "center",
      editable: false,
      formatter: (cell, row) => (
        <>
          <div
            style={{ textAlign: "center", cursor: "pointer" }}
            className="text-nowrap"
          >
            <span
              className="ms-2"
              onClick={() => {
                openReviewModel(row);
              }}
            >
              {cell ? cell : 0}
            </span>
          </div>
        </>
      ),
    },
    {
      dataField: "status",
      text: "Mark as Done",
      align: "center",
      headerAlign: "center",
      hidden: status === "Done",
      editable: false,
      formatter: (cell, row) => {
        const handleStatusChange = (e) => {
          row.status = e.target.checked ? "Done" : "Pending";
        };
        if (
          router.query["type"] === "infiction_reader" ||
          router.query["type"] === "industries_reader"
        ) {
          return row.status;
        } else {
          return (
            <div className="form-check align-items-center d-flex justify-content-center">
              <input
                type="checkbox"
                className=""
                checked={row.status === "Done"}
                onChange={handleStatusChange}
              />
            </div>
          );
        }
      },
      events: {
        onClick: async (e, column, columnIndex, row, rowIndex) => {
          handleUpdate(row.reader_id, row.id, row.rating, "Done");
        },
      },
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
      activeStyle.backgroundColor =
        loggedInUser === "admin" ? "black" : "#f3ae09";
      activeStyle.color = loggedInUser === "admin" ? "white" : "black";
    } else {
      activeStyle.backgroundColor = "";
      activeStyle.color = loggedInUser === "admin" ? "black" : "white";
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
              // border-radius: 4px 0px 0px 4px;
              background: ${loggedInUser === "admin" ? "white" : "#292929 "};
              // box-shadow: 0px 4px 1px rgba(0, 0, 0, 0.01), 0px 2px 1px rgba(0, 0, 0, 0.05), 0px 1px 1px rgba(0, 0, 0, 0.09), 0px 0px 0px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
            }
            .page-link,
            .page-item,
            .page-item.disabled {
              background-color: ${loggedInUser === "admin"
                ? "white !important"
                : "#292929 !important"};
              border: none;
              color: white;
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
    totalSize: screenplayByReaderId?.length,
    sizePerPage: 10,
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
      <style jsx>
        {`
          * {
            font-family: "courier";
          }
        `}
      </style>
      <div
        className={`container-fluid p-0 ${
          loggedInUser === "reader" && "dash_table"
        } w-100`}
      >
        <PaginationProvider pagination={paginationFactory(options)}>
          {({ paginationProps, paginationTableProps }) => (
            <div>
              <BootstrapTable
                bootstrap4
                responsive
                keyField="id"
                data={screenplayByReaderId}
                columns={columns}
                bordered={loggedInUser === "admin"}
                wrapperClasses="table-responsive"
                noDataIndication={() => (
                  <div className="text-center">No data available</div>
                )}
                {...paginationTableProps}
              />
              <div className="d-flex justify-content-between">
                <PaginationTotalStandalone {...paginationProps} />
                <PaginationListStandalone {...paginationProps} />
              </div>
            </div>
          )}
        </PaginationProvider>
        <Modal1
          showModal={showEditfile}
          component={
            <FeedBackRating
              showReview={showReview}
              type={
                type === "infiction" ? "infiction_reader" : "industries_reader "
              }
              onClose={handleClose}
              refreshTable={() => fetchScreenplayByReaderId()}
            />
          }
          onClose={handleCloseModal}
        />
        <Modal1
          showModal={showSPInfo}
          component={
            <SPInfo
              showReview={showReview}
              type={"infiction"}
              onClose={handleClose}
              refreshTable={() => fetchScreenplayByReaderId()}
            />
          }
          onClose={handleSPClose}
        />
      </div>
    </>
  );
}
