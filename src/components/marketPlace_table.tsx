import { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
} from "react-bootstrap-table2-paginator";
import {
  FaCaretDown,
  FaCaretUp,
  FaColumns,
  FaFilter,
  FaRegStar,
  FaStar,
} from "react-icons/fa";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { Dropdown, Modal } from "react-bootstrap";
import ToolkitProvider, { ColumnToggle } from "react-bootstrap-table2-toolkit";
import filterFactory from "react-bootstrap-table2-filter";
import SelectInputs from "../components/selectInputs";
import { Auth } from "aws-amplify";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import {
  getTopRatedScreenplay,
  getUserScreenplays,
} from "@/lib/Screenplay/Sphelpers";
import { useMutation, useQuery, useQueryClient } from "react-query";
import FormatPrice from "@/utils/FormatPrice";
import { createWishlist } from "@/lib/Wishlist/createWishlist";
import Modal1 from "./modal";
import SPInfo from "./spInfo";
import { updateWishlist } from "@/lib/Wishlist/updateWishlist";
import { handleupdateScreenplay } from "@/lib/Screenplay/updateScreenplay";
import { useRouter } from "next/router";
import BuyScreen from "../components/buy_screen";
import { AssignReaders } from "@/utils/assignReaders";
import { uploadScreenplay } from "@/lib/Screenplay/uploadScreenplay";
import { getTransactionDetails } from "@/lib/Transaction/getTransaction";
import MemberData from "./admin/MemberData";
import { createAccessed } from "@/lib/AccessedScreenplay/createAccessedSP";
import { getAccessedSP } from "@/lib/AccessedScreenplay/getAccessedSP";
import { getBidbyScreenplayID } from "@/lib/Bid/getBid";
import { getUserHold } from "@/lib/hold/getHold";
import HoldsData from "./admin/HoldsData";
import { deleteHold } from "@/lib/hold/deleteHold";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

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

export default function Marketplace_table(props) {
  //console.log("props..........", props);
  // const [userProduct, setUserProduct] = useState(JSON.stringify(props.productData));
  const [userData, setUserScreenplay] = useState([]);
  const [filteredData, setFilteredData] = useState(userData);
  const [openfilter, setOpenFilter] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState(false);
  const [selectedTags, setSelectedTags] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [selectedColumns, setselectedColumns] = useState([]);
  const [showSPInfo, setshowSPInfo] = useState(false);
  const [showReview, setShowReview] = useState();
  const [showBuyPay, setBuyPay] = useState(false);
  const [activeTab, setActiveTab] = useState("buy");
  const [isWished, setIsWished] = useState("false");
  const [userMessage, setUserMessage] = useState(null);
  const [msgSeverity, setMsgSeverity] = useState("success");

  const [curUser, setCurUser] = useState({
    id: null,
    user_id: "",
    title: "",
    genre: "",
    tags: "",
    logline: "",
    synposis: "",
    // profile_url: "",
    screenplay_url: "",
    ihf: "No",
    is_wished: false,
    is_bought: false,
    // profile_prefix: "",
    screenplay_prefix: "",
  });
  const [walletData, setWalletData] = useState({});
  const [updatedColumns, setColumns] = useState(null);

  const AddMutation = useMutation(createWishlist, {
    onSuccess: async (data) => {
      queryClient.prefetchQuery(["TopScreenplay", props.user_id], () =>
        getTopRatedScreenplay(props.user_id)
      );
    },
  });

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

  const columns = [
    {
      dataField: "id",
      text: "Screen play id",
      hidden: true,
    },
    {
      dataField: "is_wished",
      text: <FaStar color="#F3AE09" />,
      formatter: (cell, row) => (
        <>
          <div style={{ cursor: "pointer" }}>
            {cell ? <FaStar color="#F3AE09" /> : <FaRegStar />}
          </div>
        </>
      ),
      events: {
        onClick: async (e, column, columnIndex, row, rowIndex) => {
          const updateData = Object.assign(
            {},
            {
              user_id: props.user_id,
              screenplay_id: row.id,
              is_wished: !row.is_wished,
            }
          );
          await AddMutation.mutate(updateData);
          if(!row.is_wished === true){
            setMsgSeverity("success")
            setUserMessage(`Added ${row.title} to Wishlist`)
          }else{
            setMsgSeverity("info")
            setUserMessage(`Removed ${row.title} from Wishlist`)
          }
          row.is_wished = !row.is_wished;
        },
      },

    },
    {
      dataField: "title",
      text: "Screenplay",
      sort: true,
      sortCaret: customSortCaret,
      editable: false,
      formatter: (cell, row, rowIndex) => (
        <>
          <div style={{ textAlign: "left" }} className="text-nowrap">
            <div>
              <img
                src="../sp_icon.png"
                alt="pencil"
                style={{ cursor: "pointer" }}
              />
              <span className="ms-2">{cell}</span>
            </div>
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
                    variant="outline-warning genre_style"
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
      formatter: (cell) =>
        cell ? <FormatPrice price={cell} /> : "Enter Price",
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
              background: none;
            }
            .btn:hover {
              background: black;
              color: #ffc107 !important;
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
      text: "Bid/ Buy/ Hold",
      sort: false,
      sortCaret: customSortCaret,
      editable: false,
      formatter: (cell, row) => (
        <>
          <div className="marketplace_bid">
            <ButtonGroup aria-label="Basic example">
              <Button
                style={{ borderLeft: "none" }}
                onClick={() => setActiveTab("bid")}
              >
                Bid
              </Button>
              <Button
                onClick={() => {
                  OpenBuypayment(), setActiveTab("buy");
                }}
              >
                Buy
              </Button>
              <Button onClick={() => setActiveTab("hold")}>Hold</Button>
            </ButtonGroup>
          </div>
        </>
      ),
      events: {
        onClick: async (e, column, columnIndex, row, rowIndex) => {
          // console.log("row", row);

          setCurUser(row);
          typeof window !== "undefined" &&
            localStorage.setItem(
              "curSPData",
              JSON.stringify({
                user_id: props.user_id,
                screenplay_id: row.id,
                is_wished: row.is_wished,
                is_bought: !row.is_bought,
              })
            );
          typeof window !== "undefined" &&
            localStorage.setItem("ownerId", row.user_id);
          OpenBuypayment();
        },
      },
    },
  ];

  const handleColumnToggle = (dataField) => {
    const tempColumns = updatedColumns ? updatedColumns : columns

    const newColumns = tempColumns.map((column) => {
      if (column.dataField === dataField) {
        return {
          ...column,
          hidden: !column.hidden,
        };
      }
      return column;
    });
    setColumns(newColumns);
  };

  const router = useRouter();

  const queryClient = useQueryClient();
  const addSpMutation = useMutation(uploadScreenplay, {
    onSuccess: (data) => {
      queryClient.prefetchQuery(["UserscreenplayData", props.user_id], () =>
        getUserScreenplays(props.user_id)
      );
    },
  });


  const AddAccessedSPMutation = useMutation(createAccessed, {
    onSuccess: async (data) => {
      await queryClient.prefetchQuery(["AccesedCount", props.user_id], () =>
        getAccessedSP(props.user_id)
      );
    },
  });

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

  // get data of screenplay
  const { isLoading, isError, data, error } = useQuery(["TopScreenplay"], () =>
    getTopRatedScreenplay(props.user_id)
  );

  const {
    isLoading: holdLoading,
    isError: holdIsError,
    data: HoldUsers,
    error: holdError,
  } = useQuery(["AllHolds"], () => getUserHold());

  function handleSPOpen(row) {
    setShowReview(row);
    setshowSPInfo(true);
  }

  function handleSPClose() {
    setshowSPInfo(false);
  }

  function openColumns() {
    if (showColumns) {
      setShowColumns(false);
    } else {
      setShowColumns(true);
    }
  }

  function CloseFilter() {
    setOpenFilter(false);
  }
  function OpenBuypayment() {
    setBuyPay(true);
  }
  function CloseBuypayment() {
    setBuyPay(false);
  }

  useEffect(() => {
    const holdedSP = HoldUsers?.rows
      .filter((obj) => obj.status === "onhold")
      ?.filter((item) => item.holder_id != props.user_id)
      .map((item) => item.screenplay_id);
    const filteredData = data?.rows?.filter((obj) =>
      holdedSP
        ? obj.is_bought === false && !holdedSP.includes(obj.id)
        : obj.is_bought === false
    );
    // console.log("data........", data?.rows);

    setUserScreenplay(filteredData);
    setFilteredData(filteredData);
  }, [HoldUsers, data]);

  useEffect(() => {
    async function fetchWalletData() {
      try {
        const data = await getTransactionDetails(props.user_id);
        setWalletData(data?.data.rows[0]);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    }

    fetchWalletData();
  }, []);

  if (isLoading)
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  if (isError) return <div>Got Error {error}</div>;

  async function saveMemberData() {
    const { user_id, id, is_wished, is_bought } = curUser;
    typeof window !== "undefined" &&
      localStorage.setItem(
        "SPFormData",
        JSON.stringify({
          user_id: props.user_id,
          screenplay_id: id,
          is_wished: is_wished,
          is_bought: !is_bought,
        })
      );
    AddMutation.mutate({
      user_id: props.user_id,
      screenplay_id: id,
      is_wished: is_wished,
      is_bought: !is_bought,
    });
    const updateListed = Object.assign(
      {},
      { id: parseInt(id), is_listed: false }
    );
    UpdateMutation.mutate(updateListed);

    const deleteBought = Object.assign(
      {},
      { screenplay_id: parseInt(id), user_id: props.user_id }
    );
    deleteHold(deleteBought);
    // deleteHold()
  }

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
            .filterModal .modal-dialog .modal-content {
              background-color: black;
              border: none;
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

  const CustomToggleList = ({ columns, onColumnToggle, toggles }) => {
    columns.map((column) => {
      const toggleKeys = Object.keys(toggles);
      const matchingToggleKey = toggleKeys.find(
        (key) => key === column.dataField
      );
      if (toggles?.[matchingToggleKey] === true) {
        column.hidden = false;
      }
    });

    return (
      <div
        className="btn-group btn-group-toggle btn-group-vertical "
        data-toggle="buttons"
        style={{ width: "max-content", minWidth: "150px" }}
      >
        {columns
          .map((column) => ({
            ...column,
            toggle: toggles[column.dataField],
          }))
          .map((column) => (
            <div key={column.dataField} className="filtercheckboxhover">
              <input
                type="checkbox"
                checked={column.toggle}
                onChange={() => {
                  handleColumnToggle(column.dataField);
                  // onColumnToggle(column.dataField);
                }}
              />
              <label>{column.text}</label>
            </div>
          ))}
      </div>
    );
  };

  return (
    <>
      <style jsx>
        {`
          button.btn.screen_button_style2 {
            border-color: white;
            color: white;
            background-color: transparent;
          }
          button.btn.screen_button_style2:hover {
            border-color: #f3ae09;
            color: #f3ae09;
          }
        `}
      </style>
      {userMessage && (
        <Snackbar
          open={userMessage != null}
          autoHideDuration={5000}
          onClose={() => setUserMessage(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={() => setUserMessage(null)} severity={msgSeverity}>
            {userMessage}
          </Alert>
        </Snackbar>
      )}
      {props.productData?.issubscribed === true ? (
        <div>
          <div className="d-flex justify-content-end">
            <Dropdown className="user_dropDown d-flex ">
              <Dropdown.Toggle id="user-profile-dropdown">
                <div className="d-flex gap-3">
                  <button
                    onClick={() => setOpenFilter(true)}
                    className="btn screen_button_style2"
                    type="button"
                  >
                    <FaFilter /> Filter
                  </button>
                </div>
              </Dropdown.Toggle>
            </Dropdown>
            <button
              onClick={openColumns}
              className="btn screen_button_style2"
              type="button"
              style={{ height: "fit-content", marginTop: "0.4rem" }}
            >
              <FaColumns /> Choice
            </button>
          </div>

          <PaginationProvider pagination={paginationFactory(options)}>
            {({ paginationProps, paginationTableProps }) => (
              <ToolkitProvider
                keyField="id"
                data={userData}
                columns={updatedColumns ? updatedColumns : columns}
                columnToggle
              // onColumnToggle={ handleColumnToggle }
              >
                {(props) => (
                  <>
                    <div className="filtercheckbox">
                      <div
                        className="d-flex justify-content-end"
                        style={{
                          position: "absolute",
                          left: "0",
                          right: "1%",
                          zIndex: "9999",
                        }}
                      >
                        {showColumns && showColumns ? (
                          <CustomToggleList
                            {...props.columnToggleProps}
                            onColumnToggle={handleColumnToggle}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div
                      className="container-fluid p-0 dash_table w-100"
                      style={{ width: "100%" }}
                    >
                      <BootstrapTable
                        {...props.baseProps}
                        bootstrap4
                        responsive
                        bordered={false}
                        wrapperClasses="table-responsive"
                        data={Array.isArray(filteredData) ? filteredData : []}
                        filter={filterFactory()}
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
                  </>
                )}
              </ToolkitProvider>
            )}
          </PaginationProvider>
          <Modal
            centered
            className={`filterModal modal-xl`}
            show={openfilter}
            onHide={CloseFilter}
            style={{ backgroundColor: "transparent" }}
          >
            <SelectInputs
              userData={userData}
              setFilteredData={setFilteredData}
              onClose={CloseFilter}
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </Modal>
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
          <Modal1
            showModal={showBuyPay}
            component={
              <BuyScreen
                onClose={CloseBuypayment}
                amount={curUser?.reserved_price}
                balance={walletData?.balance}
                title={"Buy Screenplay"}
                sucsessMethod={saveMemberData}
                sp_id={curUser?.id}
                user_id={props.user_id}
                reserved_price={curUser.reserved_price}
                activeTab={activeTab}
              />
            }
            onClose={CloseBuypayment}
          />
        </div>
      ) : (
        <button
          className="btn text-black"
          style={{ backgroundColor: "#f3ae09" }}
          onClick={() => router.push("/plan_price")}
        >
          Subscribe Now
        </button>
      )}
    </>
  );
}