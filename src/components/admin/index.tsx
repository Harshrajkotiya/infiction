//import useState hook to create menu collapse state
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import React from "react";
import {
  FaBars,
  FaBookReader,
  FaIndustry
} from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { MdShop } from "react-icons/md";
import { RiAuctionFill, RiFilePaper2Fill, RiLock2Fill } from "react-icons/ri";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import styles from "../../styles/admin.module.css";

export default function AdminSideBar() {
  const router = useRouter();
  const [toggled, setToggled] = React.useState(true);

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      console.log("User logged out");
      router.push(`/admin/login`);
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };
  return (
    <>
      <Sidebar
        style={{ height: "100%" }}
        onBackdropClick={() => setToggled(false)}
        toggled={toggled}
        collapsed={toggled}
        rootStyles={{
          backgroundColor: "#000000",
          width: "300px",
          minWidth: "300px",
          position:"fixed",
          zIndex:"3"
        }}
        className={styles.adminPanelChild}
      >
        <Menu>
          <MenuItem
            icon={<FaBars />}
            onClick={() => setToggled(!toggled)}
            style={{ textAlign: "center" }}
          >
            {" "}
            <h2 style={{ fontWeight: "bolder" }} className="my-2" onClick={() => router.push("/admin")}>InFiction</h2>
          </MenuItem>
          <MenuItem
            icon={<MdShop />}
            onClick={() => router.push("/admin/marketPlace")}
          >
            MarketPlace
          </MenuItem>
          <MenuItem
            icon={<RiFilePaper2Fill />}
            onClick={() => router.push("/admin/user/Screen Writer")}
          >
            Screen Writer
          </MenuItem>
          <MenuItem
            icon={<FaIndustry />}
            onClick={() => router.push("/admin/user/Industry Member")}
          >
            Industry Member
          </MenuItem>
          <SubMenu icon={<FaBookReader />} label="Readers">
            <MenuItem
              onClick={() => router.push("/admin/user/infiction_reader")}
            >
              InFiction Reader
            </MenuItem>
            <MenuItem
              onClick={() => router.push("/admin/user/industries_reader")}
            >
              Industry Reader
            </MenuItem>
          </SubMenu>
          <MenuItem icon={<RiAuctionFill />} onClick={() => router.push("/admin/bids")}>Bids</MenuItem>
          <MenuItem icon={<RiLock2Fill />} onClick={() => router.push("/admin/holds")}>Holds</MenuItem>
          <MenuItem icon={<IoMdLogOut />} onClick={handleLogout}>
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </>
  );
}
