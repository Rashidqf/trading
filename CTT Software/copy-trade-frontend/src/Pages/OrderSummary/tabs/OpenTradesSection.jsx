import React from "react";
import { Minus, Plus } from "@phosphor-icons/react";
import THead from "../THead";
import TRow from "../TRow";
import ActionMultiple from "../ActionMultiple";
import MultipleUpdateOrder from "../../../Components/Modal/UpdateOrder/MultipleUpdateOrder";
import { useSelector } from "react-redux";

const OpenTradesSection = ({
  groupedOrders,
  activeAccordion,
  toggleAccordion,
}) => {
  const newOrders = useSelector((state) => state.orderStore.orders);
  return (
    <section className="p-5 w-full flex flex-col h-full">
      <div className="flex-1 flex flex-col">
        <h1 className="font-semibold text-xl py-3">Open Trades</h1>
        <THead />
        {Object.entries(groupedOrders).map(([groupKey, orders]) => {
          const [marketName, side] = groupKey.split("-");
          const totalAmount = orders.reduce((acc, order) => {
            const childTotalAmount =
              order.childrens.length > 0 ? order.childrens[0].ammount : 0; // Corrected typo: 'ammount' to 'amount'
            return acc + childTotalAmount;
          }, 0);

          const totalPercentage = orders.reduce((acc, order) => {
            const childPercentage =
              order.childrens.length > 0 ? order.childrens[0].percentage : 0;
            const normalizedPercentage =
              childPercentage === 200 ? 100 : childPercentage;
            return acc + normalizedPercentage;
          }, 0);

          const totalData = orders.reduce((acc, order) => {
            if (order.childrens.length > 0 && order.childrens[0].openPrice !== undefined) {
              const childOpenPrice = order.childrens[0].openPrice;
              const normalizedOpenPrice = childOpenPrice === 200 ? 100 : childOpenPrice;
              acc.sum += normalizedOpenPrice;
              acc.count += 1;
            }
            return acc;
          }, { sum: 0, count: 0 });
          
          const openPriceAvg = totalData.count > 0 ? totalData.sum / totalData.count : 0;
          
          

          return (
            <div key={groupKey}>
              <h2 className="bg-[#f3f4f6]">
                <div
                  type="button"
                  className={`accordion-heading flex flex-nowrap w-full items-center border-b-2 border-b-grey h-max py-2 px-2 cursor-pointer `}
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div className="flex-[11.11%] shrink grow text-xs font-semibold uppercase text-[#0c0d0e] flex justify-start">
                    <span
                      className="bg-primary w-[20px] h-[20px]"
                      onClick={() => toggleAccordion(groupKey)}
                    >
                      {activeAccordion.includes(groupKey) ? (
                        <Minus size={20} color="#fff" />
                      ) : (
                        <Plus size={20} color="#fff" />
                      )}
                    </span>
                    <span style={{ marginLeft: "0.5rem" }}>
                      {marketName} ({side})
                    </span>
                  </div>
                  {activeAccordion.includes(groupKey) && (
                    <>
                      <div className="flex-[11.11%] text-sm font-bold uppercase text-[#0c0d0e] flex justify-center">
                        ---
                      </div>
                      <div className="flex-[11.11%] text-sm font-bold uppercase text-[#0c0d0e] flex justify-center">
                      {parseFloat(openPriceAvg.toFixed(2))}
                      </div>
                      <div className="flex-[11.11%] text-sm text-bfont-boldont-semibold text-[#0c0d0e] flex justify-center">
                        ---
                      </div>
                      <div className="flex-[11.11%] text-sm font-bold uppercase text-[#0c0d0e] flex justify-center">
                        {`${totalPercentage}%`}
                      </div>
                      {/* <div className="flex-[11.11%] text-sm font-bold uppercase text-[#0c0d0e] flex justify-center">
                        {totalAmount}
                      </div> */}
                      <div className="flex-[11.11%] text-sm font-bold uppercase text-[#0c0d0e] flex justify-center">
                        ---
                      </div>
                      <div className="flex-[11.11%] text-sm font-bold uppercase text-[#0c0d0e] flex justify-center">
                        ---
                      </div>

                      <div className="flex-[11.11%] pr-2 text-sm font-bold uppercase text-[#0c0d0e] flex justify-center">
                        <ActionMultiple orderDataList={orders} />
                      </div>
                      <div className="flex-[11.11%] text-sm font-bold uppercase text-[#0c0d0e] flex justify-center">
                        <MultipleUpdateOrder
                          orderDataLists = {orders}
                          ordertype="trade"
                          orderDataList={orders.map((order) => ({
                            ...order.childrens[0],
                            ordertype: "trade",
                          }))}
                        />
                      </div>
                    </>
                  )}
                </div>
              </h2>
              <div
                className="accordion-body"
                style={{
                  display: activeAccordion.includes(groupKey)
                    ? "block"
                    : "none",
                }}
              >
                {orders.map((order, idx) => (
                  <TRow
                    ordertype="trade"
                    key={order.id}
                    order={order.childrens[0]}
                    idx={idx}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OpenTradesSection;
