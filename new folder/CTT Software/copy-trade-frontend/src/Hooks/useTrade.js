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
    return new Promise((resolve, reject) => {
        if (!data.percentage) return hitToast("Amount is required", "info");
        if (!data.side) return hitToast("Side is required", "info");

        if (data.partialExit === false || data.exit === "Partial Exit") {
            data.side = data.side === "buy" ? "sell" : "buy";
            data.exitFrom = data.id;
            delete data.id;
            delete data.updatedAt;
            delete data.createdAt;
        }

        req({ method: "POST", uri: "trade", data })
            .then((res) => {
              console.log(res.data.parentOrder);
                if (res.data && res.data.parentOrder && res.data.parentOrder.childrens) {
                    // dispatch(addOrders(res.data.parentOrder.childrens));
                    dispatch(addTrade(res.data.parentOrder));
                    hitToast("Order Placed", "success");
                }

                if (res.data && res.data.childrens && res.data.childrens.length > 0) {
                    if (!res.data.childrens[0].exitFrom) {
                        // dispatch(addTrade(res.data.parentOrder));
                        hitToast("Order Placed", "success");
                    }
                }

                resolve(res);
            })
            .catch((err) => {
                console.error(err);
                reject("err");
            });
    });
};

  const closeMultiple = (payload) => {
    return new Promise((resolve, reject) => {
      try {
        req({ method: "PATCH", uri: `updateTradeMultiple/`, data: payload })
          .then(({ data }) => {
            dispatch(updateTrades(data));
            dispatch(removeTrade({ id: data.orders.id }));
            hitToast("Updated Successfully", "success");
            if (payload.status !== "Closed") {
              // dispatch(updateOrders(data.docs[0]));
              dispatch(updateTrades(data));
              dispatch(removeTrade({ id: data.orders.id }));
            }
            resolve(data);
          })
          .catch((err) => {
            reject("err");
            console.log(err);
          });
      } catch (err) {
        console.log(err);
        hitToast("Something went wrong", "error");
        reject("err");
      }
    });
  };

  const closeMultipleOrder = (payload) => {
    return new Promise((resolve, reject) => {
      try {
        req({ method: "PATCH", uri: `updateOrderMultiple/`, data: payload })
          .then(({ data }) => {
            dispatch(updateTrades(data));
            dispatch(removeTrade({ id: data.orders.id }));
            hitToast("Updated Successfully", "success");
            if (payload.status !== "Closed") {
              // dispatch(updateOrders(data.docs[0]));
              dispatch(updateTrades(data));
              dispatch(removeTrade({ id: data.orders.id }));
            }
            resolve(data);
          })
          .catch((err) => {
            reject(err);
            console.log(err);
          });
      } catch (err) {
        console.log(err);
        hitToast("Something went wrong", "error");
        reject(err);
      }
    });
  };

  const updateOrderAmmend = (payload) => {
    return new Promise((resolve, reject) => {
      try {
        req({ method: "PATCH", uri: `updateTradeMultipleAmmend`, data: payload })
          .then(({ data }) => {
            dispatch(updateTrades(data));
            hitToast("Updated Successfully", "success");
            if (payload.status !== "Closed") {
              if (data.docs && data.docs.length > 0) {
                // dispatch(updateOrders(data.docs[0]));
              }              
              dispatch(updateTrades(data));
              // dispatch(removeTrade({ id: data.orders.id }));
            }
            resolve(data);
          })
          .catch((err) => {
            reject("err");
            console.log(err);
          });
      } catch (err) {
        console.log(err);
        hitToast("Something went wrong", "error");
        reject("err");
      }
    });
  };

  const updateOrderNew = (id, payload) => {
    return new Promise((resolve, reject) => {
      try {
        req({ method: "PATCH", uri: `trade/${id}`, data: payload })
          .then(({ data }) => {
            dispatch(updateTrades(data));
            hitToast("Updated Successfully", "success");
            if (payload.status !== "Closed") {
              // dispatch(updateOrders(data.docs[0]));
              dispatch(updateTrades(data));
              dispatch(removeTrade({ id: data.orders.id }));
            }
            resolve(data);
          })
          .catch((err) => {
            reject(err);
            console.log(err);
          });
      } catch (err) {
        console.log(err);
        hitToast("Something went wrong", "error");
        reject(err);
      }
    });
  };

  const closeTrade = (id) => {
    return new Promise((resolve, reject) => {
      console.log(id);
      req({ method: "PATCH", uri: `close-order/${id}` })
        .then(({ data }) => {
          console.log(data?.doc?.id);
          console.log(data.docs[0].id);
          // dispatch(updateOrders(data.docs[0]));
          dispatch(removeTrade({ id: data.docs[0].id }));
          // dispatch(removeTrade({ id: data.id }));
          hitToast("Successfully closed order", "success");
          resolve(data);
        })
        .catch((err) => {
          reject("err");
          console.log(err);
          hitToast("Failed to close order", "error");
        });
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
    handlePagination,
  };
};

export default useTrade;