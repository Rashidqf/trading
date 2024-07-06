import React from "react";
import THead from "./THead";
import { useGlobalCtx } from "../../Contexts/GlobalProvider";
import TRow from "./TRow";
import sortByPercentage from "../../Utils/sortByPercentage";
import Paginations from "../../Components/Shared/Pagination/Paginations";
import { shallowEqual, useSelector } from "react-redux";
import AddAccount from "../../Components/Modal/AddAccount/AddAccount";
import AddCSV from "../../Components/Modal/AddCSV/AddCSV";
import AddcsvClient from "../../Components/Modal/AddCSV/AddcsvClient";

export default function Accounts() {
  const { accounts, total } = useSelector(
    (state) => ({
      accounts: state?.acountStore?.accounts,
      total: state?.acountStore?.pagination?.page,
    }),
    shallowEqual
  );
  console.log(accounts);
  const { sendAllAccounts, handlePagination } = useGlobalCtx();
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
              sortByPercentage(accounts).map((account, idx) =>
                // Check for account.id before rendering the TRow component
                account?.id !== undefined && account?.id !== null ? (
                  <TRow idx={idx} key={account.id} data={account} />
                ) : null
              )
            ) : (
              <p className="min-h-[70vh] w-full flex justify-center items-center">
                No Accounts found!
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
