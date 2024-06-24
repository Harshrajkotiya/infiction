import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import cellEditFactory from "react-bootstrap-table2-editor";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
} from "react-bootstrap-table2-paginator";
import { FaCaretDown, FaCaretUp, FaStar, FaTrashAlt } from "react-icons/fa";
// import spUpload from "@/components/spUpload";
import { AssignIndustriesReaders } from "@/utils/assignIndustriesReader";
import { deleteScreenplay } from "@/lib/Screenplay/deleteScreenplay";
import Modal1 from "./modal";
import ProcessFlow from "./processFlow";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getTopRatedScreenplay } from "@/lib/Screenplay/Sphelpers";
import { Button } from "react-bootstrap";
import FormatPrice from "@/utils/FormatPrice";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { getAccessedSP } from "@/lib/AccessedScreenplay/getAccessedSP";
import { createAccessed } from "@/lib/AccessedScreenplay/createAccessedSP";
import { handleupdateScreenplay } from "@/lib/Screenplay/updateScreenplay";
import SPInfo from "./spInfo";

export default function Table(props) {
  const [userData, setUserScreenplay] = useState([]);
  const [user, setuser] = useState(null);
  const [curUserSP, setUserSP] = useState(null);
  const [showEditfile, setShowEditfile] = useState(false);
  const [userMessage, setUserMessage] = useState(null);
  const [msgSeverity, setMsgSeverity] = useState("success");
  const [showSPInfo, setshowSPInfo] = useState(false);
  const [showReview, setShowReview] = useState();

  const EditUpload = ProcessFlow;

  // get data of screenplay
  const { isLoading, isError, data, error } = useQuery(["TopScreenplay", props.user_id], () =>
    getTopRatedScreenplay(props.user_id)
  );

  const queryClient = useQueryClient();
  const UpdateMutation = useMutation(
    (newData) => handleupdateScreenplay(newData.id, newData),
    {
      onSuccess: async (data) => {
        await queryClient.prefetchQuery(["TopScreenplay", props.user_id], () =>
          getTopRatedScreenplay(props.user_id)
        );
      },
    }
  );

  const AddAccessedSPMutation = useMutation(createAccessed, {
    onSuccess: async (data) => {
      await queryClient.prefetchQuery(["AccesedCount", props.user_id], () =>
        getAccessedSP(props.user_id)
      );
    },
  });

  useEffect(() => {
    const filteredData = data?.rows?.filter((obj) => obj.is_wished);
    setUserScreenplay(filteredData);
  }, [data]);

  function handleClose() {
    setShowEditfile(false);
    // fetchData(user?.attributes?.sub);
  }

  function handleSPOpen(row) {
    setShowReview(row);
    setshowSPInfo(true);
  }

  function handleSPClose() {
    setshowSPInfo(false);
  }

  async function setAccessedSp(row, rowIndex) {
    // const props.productData.screenplay = JSON.parse(userProduct)?.screenplay;
    const updatedData = [...userData];
    const updateData = Object.assign(
      {},
      {
        id: parseInt(updatedData[rowIndex]?.id),
        industry_views: (row.industry_views += 1),
      }
    );

    const accessedSPCount = await getAccessedSP(props.user_id);
    // console.log("asdfkhfkhskfhdf", JSON.parse(userProduct))

    const isAlreadyView = accessedSPCount?.data.find(
      (sp) => sp.screenplay_id === row.id
    );

    if (
      accessedSPCount?.data.length < props.productData.screenplay ||
      (accessedSPCount?.data.length >= props.productData.screenplay &&
        isAlreadyView)
    ) {
      try {
        handleSPOpen(row);
        await AddAccessedSPMutation.mutate({
          screenplay_id: row.id,
          user_id: props.user_id,
        });
        await UpdateMutation.mutate(updateData);
      } catch (error) {
        console.log("error", error);

        setMsgSeverity("error");
        setUserMessage({ error })
      }

    } else {

      setMsgSeverity("warning");
      setUserMessage(`You have reached the maximum limit of ${props.productData.screenplay} screenplays for this month. 
      Please enjoy the screenplays you have already accessed, and
      check back next month for more.`)
    }
  }

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
              onClick={() => {
                setShowEditfile(true);
                setUserSP(row.id);
              }}
              src="../sp_icon.png"
              alt="pencil"
              style={{ cursor: "pointer" }}
            />
            <span className="ms-2">{cell}</span>
          </div>
        </>
      ),
      events: {
        onClick: async (e, column, columnIndex, row, rowIndex) => {
          setAccessedSp(row, rowIndex);
        },
      },
    },
    {
      dataField: "genre",
      text: "Genre",
      sort: true,
      sortCaret: customSortCaret,
      editable: false,
      formatter: (cell) => {
        const options = cell.split(",").slice(0, 2);
        const TagButtonStyle = {
          borderRadius: '40px',
          textTransform: 'uppercase',
          fontSize: '12px',
        };
        return (
          <>

            <div>
              {options.map((option) => (
                <span key={option}>
                  <Button variant="outline-warning genre_style" style={TagButtonStyle} size="sm">{option}</Button>{' '}
                </span>
              ))}
            </div>
          </>
        );
      },
    },
    {
      dataField: "infiction_rating",
      text: <span>InFiction Rating(5)</span>,
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
      style: {
        whiteSpace: "nowrap",
      },
      formatter: (cell, row) => (
        <>
          <span
            className="badge rounded-pill text-light px-3 py-2 rating_bg ms-2"
            style={{ backgroundColor: "#424242", cursor: "pointer" }}
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
      formatter: (cell, row) => (cell ? <FormatPrice price={cell} /> : "-"),
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
    totalSize: userData?.length,
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

      {userMessage && (
        <Snackbar
          open={userMessage != null}
          autoHideDuration={6000}
          onClose={() => setUserMessage(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={() => setUserMessage(null)} severity={msgSeverity}>
            {userMessage}
          </Alert>
        </Snackbar>
      )}
      <div className="container-fluid p-0 dash_table w-100">
        <PaginationProvider pagination={paginationFactory(options)}>
          {({ paginationProps, paginationTableProps }) => (
            <div>
              <BootstrapTable
                bootstrap4
                responsive
                keyField="id"
                wrapperClasses="table-responsive"
                data={Array.isArray(userData) ? userData : []}
                columns={columns}
                bordered={false}
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
          showAbout={showEditfile}
          SPid={curUserSP}
          component={EditUpload}
          onClose={handleClose}
          steplen={1}
        />
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
      </div>
    </>
  );
}
