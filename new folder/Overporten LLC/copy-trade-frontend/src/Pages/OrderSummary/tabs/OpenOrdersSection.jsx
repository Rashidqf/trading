import React, { useState, useEffect } from "react";
import { Minus, Plus } from "@phosphor-icons/react";
import MultipleUpdateOrder from "../../../Components/Modal/UpdateOrder/MultipleUpdateOrder";
import TRow from "../TRow";
import THead from "../THead";
import ActionMultiple from "../ActionMultiple";
import { shallowEqual, useSelector } from "react-redux";
import THeadOrder from "../TheadOrder";

const OpenOrdersSection = ({
  groupedTrade,
  activeAccordion,
  toggleAccordion,
}) => {
  const { parentTrade, tradeLoading } = useSelector(
    (state) => ({
      parentTrade: state.tradeStore.trades,
      tradeLoading: state.tradeStore.loading,
    }),
    shallowEqual
  );
  const [groupedOrders, setGroupedOrders] = useState({});

  useEffect(() => {
    const newGroupedOrders = {};
    parentTrade.forEach((order) => {
      const marketName = order?.childrens?.[0]?.marketData?.marketName;
      if (marketName) {
        const side = order.childrens[0].side;
        const key = `${marketName}-${side}`;
        if (!newGroupedOrders[key]) {
          newGroupedOrders[key] = [];
        }
        newGroupedOrders[key].push(order);
      }
    });
    setGroupedOrders(newGroupedOrders);
  }, [parentTrade]);

  // Initialize activeAccordion with all group keys
  useEffect(() => {
    const allGroupKeys = Object.keys(groupedOrders);
    toggleAccordion(allGroupKeys);
  }, [groupedOrders, toggleAccordion]);

  return (
    <section className="p-5 w-full flex flex-col h-full">
      <div className="flex-1 flex flex-col">
        <h1 className="font-semibold text-xl py-3">Open Orders</h1>
        <THeadOrder ordertype="order" />
        {Object.entries(groupedTrade).map(([groupKey, orders]) => {
          const [marketName, side] = groupKey.split("-");
          const totalAmount = orders.reduce((acc, order) => {
            const childTotalAmount =
              order.childrens.length > 0 ? order.childrens[0].amount : 0;
            return acc + childTotalAmount;
          }, 0);

          const totalPercentage = orders.reduce((acc, order) => {
            const childPercentage =
              order.childrens.length > 0 ? order.childrens[0].amount : 0;
            const normalizedPercentage =
              childPercentage === 200 ? 100 : childPercentage;
            return acc + normalizedPercentage;
          }, 0);

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
                      <div className="flex-[11.11%] text-sm font-bold	 uppercase text-[#0c0d0e] flex justify-center">
                        ---
                      </div>
                      <div className="flex-[11.11%] text-sm  font-bold	 uppercase text-[#0c0d0e] flex justify-center">
                        ---
                      </div>
                      <div className="flex-[11.11%] text-sm  text-center font-bold	 text-[#0c0d0e] flex justify-center">
                        ---
                      </div>
                      <div className="flex-[11.11%] text-sm  text-center font-bold	 text-[#0c0d0e] flex justify-center">
                        ---
                      </div>
                      <div className="flex-[11.11%] text-sm  font-bold	 uppercase text-[#0c0d0e] flex justify-center">
                        {`${totalPercentage}`}
                      </div>
                      <div className="flex-[11.11%] text-sm  font-bold	 uppercase text-[#0c0d0e] flex justify-center">
                        ---
                      </div>
                      <div className="flex-[11.11%] text-sm  font-bold	 uppercase text-[#0c0d0e] flex justify-center">
                        ---
                      </div>
                      <div className="flex-[11.11%] pr-2 text-sm  font-bold	 uppercase text-[#0c0d0e] flex justify-center">
                        <ActionMultiple
                          ordertype="order"
                          orderDataList={orders}
                        />
                      </div>
                      <div className="flex-[11.11%] text-sm  font-bold	 uppercase text-[#0c0d0e] flex justify-center">
                        <MultipleUpdateOrder
                          orderDataLists = {orders}
                          ordertype="order"
                          orderDataList={orders.map((order) => ({
                            ...order.childrens[0],
                            ordertype: "order",
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
                    ordertype="order"
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

export default OpenOrdersSection;
