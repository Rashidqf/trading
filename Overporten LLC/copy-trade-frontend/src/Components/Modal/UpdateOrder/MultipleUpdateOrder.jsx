import { PencilSimpleLine, X } from "@phosphor-icons/react";
import React, { useEffect, useRef, useState } from "react";
import UpdateTrade from "../../../Features/MarketPlace/components/UpdateTrade";
import "./UpdateOrder.css";
import { useGlobalCtx } from "../../../Contexts/GlobalProvider";
import UpdateTradeMultiple from "../../../Features/MarketPlace/components/UpdateTradeMultiple";
import UpdateOrderMultiple from "../../../Features/MarketPlace/components/UpdateOrderMultiple";

export default function MultipleUpdateOrder({ orderDataList, ordertype,orderDataLists }) {
  
  const { closeOrder, updateTrade,closeTrade } = useGlobalCtx();
  // const [ordertype, setordertype] = useState()
  const modalRef = useRef();

  const handleModal = () => {
    modalRef.current.classList.toggle("hidden");
  };
  



  //   const updateAllOrders = () => {
  //     orderDataList.forEach((orderData) => {
  //       // Update orderData here
  //       updateTrade(orderData.id, updatedData); // Replace updatedData with your updated data object
  //     });
  //   };

  const closeAllOrders = () => {
    orderDataList.forEach((orderData) => {
      if (ordertype === "order") {
        closeTrade(orderData?.id);
      } else {
        closeOrder(orderData?.id);
        window.location.reload(); // Reload the page when the 'else' section is executed
      }
    });
  };
  

  return (
    <>
      <div className="flex gap-5">
        <button
          onClick={handleModal}
          disabled={orderDataList?.some(
            (orderData) => orderData?.status === "Closed"
          )}
          className="font-semibold text-regular py-3 px-7 inline-block rounded-md bg-primary disabled:bg-grey-400"
        >
          <PencilSimpleLine size={22} weight="bold" />
        </button>
        <button
          onClick={closeAllOrders}
          disabled={orderDataList.some(
            (orderData) => orderData?.status === "Closed"
          )}
          className="font-semibold text-regular py-3 px-7 inline-block rounded-md bg-primary disabled:bg-grey-400"
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
            Amend
          </h2>
          <UpdateOrderMultiple  handleModal={handleModal} ordertypes={ordertype} orderData={orderDataList} orderDataLists = {orderDataLists}/>
          {/* <UpdateTradeMultiple handleModal={handleModal} ordertype={ordertype} orderData={orderDataList} /> */}
        </div>
      </section>
    </>
  );
}
