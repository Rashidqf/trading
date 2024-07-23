import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const schema = new Schema(
  {
    childrens: [{ type: Schema.Types.ObjectId, ref: "Trade" }],
    orderType: { type: String, enum: ["parent", "child"], default: "child" },
    percentage: { type: Number },
    ammount: { type: Number },
    side: { type: String, default: "buy" },
    marketData: { type: Object },
    entryPrice: {
      type: Number,
    },
    riskSl:{
      type: Number,
    },
    stopLoss: {
      type: Number,
    },
    toOrder: {
      type: "String"
    },
    pointsAway: { type: Number },
    atPrice: { type: Number },
    stopLimit: { type: Boolean, enum: [true, false], default: true },
    account: { type: Schema.Types.ObjectId, ref: "Account" },
    status: {
      type: String,
      enum: ["Pending", "Failed", "Active", "Closed", "Desyncronised"],
      default: "Pending",
    },
    idsArray: {
      type: String,
    },
    orderId: {
      type: String,
    },
    tradeIdArray: {
      type: String,
    },
    reformattedData: {
      type: Object,
    },
    exit: { type: String, enum: ["Exit", "Partial Exit", "MultipleExit"] },
    partialExit: { type: Boolean, default: false },
    exitFrom: { type: Schema.Types.ObjectId },
    placeOrder: { type: Boolean, enum: [true, false], default: true },
    ammend: { type: Boolean, default: false },
    openPrice: { type: Number },
    orderCreated: { type: String },
    history: { type: Boolean, default: true },
    tradeId: { type: String },
    accountType : {
      type: String
    },
    logs: [
      {
        time: { type: String },
        status: { type: String },
        message: { type: String },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

schema.plugin(paginate);
schema.methods.toJSON = function () {
  const orderObj = this.toObject();
  delete orderObj.__v;
  return JSON.parse(JSON.stringify(orderObj).replace(/_id/g, "id"));
};

export default model("Trade", schema);
