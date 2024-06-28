import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addTrade,
  removeTrade,
  setValue,
  updateTrades,
} from "../reducers/tradeReducer";
import req from "./req";
import useUtils from "../Utils/useUtils";
import { addOrders, updateOrders } from "../reducers/historyReducer";
// import { ifError } from "assert";

const useTrade = () => {
  const dispatch = useDispatch();
  const { hitToast } = useUtils();

  // useEffect(() => {
  //     dispatch(setValue({ target: 'loading', value: true }));
  //     req({ method: "GET", uri: `trades?${new URLSearchParams({ page, paginate: false, orderType: 'child' })}` })
  //         .then(({ data: { docs, totalDocs } }) => {
  //             dispatch((update, getState) => {
  //                 const { pagination } = getState().historyStore;
  //                 update(setValue({ target: 'allOrders', value: docs }));
  //                 update(setValue({ target: 'pagination', value: { ...pagination, total: totalDocs } }));
  //             });
  //         })
  //         .catch((err) => console.log(err))
  //         .finally(() => dispatch(setValue({ target: 'loading', value: false })));
  // }, [page]);

  useEffect(() => {
    dispatch(setValue({ target: "loading", value: true }));
    req({
      method: "GET",
      uri: `trades?${new URLSearchParams({ orderType: "parent" })}`,
    })
      .then(({ data }) => {
        dispatch(setValue({ target: "trades", value: data }));
      })
      .catch((err) => console.log(err))
      .finally(() => dispatch(setValue({ target: "loading", value: false })));
  }, []);

  const createTrade = (data) => {
    return new Promise(function(myResolve, myReject) {
      if (!data.percentage) {
        hitToast("Amount is required", "info");
        return myReject("Amount is required");
      }
      if (!data.side) {
        hitToast("Side is required", "info");
        return myReject("Side is required");
      }
      if (data.partialExit === false || data.exit === "Partial Exit") {
        data.side = data.side === "buy" ? "sell" : "buy";
        data.exitFrom = data.id;
        delete data.id;
        delete data.updatedAt;
        delete data.createdAt;
      }
      req({ method: "POST", uri: "trade", data })
        .then((res) => {
          console.log(res.data.parentOrder.childrens);
          dispatch(addTrade(res.data.parentOrder));
          hitToast("Order Placed", "success");
          if (!res.data.childrens[0].exitFrom)
            dispatch(addTrade(res.data.parentOrder));
          hitToast("Order Placed", "success");
          myResolve(res);
        })
        .catch((err) => {
          myReject(err);
          console.log(err);
        });
    });
  };

  const closeMultiple = (payload) => {
    return new Promise(function(myResolve, myReject) {
    try {
      req({ method: "PATCH", uri: `updateTradeMultiple/`, data: payload })
        .then(({ data }) => {
          // console.log(data, data.docs[0], data);
          // console.log(data.docs[0]);
          // dispatch(updateOrders(data.docs[0]));
          dispatch(updateTrades(data));
          dispatch(removeTrade({ id: data.orders.id }));
          hitToast("Updated Successfully", "success");
          // console.log(payload.status);
          if (payload.status !== "Closed") {
            // dispatch(updateOrders(data.docs[0]));
            dispatch(updateTrades(data));
            dispatch(removeTrade({ id: data.orders.id }));
          }
          myResolve(data)
        })
        .catch((err) => console.log(err));
    } catch (err) {
      myReject(err)
      console.log(err);
      hitToast("Something went wrong", "error");
    }
  })
  };
  const closeMultipleOrder = (payload) => {
    console.log(payload);
    try {
      req({ method: "PATCH", uri: `updateOrderMultiple/`, data: payload })
        .then(({ data }) => {
          // console.log(data, data.docs[0], data);
          // console.log(data.docs[0]);
          // dispatch(updateOrders(data.docs[0]));
          dispatch(updateTrades(data));
          dispatch(removeTrade({ id: data.orders.id }));
          hitToast("Updated Successfully", "success");
          // console.log(payload.status);
          if (payload.status !== "Closed") {
            // dispatch(updateOrders(data.docs[0]));
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

  const updateOrderAmmend = (payload) => {
    return new Promise(function(myResolve, myReject) {
    try {
      req({ method: "PATCH", uri: `updateTradeMultipleAmmend`, data: payload })
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
          myResolve(data)
        })
        .catch((err) => console.log(err));
    } catch (err) {
      myReject(err)
      console.log(err);
      hitToast("Something went wrong", "error");
    }
  })
  };

  const updateOrderNew = (id, payload) => {
    return new Promise(function(myResolve, myReject) {
    try {
      req({ method: "PATCH", uri: `trade/${id}`, data: payload })
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
          myResolve(data)
        })
        .catch((err) => console.log(err));
    } catch (err) {
      myReject(err)
      console.log(err);
      hitToast("Something went wrong", "error");
    }})
  };

  const closeTrade = (id) => {
    req({ method: "PATCH", uri: `close-order/${id}` })
      .then(({ data }) => {
        // dispatch(updateOrders(data.docs[0]));
        dispatch(removeTrade({ id: data.id }));
        // dispatch(updateTrades(data));
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
    createTrade,
    updateOrderNew,
    closeTrade,
    closeMultiple,
    updateOrderAmmend,
    closeMultipleOrder,
    // handlePagination,
  };
};

export default useTrade;
