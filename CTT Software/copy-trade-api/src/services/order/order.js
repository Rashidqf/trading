import {
  closeOrder,
  createOrder,
  getAll,
  getAllHistory,
  manageOrder,
  updateOrderMultiple,
  updateOrder,
  wipeHistory,
  updateTradeMultipleAmmend,
  updateTradeMultiplePartialExit,
  createOrderPartialExit,
} from "./order.entity";

export default function orders() {
  this.route.post("/order/create", createOrder(this));
  this.route.post(
    "/order/createOrderPartialExit",
    createOrderPartialExit(this)
  );
  this.route.get("/order/getall", getAll(this));
  this.route.get("/order/getallhistory", getAllHistory(this));
  this.route.post("/order/wipehistory", wipeHistory(this));
  this.route.patch("/order/update/:id", updateOrder(this));
  this.route.patch("/order/update", updateOrderMultiple(this));
  this.route.patch("/order/close/:id", closeOrder(this));
  this.route.post("/order/status", manageOrder(this));
  this.route.patch(
    "/updateorderMultipleAmmend",
    updateTradeMultipleAmmend(this)
  );
  this.route.patch(
    "/updateTradeMultiplePartialExit",
    updateTradeMultiplePartialExit(this)
  );
}
