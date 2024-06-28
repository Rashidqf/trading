import { configureStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";
import accountReducer from "./reducers/accountReducer";
import orderReducer from "./reducers/orderReducer";
import historyReducer from "./reducers/historyReducer";
import tradeReducer from "./reducers/tradeReducer";

export default configureStore({
    reducer: {
        acountStore: accountReducer,
        orderStore: orderReducer,
        historyStore: historyReducer,
        tradeStore: tradeReducer
    },
    // Enhance store with Redux DevTools Extension
    devTools: process.env.NODE_ENV !== 'production',
    // Optionally, you can use `composeWithDevTools` to add other enhancers
    // enhancers: [composeWithDevTools()]
});
