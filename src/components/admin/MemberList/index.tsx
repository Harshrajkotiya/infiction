import { UserContext } from "@/store/CognitoUser/CognitoUserContext";
import Link from "next/link";
import router from "next/router";
import React, { useContext, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

const pageButtonRenderer = ({ page, active, disable, title, onPageChange }) => {
  const handleClick = (e) => {
    e.preventDefault();
    onPageChange(page);
  };
  const activeStyle = {};

  return (
    <>
      <style jsx>{``}</style>
      <li className="">
        <button className="btn" onClick={handleClick}>
          {page}
        </button>
      </li>
    </>
  );
};

const selectRow = {
  mode: "checkbox",
  clickToSelect: true,
};

const addIdColumn = (array) => {
  let id = 1;

  // Iterate over each object
  for (let i = 0; i < array.length; i++) {
    // Add id property to the object
    array[i].id = id++;
  }

  return array;
};

export default function MemberList({ type }) {
  const { cognitoUsers, setCognitoUsers } = useContext(UserContext);
  const updatedArray = addIdColumn(cognitoUsers);
  const IndustryMembers = updatedArray.filter((item) => {
    return item.Attributes.some(
      (attribute) =>
        attribute.Name === "custom:role" && attribute.Value === type
    );
  });
  
  // console.log("IndustryMembers", IndustryMembers);
  
  const { SearchBar } = Search;

  const columns = [
    {
      dataField: "id",
      text: "id",
      hidden: true,
    },
    {
      dataField: "Username",
      text: "Email",
      formatter: (cell, row) => {
        const userEmail = row.Attributes.filter(
          (attribute) => attribute.Name === "email"
        )[0].Value;

        return <Link href={`/admin/user/${type}/${row.Username}`}>{userEmail}</Link>;
      },
    },
    {
      dataField: "UserCreateDate",
      text: "Created On",
    },
    {
      dataField: "UserStatus",
      text: "Status",
    },
  ];

  const options = {
    pageButtonRenderer,
    custom: true,
    totalSize: IndustryMembers?.length,
    sizePerPage: 10,
    hideSizePerPage: true,
    hidePageListOnlyOnePage: true,
    paginationTotalStandalone: false,
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
      <section className="row" id="content">
        {(type === "infiction_reader" || type === "industries_reader") && (
          <div className="text-end mb-2 p-0">
            <button
              className="btn btn-dark"
              onClick={() =>
                router.push(`/admin/user/${router.query["type"]}/createReader`)
              }
            >
              Create Reader
            </button>
          </div>
        )}
        <div className="col-12 ms-3 p-0 w-100">
          <PaginationProvider pagination={paginationFactory(options)}>
            {({ paginationProps, paginationTableProps }) => (
              <ToolkitProvider
                keyField="id"
                data={IndustryMembers}
                columns={columns}
                search
              >
                {(props) => (
                  <div>
                    {/* <SearchBar {...props.searchProps} /> */}
                    {/* <hr /> */}
                    <div>
                      <div className="d-flex justify-content-end">
                        <PaginationListStandalone {...paginationProps} />
                      </div>
                      <BootstrapTable
                        {...props.baseProps}
                        bootstrap4
                        responsive
                        wrapperClasses="table-responsive"
                        noDataIndication={() => (
                          <div className="text-center">No data available</div>
                        )}
                        selectRow={selectRow}
                        {...paginationTableProps}
                      />
                    </div>
                  </div>
                )}
              </ToolkitProvider>
            )}
          </PaginationProvider>
        </div>
      </section>
    </>
  );
}
