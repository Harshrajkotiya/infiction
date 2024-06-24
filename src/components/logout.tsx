import { Auth } from "aws-amplify";
import router from "next/router";
import { Dropdown } from "react-bootstrap";

export default function Logout({isLoggedIn}) {
  const handleLogout = async () => {
    try {
      if  (isLoggedIn){
        await Auth.signOut();
        console.log("User logged out");
        router.push(`../../../WhoAreYou`);
      }else{
        console.log("User not logged in");

      }
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  return (
    <Dropdown.Item  onClick={handleLogout}>
      <img className="icon_style" src="../logout_icon.svg" alt="logout_icon" />{" "}
      <span>
        Logout
      </span>{" "}
    </Dropdown.Item>
  );
}
