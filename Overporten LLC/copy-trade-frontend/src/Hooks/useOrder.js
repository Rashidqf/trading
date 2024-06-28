import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addOrder,
  removeOrder,
  setValue,
  updateOrder,
} from "../reducers/orderReducer";
import req from "./req";
import useUtils from "../Utils/useUtils";
import { addOrders, updateOrders } from "../reducers/historyReducer";
import { addTrade, removeTrade, updateTrades } from "../reducers/tradeReducer";

const useOrder = () => {
  const dispatch = useDispatch();
  const { hitToast } = useUtils();

  useEffect(() => {
    dispatch(setValue({ target: "loading", value: true }));

    req({
      method: "GET",
      uri: `order/getall?${new URLSearchParams({ orderType: "parent" })}`,
    })
      .then(({ data }) => {
        dispatch(setValue({ target: "orders", value: data }));
      })
      .catch((err) => console.log(err))
      .finally(() => dispatch(setValue({ target: "loading", value: false })));
  }, []);

  const createOrder = (data) => {
    return new Promise(function (myResolve, myReject) {
      if (!data.percentage || !data.side)
        return hitToast("Amount and Side is required", "info");
      if (data.partialExit === false || data.exit === "Partial Exit") {
        data.side = data.side === "buy" ? "sell" : "buy";
        data.exitFrom = data.id;
        delete data.id;
        delete data.updatedAt;
        delete data.createdAt;
      }
      console.log(data);
      req({ method: "POST", uri: "order/create", data })
        .then((res) => {
          dispatch(addOrders(res.data.childrens));
          if (!res.data.childrens[0].exitFrom) dispatch(addOrder(res.data));
          hitToast("Order Placed", "success");
          myResolve(res);
        })
        .catch((err) => {
          myReject(err);
          console.log(err);
        });
    });
  };
  const createOrderPartialExit = (data) => {
    return new Promise(function (myResolve, myReject) {
      if (!data.percentage || !data.side)
        return hitToast("Amount and Side is required", "info");
      if (data.partialExit === false || data.exit === "Partial Exit") {
        data.side = data.side === "buy" ? "sell" : "buy";
        data.exitFrom = data.id;
        delete data.id;
        delete data.updatedAt;
        delete data.createdAt;
      }
      console.log(data);
      req({ method: "POST", uri: "order/createOrderPartialExit", data })
        .then((res) => {
          dispatch(addOrders(res.data.childrens));
          if (!res.data.childrens[0].exitFrom) dispatch(addOrder(res.data));
          hitToast("Order Placed", "success");
          myResolve(res);
        })
        .catch((err) => {
          myReject(err);
          console.log(err);
        });
    });
  };

  const orderToTrade = (data) => {
    req({ method: "POST", uri: `trades`, data })
      .then((res) => {
        console.log(data);
        dispatch(updateOrders(data));
        dispatch(updateTrades(data));
        dispatch(removeTrade({ id: data.id }));
        // dispatch(addTrade(data));
        // dispatch(updateOrders(data));
        // dispatch(updateOrders(data));
        // dispatch(updateTrades(data));
        // dispatch(updateOrder(data));
        // dispatch(removeTrade({ id: data.id }));
        hitToast("Order Placed", "success");
      })
      .catch((err) => console.log(err));
  };

  const updateTrade = (id, payload) => {
    return new Promise(function (myResolve, myReject) {
      try {
        req({ method: "PATCH", uri: `order/update/${id}`, data: payload })
          .then(({ data }) => {
            console.log(data);
            hitToast("Updated Successfully", "success");
            if (payload.status !== "Closed") {
              dispatch(updateOrders(data.childrens));
              dispatch(updateOrder(data));
            }
            myResolve(data);
          })
          .catch((err) => console.log(err));
      } catch (err) {
        myReject(err);
        console.log(err);
        hitToast("Something went wrong", "error");
      }
    });
  };

  const updateTradeAmmend = (payload) => {
    return new Promise((resolve, reject) => {
      try {
        req({
          method: "PATCH",
          uri: `updateorderMultipleAmmend`,
          data: payload,
        })
          .then(({ data }) => {
            // console.log(data, data.docs[0], data);
            // console.log(data.docs[0]);
            // dispatch(updateOrders(data.docs[0]));
            dispatch(updateTrades(data));
            // dispatch(removeTrade({ id: data.orders.id }));
            hitToast("Updated Successfully", "success");
            // console.log(payload.status);
            if (payload.status !== "Closed") {
              // dispatch(updateOrders(data.docs[0]));
              dispatch(updateTrades(data));
              // dispatch(removeTrade({ id: data.orders.id }));
            }
            resolve(data);
          })
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
        reject(err);
        hitToast("Something went wrong", "error");
      }
    });
  };
  const updateTradePartialExit = (payload) => {
    return new Promise(function (myResolve, myReject) {
      try {
        req({
          method: "PATCH",
          uri: `updateTradeMultiplePartialExit`,
          data: payload,
        })
          .then(({ data }) => {
            // console.log(data, data.docs[0], data);
            // console.log(data.docs[0]);
            // dispatch(updateOrders(data.docs[0]));
            dispatch(updateTrades(data));
            // dispatch(removeTrade({ id: data.orders.id }));
            hitToast("Updated Successfully", "success");
            // console.log(payload.status);
            if (payload.status !== "Closed") {
              dispatch(updateOrders(data.docs[0]));
              dispatch(updateTrades(data));
              dispatch(removeTrade({ id: data.orders.id }));
            }
            myResolve(data);
          })
          .catch((err) => console.log(err));
      } catch (err) {
        myReject(err);
        console.log(err);
        hitToast("Something went wrong", "error");
      }
    });
  };

  const updateTradeMultiples = (payload) => {
    return new Promise(function (myResolve, myReject) {
      try {
        req({ method: "PATCH", uri: `order/update`, data: payload })
          .then(({ data }) => {
            console.log(data);
            hitToast("Updated Successfully", "success");
            if (payload.status !== "Closed") {
              dispatch(updateOrders(data.childrens));
              dispatch(updateOrder(data));
            }
            myResolve(data);
          })
          .catch((err) => console.log(err));
      } catch (err) {
        myReject(err);
        console.log(err);
        hitToast("Something went wrong", "error");
      }
    });
  };

  const closeOrder = (id) => {
    req({ method: "PATCH", uri: `order/close/${id}` })
      .then(({ data }) => {
        dispatch(updateOrders(data.childrens));
        dispatch(removeOrder({ id: data.id }));
        hitToast("Successfully closed order", "success");
      })
      .catch((err) => {
        console.log(err);
        hitToast("Failed to close order", "error");
      });
  };

  const handlePagination = (event, value) => {
    dispatch((update, getState) => {
      const { pagination } = getState().orderStore;
      update(
        setValue({
          target: "pagination",
          value: { ...pagination, page: value },
        })
      );
    });
  };

  return {
    createOrder,
    updateTrade,
    closeOrder,
    orderToTrade,
    handlePagination,
    updateTradeMultiples,
    updateTradeAmmend,
    updateTradePartialExit,
    createOrderPartialExit,
  };
};

export default useOrder;
