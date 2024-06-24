import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "../styles/login.css";
// add bootstrap css
import "bootstrap/dist/css/bootstrap.css";
import { AnimatePresence } from "framer-motion";
import { AmazonAIPredictionsProvider } from "@aws-amplify/predictions";
import style from "@/styles/temp.module.css";

import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

import awsExports from "../aws-exports";
import { QueryClientProvider, QueryClient } from "react-query";
import { useState } from "react";
import { UserContext } from '../store/CognitoUser/CognitoUserContext';
import AdminLayout from "./admin/layout";

Amplify.configure(awsExports);

const queryClient = new QueryClient();

function App({ Component, pageProps, router }) {
  const [cognitoUsers, setCognitoUsers] = useState([]);
  const [SPFormData, setSPFormData] = useState({});

  if (router.pathname.startsWith('/admin') && !router.pathname.startsWith('/admin/login')) {
    return (
      <AnimatePresence>
        <QueryClientProvider client={queryClient}>
          <UserContext.Provider value={{ cognitoUsers, setCognitoUsers, SPFormData, setSPFormData }}>
            <AdminLayout>
              <Component {...pageProps} key={router.route} />
            </AdminLayout>
          </UserContext.Provider>
        </QueryClientProvider>
      </AnimatePresence>
    )
  }
  return (
    <AnimatePresence>
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={{ cognitoUsers, setCognitoUsers, SPFormData, setSPFormData }}>
          <Component {...pageProps} key={router.route} />
        </UserContext.Provider>
      </QueryClientProvider>
    </AnimatePresence>
  );
}

export default App;
