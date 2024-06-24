import Modal1 from "@/components/modal";
import SPInfo from "@/components/spInfo";
import { getUserBid } from "@/lib/Bid/getBid";
import { updateBid } from "@/lib/Bid/updateBid";
import FormatPrice from "@/utils/FormatPrice";
import Link from "next/link";
import React, { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
} from "react-bootstrap-table2-paginator";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BsCheckCircle, BsCheckCircleFill } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import filterFactory, { selectFilter } from "react-bootstrap-table2-filter";
import { createWishlist } from "@/lib/Wishlist/createWishlist";

function SPTable({ data }) {
  const [showSPInfo, setshowSPInfo] = useState(false);
  const [showReview, setShowReview] = useState();

  function handleSPOpen(row) {
    setShowReview(row);
    setshowSPInfo(true);
  }

  function handleSPClose() {
    setshowSPInfo(false);
  }

  const queryClient = useQueryClient();
  const UpdateMutation = useMutation((newData) => updateBid(newData), {
    onSuccess: async (data) => {
      queryClient.prefetchQuery(["ScreenplayBids"], () => getUserBid());
    },
  });
  
  const addWishlistMutation = useMutation(createWishlist);

  function updateBidStatus(row, status) {
    const bidData = {
      screenplay_id: row.id,
      bider_id: row.bider_id,
      status: status,
    };
    UpdateMutation.mutate(bidData);
    // addWishlistMutation.mutate({
    //   user_id: row.bider_id,
    //   screenplay_id: row.id,
    //   is_wished: row.is_wished,
    //   is_bought: !row.is_bought,
    // });
  }

  const statusOptions = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
  };

  const columns = [
    {
      dataField: "id",
      text: "Bid id",
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
                // console.log("row", row);
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
      dataField: "bider_id",
      text: "Bider Id",
      sort: true,
      editable: false,
      formatter: (cell, row) => (
        <>
          <span
            className=""
            style={{
              color: "black !important",
            }}
          >
            <Link href={`/admin/user/Indusrty Member/${row.bider_id}`}>
              {cell}
            </Link>
          </span>
        </>
      ),
    },
    {
      dataField: "user_id",
      text: "Owner Id",
      sort: true,
      editable: false,
      formatter: (cell, row) => (
        <>
          <span
            className=""
            style={{
              color: "black !important",
            }}
          >
            <Link href={`/admin/user/Screen Writer/${row.user_id}`}>
              {cell}
            </Link>
          </span>
        </>
      ),
    },
    {
      dataField: "bid_amount",
      text: "Bid Amount",
      sort: true,
      editable: false,
      style: {
        whiteSpace: "nowrap",
      },
      //   formatter: (cell, row) => (
      //     <>
      //       <span
      //         className="badge rounded-pill text-light px-3 py-2 rating_bg ms-2"
      //         style={{
      //           backgroundColor: "#424242",
      //           width: "140px",
      //           color: "white !important",
      //         }}
      //       >
      //         <img src="/table_star.svg" alt="table_star" /> {cell}
      //       </span>
      //     </>
      //   ),
    },
    {
      dataField: "reserved_price",
      text: "Reserved Price(₹)",
      sort: true,
      editable: true,
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
      dataField: "status",
      text: "status",
      sort: true,
      editable: true,
      formatter: (cell, row) => (
        <>
          {/* <img src="/table_eyes.svg" alt="table_eyes" /> */}
          <div className="bid_status">
            <ButtonGroup aria-label="Bid Status" style={{}}>
              {cell === "pending" ? (
                <>
                  <Button
                    variant="light"
                    style={{ color: "green" }}
                    onClick={() => updateBidStatus(row, "approved")}
                  >
                    <BsCheckCircle />
                  </Button>
                  <Button
                    variant="light"
                    style={{ color: "red" }}
                    onClick={() => updateBidStatus(row, "rejected")}
                  >
                    <ImCancelCircle />
                  </Button>
                </>
              ) : cell === "approved" ? (
                <Button variant="light" style={{ color: "green" }}>
                  <BsCheckCircleFill />
                </Button>
              ) : (
                <Button variant="light" style={{ color: "red" }}>
                  <MdCancel />
                </Button>
              )}
            </ButtonGroup>
          </div>
        </>
      ),
      filter: selectFilter({
        options: statusOptions,
        defaultValue: "pending",
      }),
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
              //   headerClasses={styles.user_header}
              filter={filterFactory()}
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

export default function BidsData() {
  const {
    isLoading: bidLoading,
    isError,
    data: biddedUsers,
    error,
  } = useQuery(["ScreenplayBids"], () => getUserBid());

  return (
    <>
      <SPTable data={biddedUsers?.rows} />
    </>
  );
}
