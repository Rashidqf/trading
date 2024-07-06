import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useUtils from "../../../Utils/useUtils";
import { useGlobalCtx } from "../../../Contexts/GlobalProvider";

const ammounts = [
  {
    name: "100%",
    value: 100,
  },
  {
    name: "75%",
    value: 75,
  },
  {
    name: "50%",
    value: 50,
  },
  {
    name: "25%",
    value: 25,
  },
];

export default function UpdateTradeMultiple({ orderData, handleModal,ordertype }) {
  const [isVisible, setIsVisible] = useState(false);
  const { handleSubmit, register, setValue } = useForm();
  const { hitToast } = useUtils();
  const { updateTrade, updateOrderNew } = useGlobalCtx()
  
console.log(orderData);
  // useEffect(() => {
  //   setIsVisible(true);
  //   orderData.forEach((order, index) => {
  //     Object.keys(order).forEach((key) =>
  //       setValue(`${index}-${key}`, order[key])
  //     );
  //   });
  // }, [orderData]);

  const onsubmit = (data) => {
    orderData.forEach((order, index) => {
      const payload = {};
      const orderId = data[`${index}-id`];
      if (data[`${index}-pointsAway`] !== "")
        payload.pointsAway = Number(data[`${index}-pointsAway`]);
      if (data[`${index}-limitPointsAway`] !== "")
        payload.limitPointsAway = Number(data[`${index}-limitPointsAway`]);
      if (data[`${index}-limit`]) payload.limit = data[`${index}-limit`];
      if (data[`${index}-atPrice`]){
        const priceSet = Number(data['0-atPrice']);
        payload.atPrice = priceSet;
      }
        
      //  updateTrade(orderId, payload)
      updateOrderNew(orderId, payload)
      
    });
    handleModal();
  };

  return (
    <section
      className={`w-[18rem] ${
        isVisible ? "max-h-max" : "h-[15rem]"
      } border border-grey-700 rounded bg-grey`}
    >
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className="p-3">
          {orderData.slice(0, 1).map((order, index) => (
            <div key={index}>
              <input
                type="hidden"
                {...register(`${index}-id`)}
                value={order?.id}
              />
              <div className="pt-1 flex items-end border-b border-b-grey-400 pb-3">
                <button
                  disabled
                  onClick={(e) => {
                    e.preventDefault();
                    setValue(`${index}-orderType`, "sell");
                  }}
                  className={`rounded-r-none rounded capitalize font-bold text-sm h-10 text-regular w-20 text-left pl-2 ${
                    order?.side === "buy" ? "bg-grey-400" : "bg-warning"
                  }`}
                >
                  Sell
                </button>
                <div>
                  <p className="text-xs font-extralight text-center">Amount</p>
                  <select
                    disabled
                    {...register(`${index}-percentage`)}
                    className="w-28 outline-none text-xs tracking-wider appearance-none text-center px-1 h-10 border border-grey-400 placeholder:text-xs placeholder:font-mono placeholder:-tracking-wider"
                  >
                    <option value="" disabled>
                      Select Amount
                    </option>
                    {ammounts.map((amount) => (
                      <option
                        key={amount.value}
                        value={amount.value}
                        selected={order?.percentage === amount.value}
                      >
                        {amount.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  disabled
                  onClick={(e) => {
                    e.preventDefault();
                    setValue(`${index}-orderType`, "buy");
                  }}
                  className={`rounded-l-none rounded capitalize font-bold text-sm text-regular w-20 text-right pr-2 h-10 ${
                    order?.side === "sell" ? "bg-grey-400" : "bg-primary"
                  }`}
                >
                  Buy
                </button>
              </div>
              <div className={`flex items-end justify-center gap-1 px-1 mt-1`}>
                <div>
                  <p className="text-xs text-center font-thin tracking-wide">
                    At Price
                  </p>
                  <input
                    type="number"
                    step="any"
                    {...register(`${index}-atPrice`)}
                    className="w-28 outline-none text-center border border-grey-400 px-1"
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="mt-4 pb-2 flex justify-center">
            <input
              type="submit"
              value="SUBMIT"
              className="bg-primary cursor-pointer rounded-sm h-10 font-semibold tracking-wider text-regular px-3 py-1"
            />
          </div>
        </div>
      </form>
    </section>
  );
}
