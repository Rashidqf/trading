import { useEffect, useState } from "react";
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
import { addTrade, updateTrades,setValue as fixValue, removeTrade } from "../reducers/tradeReducer";
const useOrder = () => {
  const dispatch = useDispatch();
  const { hitToast } = useUtils();

  const [triggerEffect, setTriggerEffect] = useState(false);

  useEffect(() => {
    if (triggerEffect) {
      dispatch(fixValue({ target: "loading", value: true }));
    req({
      method: "GET",
      uri: `trades?${new URLSearchParams({ orderType: "parent" })}`,
    })
      .then(({ data }) => {
        dispatch(fixValue({ target: "trades", value: data }));
      })
      .catch((err) => console.log(err))
      .finally(() =>{
        setTriggerEffect(false);
        dispatch(fixValue({ target: "loading", value: false }))});
      dispatch(fixValue({ target: "loading", value: true }));

      
    }
  }, [triggerEffect, dispatch]);

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
    return new Promise((resolve, reject) => {
      if (!data.percentage || !data.side) {
        hitToast("Amount and Side is required", "info");
        return reject(new Error("Amount and Side is required"));
      }
      if (data.partialExit === false || data.exit === "Partial Exit") {
        data.side = data.side === "buy" ? "sell" : "buy";
        data.exitFrom = data.id;
        delete data.id;
        delete data.updatedAt;
        delete data.createdAt;
      }
      req({ method: "POST", uri: "order/create", data })
        .then((res) => {
          console.log(res.data);
          // dispatch(addOrders(res.data.childrens));
          if (!res.data.childrens[0].exitFrom) dispatch(addOrder(res.data));
          hitToast("Order Placed", "success");
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject("err");
        });
    });
  };
  const singlePartialExit = (data) => {
    return new Promise((resolve, reject) => {
      if (!data.percentage || !data.side) {
        hitToast("Amount and Side is required", "info");
        return reject(new Error("Amount and Side is required"));
      }
      if (data.partialExit === false || data.exit === "Partial Exit") {
        data.side = data.side === "buy" ? "sell" : "buy";
        data.exitFrom = data.id;
        delete data.id;
        delete data.updatedAt;
        delete data.createdAt;
      }
      req({ method: "POST", uri: "order/partialexit", data })
        .then((res) => {
          console.log(res.data);
          // dispatch(addOrders(res.data.childrens));
          if (!res.data.childrens[0].exitFrom) dispatch(addOrder(res.data));
          hitToast("Order Placed", "success");
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject("err");
        });
    });
  };
  const createOrderPartialExit = (data) => {
    return new Promise((resolve, reject) => {
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
          resolve(res);
        })
        .catch((err) => {
          reject("err");
          console.log(err);
        });
    });
  };

  const orderToTrade = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await req({ method: "POST", uri: `trades`, data });
        
        console.log(data.id);
        console.log("response data ",res);
  
        // Dispatch actions
        dispatch(addOrder(res.data.parentOrder));
        // dispatch(addOrders(res.data.parentOrder));
  
        setTriggerEffect(true);
  
        // Resolve the promise with the response data
        resolve(res.data);
      } catch (err) {
        console.log(err);
        // Reject the promise with the error
        reject(err);
      }
    });
  };

  const updateTrade = (id, payload) => {
    console.log("payload",payload);
    return new Promise((resolve, reject) => {
      try {
        req({ method: "PATCH", uri: `order/update/${id}`, data: payload })
          .then(({ data }) => {
            console.log(data);
            hitToast("Updated Successfully", "success");
            if (payload.status !== "Closed") {
              dispatch(updateOrders(data.childrens));
              dispatch(updateOrder(data));
            }
            resolve(data);
          })
          .catch((err) => console.log(err));
      } catch (err) {
        reject("err");
        console.log(err);
        hitToast("Something went wrong", "error");
      }
    });
  };

  const updateTradeAmmend = (payload) => {
    return req({
      method: "PATCH",
      uri: `updateorderMultipleAmmend`,
      data: payload,
    })
      .then(({ data }) => {
        // Dispatch actions here
        dispatch(updateTrades(data));
        hitToast("Updated Successfully", "success");
        if (payload.status !== "Closed") {
          dispatch(updateOrders(data.docs[0]));
          dispatch(updateTrades(data));
          dispatch(removeTrade({ id: data.orders.id }));
        }
        return data; 
      })
      .catch((err) => {
        console.error(err);
        hitToast("Something went wrong", "error");
        throw err; // Throw the error to be caught by the caller
      });
  };

  const updateTradePartialExit = (payload) => {
    console.log(payload);
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
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
      hitToast("Something went wrong", "error");
    }
  };

  const updateTradeMultiples = (payload) => {
    console.log(payload);
    try {
      req({ method: "PATCH", uri: `order/update`, data: payload })
        .then(({ data }) => {
          console.log(data);
          hitToast("Updated Successfully", "success");
          if (payload.status !== "Closed") {
            dispatch(updateOrders(data.childrens));
            dispatch(updateOrder(data));
          }
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
      hitToast("Something went wrong", "error");
    }
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
    singlePartialExit,
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
