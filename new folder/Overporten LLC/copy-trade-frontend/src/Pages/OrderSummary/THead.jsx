import React, { useState } from 'react';

export default function THead(ordertype ) {
  const [heads, setHeads] = useState([
    {
      name: "Instrument",
      classNames:
        "flex-[11.11%] shrink grow text-xs font-semibold uppercase text-[#0c0d0e] flex justify-start",
    },
    {
      name: "Order Date",
      classNames:
        "flex-[11.11%] text-xs font-semibold uppercase text-[#0c0d0e] flex justify-center",
    },
    {
      name: "(E) OPEN PRICE",
      classNames:
        "flex-[11.11%] text-xs font-semibold uppercase text-[#0c0d0e] flex justify-center",
    },
    {
      name: "RISK SL",
      classNames:
        "flex-[11.11%] text-xs font-semibold uppercase text-[#0c0d0e] flex justify-center",
    },
    {
      name: "OPEN PRICE",
      classNames:
        "flex-[11.11%] text-xs font-semibold uppercase text-[#0c0d0e] flex justify-center",
    },
    {
      name: "Stop Loss",
      classNames:
        "flex-[11.11%] text-xs font-semibold uppercase text-[#0c0d0e] flex justify-center",
    },
    {
      name: "Amount",
      classNames:
        "flex-[11.11%] text-xs font-semibold uppercase text-[#0c0d0e] flex justify-center",
    },
    {
      name: "Side",
      classNames:
        "flex-[11.11%] text-xs font-semibold uppercase text-[#0c0d0e] flex justify-center",
    },
    {
      name: "TradeId",
      classNames:
        "flex-[11.11%] text-xs font-semibold uppercase text-[#0c0d0e] flex justify-center",
    },
    {
      name: "Status",
      classNames:
        "flex-[11.11%] text-xs font-semibold uppercase text-[#0c0d0e] flex justify-center",
    },
    {
      name: "Actions",
      classNames:
        `flex-[11.11%] ${ordertype === "order" ? "min-w-[117px]" : "min-w-[117px]"} min-w-[117px] text-xs font-semibold uppercase text-[#0c0d0e] flex justify-center`,
    },
    {
      name: "Ammend",
      classNames:
        "flex-[11.11%] min-w-[175px] text-xs font-semibold uppercase text-[#0c0d0e] flex justify-center",
    },
  ]);

  return (
    <div className="flex flex-nowrap w-full items-center bg-secondary h-max py-2 px-2">
      {heads.map((h, i) => (
        <div className={`select-none ${h.classNames}`} key={i}>
          {h.name}
        </div>
      ))}
    </div>
  );
}
