import { X } from "@phosphor-icons/react";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useGlobalCtx } from "../../../Contexts/GlobalProvider";

export default function AddCSV() {
  const modalRef = useRef();
  const { handleSubmit, reset, register } = useForm();
  const { updateAccountWithCSV } = useGlobalCtx();

  const handleModal = () => {
    modalRef.current.classList.toggle("hidden");
  };

  const onsubmit = (data) => {
    console.log(data);
    const fd = new FormData();
    fd.append("docs", data.docs[0]);
    updateAccountWithCSV(fd);
    reset();
    handleModal();
  };
  return (
    <section>
      <div>
        <button
          onClick={handleModal}
          className="cursor-pointer font-medium outline-none border-none select-none inline-block px-4 py-[10px] bg-primary rounded-3xl text-regular"
        >
          Upload CSV
        </button>
      </div>
      <div
        ref={modalRef}
        className="bg-regular z-50 border border-grey-400 rounded-md drop-shadow-lg w-[40rem] h-80 hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4"
      >
        <div className="flex justify-end">
          <X
            onClick={handleModal}
            size={32}
            weight="light"
            className="hover:cursor-pointer"
          />
        </div>
        <div>
          <h4 className="text-center font-bold tracking-wide text-2xl mb-2 text-primary">
            Upload CSV to Update Accounts
          </h4>
          <div className="mt-5">
            <form onSubmit={handleSubmit(onsubmit)}>
              <div className="flex justify-center">
                <div className="flex flex-col">
                  <label className="text-left" htmlFor="csv">
                    CSV <span className="text-warning font-bold">*</span>
                  </label>
                  <input
                    {...register("docs")}
                    type="file"
                    id="csv"
                    accept=".csv, text/csv"
                    className="border border-grey-400 w-96 p-1 rounded outline-none"
                  />
                </div>
              </div>
              <div className="ml-28 py-3">
                <input
                  type="submit"
                  value="Submit"
                  className="outline-none px-4 py-1 bg-primary text-regular cursor-pointer font-bold tracking-wide rounded"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
