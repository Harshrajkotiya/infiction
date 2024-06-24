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
import { FaCaretDown, FaCaretUp, FaTrashAlt } from "react-icons/fa";
// import spUpload from "@/components/spUpload";
import BuyScreen from "@/components/buy_screen";
import PricingToggle from "@/components/switchToggle";
import { deleteScreenplay } from "@/lib/Screenplay/deleteScreenplay";
import { handleupdateScreenplay } from "@/lib/Screenplay/updateScreenplay";
import { createTransaction } from "@/lib/Transaction/createTransaction";
import { getTransactionDetails } from "@/lib/Transaction/getTransaction";
import { processGetuser } from "@/lib/users";
import FormatPrice from "@/utils/FormatPrice";
import { AssignIndustriesReaders } from "@/utils/assignIndustriesReader";
import { processPayment } from "@/utils/payment";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Modal1 from "../components/modal";
import { getUserScreenplays } from "../lib/Screenplay/Sphelpers";
import FeedbackPopup from "./FeedbackPopup";
import BookModal from "./bookModel";
import { GetUserImg } from "./get_profile_img";
import PDFViewer from "./pdfViewer";
import ProcessFlow from "./processFlow";
import { Badge } from "react-bootstrap";

export default function Table(props) {
  const [user, setuser] = useState(null);
  const [curUserSP, setUserSP] = useState(null);
  const [showEditfile, setShowEditfile] = useState(false);
  const [showApplyIndustrialRating, setShowApplyIndustrialRating] = useState(false);
  const [SPurl, setSPurl] = useState("");
  const [SPname, setSPname] = useState("");
  const [isClickOnName, setisClickOnName] = useState(false);
  const [OpenPDF, setOpenPDF] = useState(false);
  const [sp_id_apply_industries_rating, setSp_id_apply_industries_rating] = useState();
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState(null);

  const createCheckOutSession = async (sp_id) => {
    setLoading(true);
    const amount = 5000;
    const paymentFor = "Test";
    processPayment(sp_id, user?.attributes?.sub, amount, paymentFor); //sending temporary SPId
    setLoading(false);
  };

  // get data of screenplay
  const { isLoading, isError, data, error } = useQuery(
    ["UserscreenplayData", user?.attributes?.sub],
    () => getUserScreenplays(user?.attributes?.sub)
  );

  const queryClient = useQueryClient();

  const UpdateMutation = useMutation(
    (newData) => handleupdateScreenplay(props.id, newData, props.onCancel),
    {
      onSuccess: async (data) => {
        // queryClient.setQueryData(
        //   ["UserscreenplayData", user?.attributes?.sub],
        //   data
        // );
        queryClient.prefetchQuery(
          ["UserscreenplayData", user?.attributes?.sub],
          () => getUserScreenplays(user?.attributes?.sub)
        );
      },
    }
  );

  const DeleteMutation = useMutation(
    (id) => deleteScreenplay(id),
    {
      onSuccess: async (data) => {
        queryClient.prefetchQuery(
          ["UserscreenplayData", user?.attributes?.sub],
          () => getUserScreenplays(user?.attributes?.sub)
        );
      },
    }
  );



  //payment for apply for industries ratings start ---------
  //pay through payment getaway transaction
  function handleDirectPayForIndRating() {
    const apply_ind_amt = 5000;
    const paymentFor = "Apply For industries Rating"
    processPayment(props.sp_id, props.user_id, apply_ind_amt, paymentFor); //sending temporary SPId
    // console.log("sp_id and user id:", props.sp_id, " - ", user?.attributes?.sub);
  }

  //pay through wallet transaction
  async function handlePayWithWallet() {

    const stripeUser = await processGetuser(user?.attributes?.sub);
    const dataGet = stripeUser.rows[0];
    // console.log("Stripe Id: ", stripeUser.rows[0]);

    if (walletData > 5000) {
      const userData = { userid: dataGet.user_id, stripeid: dataGet.stripeid, trx_type: "retrieve", trx_amount: parseInt("-5000"), status: "complete" }
      const isSuccess = createTransaction(userData);
      // console.log("Response payment: ", isSuccess);

    } else {
      alert("You have not enough Wallet Balance");
    }
  }
  //payment for apply for industries ratings end ----------


  // useEffect hook is used to fetch data on component mount
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setuser(user);
      })
      .catch((error) => console.log("Unable to get Logged in user", error));
  }, []);

  useEffect(() => {
    async function fetchWalletData() {
      try {
        const data = await getTransactionDetails(user.attributes?.sub);
        // console.log("data?.data.rows[0]",data?.data.rows[0]);

        setWalletData(data?.data.rows[0]);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    }

    fetchWalletData();
  }, [user]);

  if (isLoading) return <div className="d-flex justify-content-center"><div className="spinner-border text-warning" role="status">
  </div>
  </div>;
  if (isError) return <div>Got Error {error}</div>;

  props.setUserScreenplay(data);

  function handlePDFClose() {
    setOpenPDF(false);
  }

  function handleClose() {
    setShowEditfile(false);
  }

  function handleCloseIndustriesRating() {
    setShowApplyIndustrialRating(false);
  }

  function handleSubmitToDB() {
    const industryReaders = AssignIndustriesReaders(
      curUserSP.id
    );
    const d = industryReaders
      .then((res) => {
        // console.log("res------------------", res.data.rowCount);
        if (res.data.rowCount == 1) {
          handleCloseIndustriesRating();
        } else {
        }
      })
      .catch((err) => console.log(err));
    // console.log(
    // "return from Assign Industries Readers s-----:",
    // industryReaders
    // );
    // console.log("SP_id:--------------", sp_id_apply_industries_rating);
  }

  async function handleApplyForIndustriesRating(apply: string, sp_id: any) {
    if (apply === "Apply") {
      setShowApplyIndustrialRating(true);
    }
  }

  const customSortCaret = (order, column) => {
    if (!order)
      return (
        <span>
          <FaCaretUp
            className="fa-thin fa-caret-up fa-sm"
            style={{ color: "#f3ae09", opacity: "0.7" }}
          />
          <FaCaretDown
            className="fa-thin fa-caret-down fa-sm"
            style={{ color: "#f3ae09", opacity: "0.7" }}
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

  function handleDelete(id) {
    deleteScreenplay(id)

      .then((data) => {
        const filteredData = props.userData.filter((item) => item?.id !== id);
        props.setUserScreenplay(filteredData);
      })
      .catch((error) =>
        console.log("unable to set updated screenplay data", error)
      );
  }

  const handleUpdate = async (id, reserved_price) => {
    const updateData = Object.assign(
      {},
      {
        id: parseInt(id),
        reserved_price: reserved_price,
      }
    );
    await UpdateMutation.mutate(updateData);
  };

  function openPDF(row) {
    // console.log("row", row);

    setSPname(row?.screenplay_url);
    setOpenPDF(true);
    GetUserImg(row?.screenplay_url)
      .then((screenplay_url) => {
        setSPurl(screenplay_url);
      })
      .catch((err) => console.log(err));
    setisClickOnName(true);
  }

  const columns = [
    {
      dataField: "id",
      text: "Screen play id",
      hidden: true,
    },
    {
      // have to add for mobile responsive
      // display: flex;
      // font-size: 14px;
      // flex-direction: row;
      // align-items: center;

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
            <span
              className="ms-2"
              onClick={() => {
                openPDF(row);
              }}
              style={{ cursor: "pointer" }}
            >
              {cell} {row.is_bought === true ?  <Badge bg="success">Bought</Badge> : row.is_holded === true && <Badge bg="danger">onHold</Badge>}
            </span>
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
      sortCaret: customSortCaret,
      editable: false,
      style: {
        whiteSpace: "nowrap",
      },
      formatter: (cell, row) => (
        <>
          <span
            onClick={() => {
              handleApplyForIndustriesRating(cell, row.id);
              setUserSP(row);
              typeof window !== "undefined" &&
                localStorage.setItem(
                  "curSPData",
                  JSON.stringify({
                    user_id: props.user_id,
                    screenplay_id: row.id,
                  })
                );
            }}
          >
            <FeedbackPopup
              type={"industry"}
              screenplay_id={row?.id}
              rating={row.industry_rating}
              feedback={row.industry_feedback}
            />
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
      formatter: (cell) => (cell ? <FormatPrice price={cell} /> : <p className="text-muted">Enter Price</p>),
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
              background:black;
            }
            .btn:hover{
              background:black;
              color:#ffc107 !important;
              cursor: default;
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
      dataField: "list/delist",
      text: "List/Delist",
      // hidden: true,
      editable: false,

      formatter: (cell, row, rowIndex) => {
        const filteredData = props.userData.filter(
          (item) => item.id === row.id
        );
        const industryRating = filteredData[0]?.industry_rating;
        const isRated = /^[^a-zA-Z]*$/.test(industryRating);

        async function toggleIsListed() {
          const updateListed = Object.assign({}, { id: parseInt(row.id), is_listed: !row.is_listed })
          await UpdateMutation.mutate(updateListed)
        }
        return <PricingToggle toggleKey={rowIndex} israted={isRated} isListed={row.is_listed} toggleIsListed={toggleIsListed} row={row} />;
      },
    },
    {
      dataField: "action",
      text: "Action",
      editable: false,
      formatter: (cell, row) => (
        <>
          <button className="btn" onClick={() => DeleteMutation.mutate(row.id)}>
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
    totalSize: props.userData?.length,
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
      {/* {props.productData.isSubscribed === true ? ( */}
      <div className="container-fluid p-0 dash_table w-100">
        <PaginationProvider pagination={paginationFactory(options)}>
          {({ paginationProps, paginationTableProps }) => (
            <div>
              <BootstrapTable
                bootstrap4
                responsive
                keyField="id"
                data={Array.isArray(props.userData) ? props.userData : []}
                columns={columns}
                bordered={false}
                // tableLayout="fixed"
                wrapperClasses="table-responsive"
                // filter={ filterFactory() }
                noDataIndication={() => (
                  <div className="text-center">No data available</div>
                )}
                cellEdit={cellEditFactory({
                  mode: "click",
                  afterSaveCell: (oldValue, newValue, row, column) => {
                    handleUpdate(row.id, newValue);
                  },
                })}
                {...paginationTableProps}
              />

              <div className="d-flex justify-content-between">
                <PaginationTotalStandalone {...paginationProps} />
                {/* {paginationProps.page?.map((page, index) => (
                  <PaginationListStandalone
                    key={index}
                    page={page}
                    {...paginationProps}
                  />
                ))} */}
                <PaginationListStandalone {...paginationProps} />
              </div>
            </div>
          )}
        </PaginationProvider>

        <BookModal
          showModal={showEditfile}
          component={
            <ProcessFlow
              id={curUserSP}
              onClose={handleClose}
              steplen={1}
              user_id={user?.attributes?.sub}
            />
          }
          onClose={handleClose}
        />

        {/*apply industries rating */}

        <Modal1
          showModal={showApplyIndustrialRating}
          component={
            <BuyScreen
              onClose={handleCloseIndustriesRating}
              amount={5000}
              balance={walletData?.balance}
              title={"Apply Industries Rating"}
              sucsessMethod={handleSubmitToDB}
              sp_id={curUserSP?.id}
              user_id={user?.attributes?.sub}
            />
          }
          onClose={handleClose}
        />

        {isClickOnName && (
          <PDFViewer
            SP={SPurl}
            name={SPname}
            isTitle={true}
            OpenPDF={OpenPDF}
            PDFClose={handlePDFClose}
          />
        )}
      </div>
      {/* ) : (<div></div>)} */}
    </>
  );
}
