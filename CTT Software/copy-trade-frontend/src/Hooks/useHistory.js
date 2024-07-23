import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setValue,clearAllOrders, setPagination } from "../reducers/historyReducer";
import { useEffect } from "react";
import req from "./req";

const useHistory = () => {
  const dispatch = useDispatch();
  const page = useSelector(
    (state) => state.historyStore.pagination.page,
    shallowEqual
  );
  console.log("page",page);

  useEffect(() => {
    dispatch(setValue({ target: "loading", value: true }));
    req({
      method: "GET",
      uri: `order/getallhistory?${new URLSearchParams({
        page,
        paginate: false,
        orderType: "child",
        history: true,
      })}`,
    })
      .then(({ data: { docs, totalDocs } }) => {
        dispatch((update, getState) => {
          const { pagination } = getState().historyStore;
          update(setValue({ target: "allOrders", value: docs }));
          update(
            setValue({
              target: "pagination",
              value: { ...pagination, total: totalDocs },
            })
          );
        });
      })
      .catch((err) => console.log(err))
      .finally(() => dispatch(setValue({ target: "loading", value: false })));
      dispatch(clearAllOrders());
  }, [page]);

  const WipeTrade = () => {
    try {
      req({
        method: "POST",
        uri: `order/wipehistory?history=false`,
      })
        .then(({ data }) => {
          console.log(data);
          dispatch(clearAllOrders());
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
      // hitToast("Something went wrong", "error");
    }
  };

  const handlePagination = (page) => {
    dispatch(setPagination({ page }));
};


  return {
    handlePagination,
    WipeTrade
  };
};

export default useHistory;
