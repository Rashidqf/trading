import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loader from "../../Components/Shared/Loader/Loader";
import THead from "./THead";
import TRow from "./TRow";
import { Minus, Plus } from "@phosphor-icons/react";
import Actions from "./Actions";
import ActionMultiple from "./ActionMultiple";
import { Tabs } from "flowbite-react";
import MultipleUpdateOrder from "../../Components/Modal/UpdateOrder/MultipleUpdateOrder";
import OpenTradesSection from "./tabs/OpenTradesSection";
import OpenOrdersSection from "./tabs/OpenOrdersSection";
import "./Actions.css"

export default function OrderSummary() {
  const { parentOrders, loading } = useSelector(
    (state) => ({
      parentOrders: state.orderStore.orders,
      loading: state.orderStore.loading,
    }),
    shallowEqual
  );

  const { parentTrade, tradeLoading } = useSelector(
    (state) => ({
      parentTrade: state.tradeStore.trades,
      tradeLoading: state.tradeStore.loading,
    }),
    shallowEqual
  );

  const [groupedOrders, setGroupedOrders] = useState({});
  const [groupedTrade, setGroupedTrade] = useState({});
  const [activeAccordion, setActiveAccordion] = useState([]);

  useEffect(() => {
    const updateData = () => {
      const newGroupedOrders = {};
      const newGroupedTrade = {};

      parentOrders.forEach((order) => {
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

      parentTrade?.forEach((order) => {
        const marketName = order?.childrens?.[0]?.marketData?.marketName;
        if (marketName) {
          const side = order.childrens[0].side;
          const key = `${marketName}-${side}`;
          if (!newGroupedTrade[key]) {
            newGroupedTrade[key] = [];
          }
          newGroupedTrade[key].push(order);
        }
      });

      setGroupedOrders(newGroupedOrders);
      setGroupedTrade(newGroupedTrade);
    };

    updateData();
  }, [parentOrders, parentTrade]);

  useEffect(() => {
    // Initialize activeAccordion when groupedOrders or groupedTrade is updated
    setActiveAccordion([...Object.keys(groupedOrders), ...Object.keys(groupedTrade)]);
  }, [groupedOrders, groupedTrade]);

  const toggleAccordion = (marketName) => {
    setActiveAccordion((prevState) => {
      if (prevState.includes(marketName)) {
        return prevState.filter((item) => item !== marketName);
      } else {
        return [...prevState, marketName];
      }
    });
  };


  return (
    <>
    
      <Tabs aria-label="Default tabs" style="underline">
        {loading ? (
          <Loader />
        ) : (
          <Tabs.Item className="mt-tabs" active title="Trades">
            <OpenTradesSection
              groupedOrders={groupedOrders}
              activeAccordion={activeAccordion}
              toggleAccordion={toggleAccordion}
            />
          </Tabs.Item>
        )}
        {tradeLoading ? (
          <Loader />
        ) : (
          <Tabs.Item title="Orders">
            <OpenOrdersSection
              groupedTrade={groupedTrade}
              activeAccordion={activeAccordion}
              toggleAccordion={toggleAccordion}
            />
          </Tabs.Item>
        )}
      </Tabs>
    </>
  );
}

