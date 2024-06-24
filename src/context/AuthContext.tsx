import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { CognitoUser } from "@aws-amplify/auth";
import { Auth, Hub } from "aws-amplify";
import router from "next/router";
interface AuthContextType {
  user: CognitoUser | null;
  setUser: Dispatch<SetStateAction<CognitoUser>>;
  checkUser;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface Props {
  children: React.ReactElement;
}

function AuthProvider({ children }: Props): ReactElement {
  const [user, setUser] = useState<CognitoUser | null>(null);
  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    Hub.listen("auth", () => {
      // perform some action to update state whenever an auth event is detected.
      checkUser();
    });
  }, []);

  async function checkUser() {
    Auth.currentAuthenticatedUser()
      .then((Cognitouser) => {
        setUser(Cognitouser);
        // console.log("cognitoUser");
        
      })
      .catch((err) => {
        // console.log("User is not authenticated", err);
        setUser(null);
        // return false;
      });
  }

  return (
    <AuthContext.Provider value={{ user, setUser, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };

// export const useUser = (): AuthContextType => useContext(AuthContext);
