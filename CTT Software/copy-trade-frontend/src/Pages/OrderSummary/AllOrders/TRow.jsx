import React from "react";
import formatDate from "../../../Utils/formatDate";
import formatDateWithSeconds from "../../../Utils/formatDateWithSeconds";

export default function TRow({ order, idx }) {
  const renderTimeDifference = () => {
    // Find "Order Created" and "Order Active" logs
    const orderCreatedLog = order.logs.find(log => log.status === "Pending");
    const orderActiveLog = order.logs.find(log => log.status === "Active");

    if (orderCreatedLog && orderActiveLog) {
      const createdTime = new Date(orderCreatedLog.time);
      const activeTime = new Date(orderActiveLog.time);

      // Calculate time difference in milliseconds
      const timeDifference = activeTime - createdTime;

      // Convert milliseconds to seconds and milliseconds
      const seconds = Math.floor(timeDifference / 1000);
      const milliseconds = (timeDifference % 1000).toString().padStart(3, '0');

      return `${seconds}.${milliseconds} sec`;
    }

    return "---";
  };


  return (
    <div
      className={`flex flex-nowrap w-full items-center border-b-2 border-b-grey h-max py-2 px-2 cursor-pointer ${
        idx % 2 === 0 ? "bg-grey" : ""
      }`}
    >
      <div className="w-[8rem] text-xs font-semibold uppercase text-[#64748B] flex justify-start">
        {order?.marketData?.marketName || "---"}
      </div>
      <div className="w-[10rem] text-xs text-center font-semibold text-[#64748B] flex justify-center">
        {formatDate(order?.createdAt) || "---"}
      </div>
      <div className="w-[15rem] text-xs font-semibold text-[#64748B] flex justify-center">
        {order?.account?.email || "---"}
      </div>
      <div className="w-[10rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center">
        {order?.openPrice || "---"}
      </div>
      <div className="w-[10rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center">
        {order?.pointsAway || order?.atPrice || "---"}
      </div>
      <div className="w-[10rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center">
        {order?.ammount !== undefined ? `${order.ammount}` : "---"}
      </div>
      <div className="w-[10rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center">
        {order?.tradeId || "---"}
      </div>
      <div className="w-[10rem] text-xs font-semibold uppercase text-[#64748B] flex justify-center">
        {order?.side || "---"}
      </div>
      <div className="w-[10rem] shrink grow text-xs font-semibold capitalize text-[#64748B] flex justify-center">
        <div>
          {order?.logs?.length > 0 ? (
            [...order?.logs]
              .sort((a, b) => new Date(b.time) - new Date(a.time))
              .map((log, i) => (
                <div
                  key={i}
                  className="text-xs font-mono py-1 tracking-wide leading-4"
                >
                  <p>
                    <span>Status:</span> <span>{log.status}.</span>
                  </p>
                  <p>
                    <span>Time:</span>{" "}
                    <span>{formatDateWithSeconds(log.time)}.</span>
                  </p>
                  <p>{log.message}.</p>
                  {log.status === "Pending" && (
                    <p>
                      <span>Time Difference:</span>{" "}
                      <span>{renderTimeDifference()}</span>
                    </p>
                  )}
                </div>
              ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
