import { createSlice } from "@reduxjs/toolkit";

const tradeSlice = createSlice({
  name: "trade",
  initialState: {
    trades: [],
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
    addTrade: (state, action) => {
      state.trades = [action.payload, ...state.trades];
    },
    updateTrades: (state, action) => {
      state.trades = state.trades.map((trade) =>
        trade.id === action.payload.id ? { ...trade, ...action.payload } : trade
      );
    },
    removeTrade: (state, action) => {
      state.trades = state.trades.filter(
        (order) => order.id !== action.payload.id
      );
      },
      
    manageCloseTrade: (state, action) => {
      state.trades = state.trades.filter(
        (trade) =>
          !trade.childrens.some((children) => children.id === action.payload.id)
      );    
    },
    manageTradeStatus: (state, action) => {
      state.trades = state.trades.map((trade) => {
        return {
          ...trade,
          childrens: trade.childrens.map((children) =>
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
  addTrade,
  updateTrades,
  removeTrade,
  manageCloseTrade,
  manageTradeStatus,
} = tradeSlice.actions;
export default tradeSlice.reducer;
