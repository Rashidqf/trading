import React, { useEffect } from "react";
import THead from "./THead";
import { useGlobalCtx } from "../../Contexts/GlobalProvider";
import TRow from "./TRow";
import sortByPercentage from "../../Utils/sortByPercentage";
import Paginations from "../../Components/Shared/Pagination/Paginations";
import { shallowEqual, useSelector } from "react-redux";
import useUtils from "../../Utils/useUtils";
import req from "../../Hooks/req";
import AddcsvClient from "../../Components/Modal/AddCSV/AddcsvClient";
import AddCSV from "../../Components/Modal/AddCSV/AddCSV";
import AddAccount from "../../Components/Modal/AddAccount/AddAccount";

export default function Accounts() {
  const { accounts, total } = useSelector(
    (state) => ({
      accounts: state.acountStore.accounts,
      total: state.acountStore.pagination.page,
    }),
    shallowEqual
  );
  const { sendAllAccounts, handlePagination } = useGlobalCtx();
  const { hitToast } = useUtils();

  const sendAllAccount = async (e) => {
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
        console.log("received");
        hitToast("Accounts are being ready for trade..", "success");
      } catch (err) {
        console.log(err);
        hitToast("Something went wrong", "error");
      }
    }
  };

  useEffect(() => {
    const myStartupFunction = () => {
      const hasRun = localStorage.getItem("appStarted");
      if (!hasRun) {
        localStorage.setItem("appStarted", true);
        sendAllAccount();
      }
    };
    myStartupFunction();
  }, [accounts]);

  console.log(accounts);
  return (
    <section className="p-5 w-full flex flex-col h-full">
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between">
            <h1 className="font-semibold text-xl py-3">Accounts Summary</h1>
            <div className="flex align-baseline gap-10 ">
              <AddcsvClient />
              <AddCSV />
              <AddAccount />
              <div>
                <button
                  onClick={sendAllAccounts}
                  disabled={accounts?.length > 0 ? false : true}
                  className="cursor-pointer font-medium outline-none border-none select-none inline-block px-4 py-[10px] bg-primary rounded-3xl text-regular"
                >
                  UPDATE
                </button>
              </div>
            </div>
          </div>
          <div className="flex-col w-full">
            <THead />
            {accounts?.length > 0 ? (
              sortByPercentage(accounts).map((account, idx) => (
                <TRow idx={idx} key={account.id} data={account} />
              ))
            ) : (
              <p className="min-h-[70vh] w-full flex justify-center items-center">
                No Accounts found !
              </p>
            )}
          </div>
        </div>
        <div>
          <Paginations onChange={handlePagination} total={total} />
        </div>
      </div>
    </section>
  );
}
