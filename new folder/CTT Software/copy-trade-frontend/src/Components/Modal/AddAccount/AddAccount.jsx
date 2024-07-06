import React, { useRef } from "react";
import Input from "../../Shared/Input/Input";
import { useForm } from "react-hook-form";
import { useGlobalCtx } from "../../../Contexts/GlobalProvider";
import "./AddAccount.css";

export default function AddAccount() {
  const { register, reset, handleSubmit } = useForm();
  const modalRef = useRef();
  const { addAccount } = useGlobalCtx();

  /**
   * Toggles the visibility of a modal element.
   * @returns {void} - This function does not return a value.
   */
  const handleModal = () => {
    modalRef.current.classList.toggle("hidden");
  };

  /**
   * Handles the submission of account data.
   * Calls the addAccount function, resets the form, and handles the modal.
   * @param {Object} data - The account data to be submitted.
   * @returns {void} - This function does not return a value.
   */
  const onsubmit = (data) => {
    addAccount(data);
    reset();
    handleModal();
  };

  return (
    <>
      {/* <h1
        onClick={handleModal}
        className="cursor-pointer font-medium select-none inline-block px-4 py-2 bg-primary rounded-3xl text-regular"
      >
        Add Account
      </h1> */}
      <div>
        <button
          onClick={handleModal}
          className="cursor-pointer font-medium outline-none border-none select-none inline-block px-4 py-[10px] bg-primary rounded-3xl text-regular"
        >
          Add Account
        </button>
      </div>
      <section ref={modalRef} className="account hidden">
        <p
          onClick={handleModal}
          className="text-4xl absolute top-4 right-8 cursor-pointer"
        >
          &#215;
        </p>
        <div className="w-[33rem]">
          <h2 className="text-black font-bold text-xl text-center py-4">
            {" "}
            Add New Account
          </h2>
          <form onSubmit={handleSubmit(onsubmit)}>
            <div>
              <Input
                register={{ ...register("email") }}
                requiredt={true}
                label="Email"
                type="email"
              />
            </div>
            <div>
              <Input
                register={{ ...register("password") }}
                requiredt={true}
                label="Password"
                type="password"
              />
            </div>
            <div>
              <Input
                register={{ ...register("accountId") }}
                requiredt={true}
                label="Account Id"
                type="text"
              />
            </div>
            <div>
              {/* <Input register={{ ...register('percentage') }} requiredt={true} label='Percentage' type='number' /> */}
            </div>
            <div className="text-right py-5">
              <input
                type="submit"
                value="Add Account"
                className="cursor-pointer px-8 bg-primary py-3 text-regular rounded-3xl"
              />
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
