// TradeComponent.js
import React from 'react';

export default function TradeComponent({
  handleSubmit,
  register,
  reset,
  marketData,
  isVisible,
  expanded,
  orderType,
  stopLimit,
  toggleOrderType,
  handleStopLimit,
  onsubmit,
  hitToast,
  intData,
  ammounts,
}) {
  return (
    <section
      className={`w-[18rem] ${
        isVisible ? "max-h-max" : "h-[16.5rem]"
      } border border-grey-700 rounded bg-grey`}
    >
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className="p-3">
          <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleOrderType("sell");
              }}
              className={`uppercase font-bold tracking-wide px-8 py-[2px] rounded ${
                orderType === "sell" ? "bg-grey-400" : "bg-warning"
              } text-regular text-sm`}
            >
              Sell
            </button>
            <div>
              <p className="text-xs font-extralight text-center">Amount</p>
              <select
                {...register("percentage")}
                className="w-28 outline-none text-xs tracking-wider appearance-none text-center px-1 h-10 border border-grey-400 placeholder:text-xs placeholder:font-mono placeholder:-tracking-wider"
              >
                {ammounts.map((amount) => (
                  <option key={amount.value} value={amount.value}>
                    {amount.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleOrderType("buy");
              }}
              className={`uppercase font-bold tracking-wide px-8 py-[2px] rounded ${
                orderType === "buy" ? "bg-grey-400" : "bg-primary"
              } text-regular text-sm`}
            >
              Buy
            </button>
          </div>
          <div className={`flex items-end justify-center gap-1 px-1 mt-1`}>
            {/* Add any additional UI elements here */}
          </div>
          {/* Render additional UI based on tradeType */}
          <div className="mt-4 pb-2 flex ">
            <input
              type="submit"
              value="SUBMIT"
              className="bg-primary h-12 cursor-pointer rounded-sm font-semibold tracking-wider text-regular px-3 py-1 mx-auto"
            />
          </div>
        </div>
      </form>
    </section>
  );
}
