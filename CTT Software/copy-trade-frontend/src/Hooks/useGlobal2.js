import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { manageCloseOrder, manageOrderStatus, updateOrder } from "../reducers/orderReducer";
import useUtils from "../Utils/useUtils";
import { manageStatus } from "../reducers/historyReducer";
import { manageTradeStatus, manageCloseTrade } from "../reducers/tradeReducer";
import { addAcount } from "../reducers/accountReducer";

const socket = io(process.env.REACT_APP_SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
});

const useGlobal2 = () => {
  const dispatch = useDispatch();
  const { hitToast } = useUtils();

  useEffect(() => {
    socket.on("connection", (data) => {
      console.log(data);
    });

    socket.on("partialExit", (data) => {
      dispatch(updateOrder(data));
    });

    socket.on("account", (data) => {
      console.log(data);
    });

    socket.on("order", (data) => {
      const { order, message } = data;
      console.log(order);
      hitToast(message, "success");
      if (order.status === "Closed") {
        dispatch(manageCloseOrder(order));
        dispatch(manageCloseTrade(order));
      } else {
        dispatch(manageOrderStatus(order));
        dispatch(manageTradeStatus(order));
      }
      dispatch(manageStatus(order));
    });

    return () => {
      socket.off("connection");
      socket.off("account");
      socket.off("partialExit");
    };
  }, []);

  return {
    socket,
  };
};

export default useGlobal2;