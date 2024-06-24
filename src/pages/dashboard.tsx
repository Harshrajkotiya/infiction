import ReaderJobs from "@/components/ReaderDashboard";
import Table from "@/components/table";
import styles from "@/styles/dashboard.module.css";
import { Auth, withSSRContext } from "aws-amplify";
import { useEffect, useState } from "react";
import { Dropdown, Tab, Tabs } from "react-bootstrap";
import { FaPhone } from "react-icons/fa";
import { IoIosNotificationsOutline, IoMdNotificationsOutline } from "react-icons/io";
import { GetUserImg } from "../components/get_profile_img";
import Logout from "../components/logout";
import Marketplace_table from "../components/marketPlace_table";
import Modal1 from "../components/modal";
import ProcessFlow from "../components/processFlow";
import Profile_Update from "../components/profile_update";
import ViewPlan from "../components/viewplan";
import Wallet from "../components/wallet";
import Wishlist_Table from "../components/wishlist_table";
import MemberScreenplay from "@/components/memberScreenplay";
import { processGetuser } from "@/lib/users";
import Head from "next/dist/shared/lib/head";
import router from "next/router";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { AuthenticateUser } from "@/utils/protecteRoutes";

export default function Dashboard({ products }) {
  const [key, setKey] = useState("my_screenplays");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState({
    id: "",
    name: "",
    screenplay: 0,
    issubscribed: false
  });
  const [userImg, setUserImg] = useState("");
  const [showWallet, setWallet] = useState(false);
  // const [userSP, setUserScreenplay] = useState(null);
  const [showEditfile, setShowEditfile] = useState(false);
  const [openProfileEdit, setOpenProfileEdit] = useState(false);
  const [userData, setUserScreenplay] = useState([]);
  const [showViewPlan, setViewPlan] = useState(false);
  const [walletData, setWalletData] = useState();

  // const router = useRouter();
  function handleClose() {
    setShowEditfile(false);
  }

  function walletOpen() {
    setWallet(true);
  }

  function walletClose() {
    setWallet(false);
  }

  function showprofile() {
    setOpenProfileEdit(true);
  }
  function closeprofile() {
    setOpenProfileEdit(false);
  }
  function ViewPlanOpen() {
    setViewPlan(true);
  }
  function ViewPlanClose() {
    setViewPlan(false);
  }

  async function getUserData() {
    const user = await AuthenticateUser();
    setIsLoggedIn(true);
    setUser(user);

    GetUserImg(`profile_${user?.attributes?.picture}`)
      .then((user_img) => {
        setUserImg(user_img);
      })
      .catch((err) => console.log(err));
  }



  const fetchStripeUSer = async () => {

    const stripeUser = await processGetuser(user?.attributes?.sub);
    // if (products){}
    const stripeProduct = products.filter((product) => product.id === stripeUser?.rows[0]?.productid)[0];
    // console.log("stripeProduct", stripeProduct, stripeUser?.rows[0]);
    // const 
    setProduct({ ...stripeUser?.rows[0], ...stripeProduct });
    // setProduct({id: stripeProduct?.id, name: stripeProduct.name, screenplay: stripeProduct.screenplay, issubscribed:stripeUser?.rows[0]?.issubscribed})
  };

  useEffect(() => {
    getUserData();

  }, []);

  useEffect(() => {
    if (user) {
      fetchStripeUSer();
    }
  }, [user]);



  return (
    <>
      <style jsx>
        {`
          * {
            font-family: "courier";
          }
          button.btn.screen_button_style {
            background: #1f1f1f;
            border: none;
            border-radius: 0;
            height: 3.5rem;
            color: #f3ae09;
            border-bottom: 1px solid white;

            @media only screen and (max-width: 426px) {
              border-bottom: 2px solid white;
            }
          }
          button.btn.screen_button_style2 {
            border-color: white;
            color: white;
          }
          button.btn.screen_button_style2:hover {
            border-color: #f3ae09;
            color: #f3ae09;
          }
        `}
      </style>
      {(isLoggedIn === true) && (
        <div className={`container-fluid pt-0 ${styles.container_bg_color}`}>
          <Head>
            <title>Dashboard</title>
            <link rel="shortcut icon" href="/static/favicon.ico" />
          </Head>
          <div className={`pt-5 ${styles.container_bg_img}`}>
            <nav className={`navbar navbar-light ${styles.navbar_res}`}>
              <div className={`container-fluid mt-2${styles.dashboard_res}`}>
                <a
                  className={`navbar-brand text-light fs-1 ${styles.dash_heding}`}
                >
                  <img src="../feather_logo.svg" alt="feather_logo" />
                  <b> My Dashboard </b>
                </a>
                <div className={`d-flex gap-3  ${styles.drop_res}`}>
                  <Dropdown className={`user_dropDown ${styles.user_dropDown}`}>
                    
                    <Dropdown.Toggle
                      className={`${styles.user_dropDown}`}
                      // variant="success"
                      id="user-profile-dropdown"
                    >
                      <img src="../user_edit_icon.svg" alt="user_edit_icon" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={showprofile}>
                        <img
                          className="icon_style"
                          src="../edit_profile_icon.svg"
                          alt="edit_profile_icon"
                        />{" "}
                        <span>Edit Profile </span>
                      </Dropdown.Item>

                      {user?.attributes?.["custom:role"] === "Industry Member" &&
                        <Dropdown.Item onClick={ViewPlanOpen}>
                          <img
                            className="icon_style"
                            src="../viewplane_icon.svg"
                            alt="viewplan_icon"
                          />{" "}
                          <span>View Plan</span>
                        </Dropdown.Item>}
                      <Dropdown.Item onClick={walletOpen}>
                        <img
                          className="icon_style"
                          src="../Wallet_icon.svg"
                          alt="Wallet_icon"
                        />{" "}
                        <span>Wallet</span>{" "}
                      </Dropdown.Item>
                      <Logout isLoggedIn={isLoggedIn} />
                    </Dropdown.Menu>
                  </Dropdown>
                  <Wallet show={showWallet} onClose={walletClose} user_id={user?.attributes?.sub} />
                  <Modal1
                    showModal={openProfileEdit}
                    component={
                      <Profile_Update
                        onClose={closeprofile}
                        updateData={getUserData}
                      />
                    }
                    onClose={closeprofile}
                  />
                  <Modal1
                    showModal={showViewPlan}
                    component={
                      <ViewPlan
                        onClose={ViewPlanClose}
                        product={product}
                      />
                    }
                    onClose={ViewPlanClose}
                  />
                </div>
              </div>
            </nav>
          </div>
          <div className={`row ${styles.dashboad_row}`}>
            <div
              className={
                user?.attributes?.["custom:role"] === "Screen Writer" ||
                  user?.attributes?.["custom:role"] === "infiction_reader" || user?.attributes?.["custom:role"] === "industries_reader"
                  ? `{col-12 ${styles.book}}`
                  : `{col-12 ${styles.card_bg_im_2}}`
              }
            >
              <div
                className={`card card-inverse border-0 ${styles.card_style}`}
              >
                <div
                  className={
                    user?.attributes?.["custom:role"] === "Screen Writer" ||
                      user?.attributes?.["custom:role"] === "infiction_reader" || user?.attributes?.["custom:role"] === "industries_reader"
                      ? `card-block ${styles.card_bg_1}`
                      : `card-block ${styles.card_bg_im_1}`
                  }
                >
                  <div className="row user_profile_div">
                    <div className="col-xl-2 col-lg-2 col-md-2 position-relative">
                      <img
                        className={`btn-md img-fluid ${styles.user_profile_img} position-absolute`}
                        src={
                          user?.attributes?.picture
                            ? userImg
                            : "../profile_avtar.png"
                        }
                        alt="profile image"
                      />
                    </div>
                    <div
                      className={`col-xl-9 col-lg-9 col-md-9 ${styles.profile_content}`}
                    >
                      <h6
                        className={`mb-0 fs-1 ${styles.dash_heding} ${styles.yellow_color}`}
                      >
                        {user?.attributes?.name}
                      </h6>
                      <h6 className={`mb-4 text-dark ${styles.user_email}`}>
                        @{user?.attributes?.["custom:inf_username"] || "-"}
                      </h6>
                      <div className={`pb-5 ${styles.user_info}`}>
                        <ul
                          className={`d-flex gap-2 m-0 p-1 pe-2 text-dark ${styles.li_style}`}
                        >
                          <li>
                            <img
                              className="me-2"
                              src="../user_id_icon.svg"
                              alt="user_id_icon"
                            />
                            {user?.attributes?.sub?.split("-").pop() || "-"}
                          </li>
                          <li>
                            <img
                              className="me-2"
                              src="../email_icon.svg"
                              alt="email_icon"
                            />
                            {user?.attributes?.email || "-"}
                          </li>
                          <li>
                            {/* <img
                              src="../mobile_icon.svg"
                              alt="mobile_icon"
                            /> */}
                            <FaPhone
                              className="fa-solid fa-phone"
                              style={{
                                color: "#f3ae09",
                                transform: "rotate(100deg)",
                              }}
                            />
                            {user?.attributes?.phone_number || "-"}
                          </li>
                        </ul>
                      </div>
                      <div className="row">
                        <p className={`me-5 fs-5 ${styles.user_desc}`}>
                          {user?.attributes?.["custom:user_desc"] || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`row ${styles.dash_table}`}>
            <div>
              {user?.attributes?.["custom:role"] === "Industry Member" ? (
                <div className="member_dash_tab dash_tab mt-4">
                  <Tabs
                    defaultActiveKey="Wishlist"
                    transition={false}
                    id="noanim-tab-example"
                  // className="mb-3"
                  >
                    <Tab eventKey="Wishlist" title="Wishlist">
                      <div style={{ color: "#666873" }}>
                        <hr />
                      </div>
                      <Wishlist_Table productData={product} user_id={user?.attributes?.sub} />
                    </Tab>
                    <Tab eventKey="Marketplace" title="Marketplace">
                      <div style={{ color: "#666873" }}>
                        <hr />
                      </div>
                      <Marketplace_table productData={product} user_id={user?.attributes?.sub} />
                    </Tab>
                    <Tab eventKey="MyScreenplays" title="My Screenplays">
                      <div style={{ color: "#666873" }}>
                        <hr />
                      </div>
                      <MemberScreenplay productData={product} user_id={user?.attributes?.sub} />
                    </Tab>
                  </Tabs>
                </div>
              ) : user?.attributes?.["custom:role"] === "infiction_reader" || user?.attributes?.["custom:role"] === "industries_reader" ? (
                <div className="member_dash_tab dash_tab mt-4">
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

                      {user?.attributes?.["custom:role"] === "infiction_reader" ? <ReaderJobs user_id={user?.attributes?.sub} type={"infiction"} status={"Active"} loggedInUser={"reader"} /> : <ReaderJobs user_id={user?.attributes?.sub} type={"industry"} status={"Active"} loggedInUser={"reader"} />}
                    </Tab>
                    <Tab eventKey="Done Jobs" title="Done Jobs">
                      <div style={{ color: "#666873" }}>
                        <hr />

                        {user?.attributes?.["custom:role"] === "infiction_reader" ? <ReaderJobs user_id={user?.attributes?.sub} type={"infiction"} status={"Done"} loggedInUser={"reader"} /> : <ReaderJobs user_id={user?.attributes?.sub} type={"industry"} status={"Done"} loggedInUser={"reader"} />}

                      </div>

                    </Tab>
                  </Tabs>
                </div>
              ) : (
                <div className="d-flex justify-content-between">
                  <button className="btn screen_button_style mt-3">
                    My Screenplays
                  </button>
                  <button
                    onClick={() => {
                      setShowEditfile(true);
                      localStorage.setItem("SPFormData", JSON.stringify({}));
                    }}
                    className="btn screen_button_style2 py-3 mt-3"
                    type="button"
                  >
                    Upload Screenplay
                  </button>
                  <Modal1
                    showModal={showEditfile}
                    component={
                      <ProcessFlow
                        id={user?.attributes?.sub}
                        onClose={handleClose}
                        steplen={3}
                        setUserScreenplay={setUserScreenplay}
                      />
                    }
                    onClose={handleClose}
                  />
                </div>
              )}

              {user?.attributes?.["custom:role"] === "Screen Writer" && (
                <div className={`${styles.dash_hr}`}>
                  <hr />
                </div>
              )}
            </div>

            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              {user?.attributes?.["custom:role"] === "Screen Writer" && (
                <Table
                  userData={userData}
                  setUserScreenplay={setUserScreenplay}
                  productData={product}
                />
              )}
            </div>
          </div>
        </div>

      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  const { data: prices } = await stripe.prices.list();

  const productPromises = prices.map(async (price) => {
    const product = await stripe.products.retrieve(price.product);

    return {
      id: price.product,
      name: product.name,
      screenplay: parseInt(product.metadata.screenplay),
      price: price.unit_amount / 100,
      interval: price.recurring.interval,
      currency: price.currency,
    };
  });

  const products = await Promise.all(productPromises);

  return {
    props: {
      products,
    },
  };
};