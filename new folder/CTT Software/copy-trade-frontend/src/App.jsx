import React, { useEffect } from "react";
import "./App.css";
import Header from "./Components/Shared/Header/Header";
import Routing from "./Features/Routing/Routing";
import req from "./Hooks/req";
import useUtils from "./Utils/useUtils";
import { shallowEqual, useSelector } from "react-redux";

function App() {

  const { accounts, total } = useSelector(
    (state) => ({
      accounts: state.acountStore.accounts,
      total: state.acountStore.pagination.page, 
    }),
    shallowEqual
  );

  const { hitToast } = useUtils();

  const sendAllAccount = async () => {
    const payLoad = {
      accounts,
      type: "New Account",
    };
    if (accounts.length > 0) {
      try {
        await req({
          method: "POST",
          uri: `${process.env.REACT_APP_BOT_SERVER_URL}/accounts`,
          data: payLoad,
        });
        hitToast("Accounts are being ready for trade..", "success");
      } catch (err) {
        console.log(err);
        hitToast("Something went wrong", "error");
      }
    } else {
      console.log("No accounts to send");
    }
  };

  useEffect(() => {
    const myStartupFunction = async () => {
      const hasRun = sessionStorage.getItem("appStarted");
      if (!hasRun) {
        try {
          await sendAllAccount();
          sessionStorage.setItem("appStarted", true);
        } catch (error) {
          console.error("Failed to send accounts:", error);
        }
      }
    };
    
    const delay = 3000;
    const timeoutId = setTimeout(myStartupFunction, delay);
  
    return () => clearTimeout(timeoutId);
  }, [accounts]);
  

  return (
    <div>
      <header>
        <Header />
      </header>
      <main>
        <Routing />
      </main>
    </div>
  );
}

export default App;
