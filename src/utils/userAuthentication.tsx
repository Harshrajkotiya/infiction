import { Auth } from "aws-amplify";

const fetchUsers = async () => {
    try {
      const response = await fetch("/api/getUsers");
      const data = await response.json();
      return data.message;

    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

export const UserAuthentication = async (username, password, userRole) => {
    try {
        const data1 = await fetchUsers();
        const findUser = data1?.find((e) => e?.Attributes.find((obj) => (obj.Name === "email" && obj.Value == username)))?.Attributes.find((att) => att.Name === "custom:role" && (userRole === "reader" ? att.Value.includes(userRole) : att.Value === userRole));
        const isVerified = data1?.find((e) => e?.Attributes.find((obj) => obj.Name === "email_verified" && obj.Value == true))
  
        if (!findUser) {
            return {
                statusCode: 400,
                error: "User does not exist"
            }
        }
        else if (isVerified) {
          await Auth.resendSignUp(username);
          return {
            statusCode: 400,
            error: "email not verified! Check your email and verify it"
        }
        }
        else {
            const signInResponse = await Auth.signIn(username, password);
            window.location.pathname = `${userRole === "" ? "/admin" : "/dashboard"}` ;
            return {
                statusCode: 200,
                error: null
            }
          
        }
      } catch (error) {
        return {
            statusCode: 400,
            error: error?.message || error
        }
      }
}