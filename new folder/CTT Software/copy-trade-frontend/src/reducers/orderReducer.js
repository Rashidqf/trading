import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    loading: true,
    pagination: {
      page: 1,
      total: 0,
    },
  },
  reducers: {
    setValue: (state, action) => {
      state[action.payload.target] = action.payload.value;
    },
    addOrder: (state, action) => {
      state.orders = [action.payload, ...state.orders];
    },
    updateOrder: (state, action) => {
      state.orders = state.orders.map((order) =>
        order.id === action.payload.id ? { ...order, ...action.payload } : order
      );
    },
    removeOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload.id
      );
    },
    manageCloseOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) =>
          !order.childrens.some((children) => children.id === action.payload.id)
      );
    },
    manageOrderStatus: (state, action) => {
      state.orders = state.orders.map((order) => {
        return {
          ...order,
          childrens: order.childrens.map((children) =>
            children.id === action.payload.id
              ? { ...children, ...action.payload }
              : children
          ),
        };
      });
    },
  },
});


export const {
  setValue,
  addOrder,
  updateOrder,
  removeOrder,
  manageCloseOrder,
  manageOrderStatus,
} = orderSlice.actions;
export default orderSlice.reducer;
