import { createSlice } from "@reduxjs/toolkit";

const historySlice = createSlice({
  name: "history",
  initialState: {
    allOrders: [],
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
    addOrders: (state, action) => {
      const newOrders = action.payload;
      state.allOrders = [...action.payload, ...state.allOrders];
    },
    updateOrders: (state, action) => {
      const orders = Array.isArray(action.payload) ? action.payload : [];
      orders.forEach((order) => {
        const index = state.allOrders.findIndex((prev) => prev.id === order.id);
        if (index !== -1) state.allOrders[index] = { ...order };
      });
    },

    manageStatus: (state, action) => {
      state.allOrders = state.allOrders.map((order) =>
        order.id === action.payload.id ? { ...order, ...action.payload } : order
      );
    },
    clearAllOrders: (state) => {
      state.allOrders = [];
    },
  },
});

export const { setValue, addOrders, updateOrders,clearAllOrders, manageStatus } =
  historySlice.actions;
export default historySlice.reducer;
