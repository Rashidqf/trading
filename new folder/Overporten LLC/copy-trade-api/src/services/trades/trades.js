import {
  closeOrder,
  createTrade,
  createTradetoOrder,
  getAll,
  getMarketData,
  getOne,
  manageOrder,
  tradeToOrder,
  updateOrderMultiple,
  updateTrade,
  updateTradeMultiple,
  updateTradeMultipleAmmend,
} from "./trades.entity";

export default function trades() {
  this.route.post("/trade", createTrade(this));
  this.route.post("/trades", createTradetoOrder(this));
  this.route.get("/trade/:id", getOne(this));
  this.route.get("/trades/:id", tradeToOrder(this));
  this.route.get("/trades", getAll(this));
  this.route.post("/marketdata", getMarketData(this));
  this.route.patch("/close-order/:id", closeOrder(this));
  this.route.post("/trade/status", manageOrder(this));
  this.route.patch("/trade/:id", updateTrade(this));
  this.route.patch("/updateTradeMultiple", updateTradeMultiple(this));
  this.route.patch("/updateOrderMultiple", updateOrderMultiple(this));
  this.route.patch("/updateTradeMultipleAmmend", updateTradeMultipleAmmend(this));
}
