import { PencilSimpleLine, X } from "@phosphor-icons/react";
import React, { useRef } from 'react';
import UpdateTrade from "../../../Features/MarketPlace/components/UpdateTrade";
import './UpdateOrder.css';
import { useGlobalCtx } from "../../../Contexts/GlobalProvider";

export default function Actions({ orderData,ordertype }) {
  const { closeOrder, closeTrade } = useGlobalCtx();
  const modalRef = useRef();
  /**
   * Toggles the visibility of a modal element and resets form and state values.
   * Updates the visibility of the modal element by toggling the 'hidden' class.
   * Resets the form type and type values to their initial states.
   * @returns {void} - This function does not return a value.
   */
  const handleModal = () => {
    modalRef.current.classList.toggle("hidden");
  };
  return (
    <>
      <div className="flex gap-5">
        <button
          onClick={handleModal}
          disabled={orderData.status === "Closed" ? true : false}
          className="font-semibold text-regular py-3 px-7 inline-block rounded-md bg-primary disabled:bg-grey-400"
        >
          <PencilSimpleLine size={22} weight="bold" />
        </button>
        <button
          onClick={() => { 
            if (ordertype === "order") {
              closeTrade(orderData.id);
            } else {
              closeOrder(orderData.id);
            }
            window.location.reload(); // Add this line to reload the page
          }}
          disabled={orderData.status === "Closed" ? true : false}
          className="font-semibold text-regular  py-3 px-7 inline-block rounded-md bg-primary disabled:bg-grey-400"
        >
          <X size={22} weight="bold" />
        </button>
      </div>
      <section ref={modalRef} className="order hidden h-max">
        <p
          onClick={() => {
            handleModal();
          }}
          className="text-4xl absolute top-4 right-8 cursor-pointer"
        >
          &#215;
        </p>
        <div>
          <h2 className="text-black font-bold text-xl text-center pb-2">
            Ammend
          </h2>
          <UpdateTrade handleModal={handleModal} orderData={orderData} ordertype={ordertype} />
        </div>
      </section>
    </>
  );
};


