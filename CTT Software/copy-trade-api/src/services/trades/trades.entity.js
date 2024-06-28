import Trade from "./trades.schema"; // this is OrderSchema Named as Trade
import Account from "../account/acount.schema";
import { ObjectId } from "mongodb";
const axios = require("axios");
import { mongo } from "mongoose";
import orderSchema from "../order/order.schema";
import { genLog } from "../order/order.helper";

// allowed filed for creating a new trade
const CREATE_ALLOWED = new Set([
  "account",
  "childrens",
  "orderType",
  "percentage",
  "type",
  "side",
  "amount",
  "hedging",
  "stopTrailing",
  "stop",
  "trailing",
  "limit",
  "guarantee",
  "orderLevel",
  "pointsAway",
  "atPrice",
  "limitPointsAway",
  "limitAtPrice",
  "status",
  "marketData",
  "partialExit",
  "ammend",
  "exitFrom",
  "marketPath",
  "exit",
  "placeOrder",
  "stopLimit",
  "orderCreated",
  "openPrice",
]);

// used for populating the 'account' field in  query result.
const populate = {
  path: "account",
  select: "email password percentage accountId",
};

// allowed query
const allowedQuery = new Set(["page", "orderType", "childrens"]);

/**
 * Creates a new trade based on the provided request data and saves it to the database.
 * Also updates the specified trade (if exitFrom is provided) to set partialExit as true in the database.
 *
 * @async
 * @function
 * @param {Object} options - The options object containing the required parameters.
 * @param {Object} options.db - The database object used for performing database operations.
 * @param {Object} options.ws - The WebSocket object used for emitting WebSocket events.
 * @returns {Function} An asynchronous function that handles the HTTP request and response.
 *
 * @param {Object} req - The HTTP request object containing trade information in the body.
 * @param {Object} res - The HTTP response object used for sending the response back to the client.
 * @throws {Error} Will throw an error if something goes wrong during the trade creation process.
 *
 */
export const createTrade =
  ({ db, ws }) =>
  async (req, res) => {
    try {
      console.log(req.body);
      if (!req.body.percentage)
        return res.status(400).send({ message: "Percentage is required" });
      const isValid = Object.keys(req.body).every((key) =>
        CREATE_ALLOWED.has(key)
      );
      if (!isValid) return res.status(400).send({ message: "Bad Request" });
      const accounts = await db.find({
        table: Account,
        key: { paginate: req.query.paginate === "false" },
      });
      if (!accounts)
        return res.status(404).send({ message: "No accounts found" });
      const updated = [];
      const orders = [];
      await Promise.all(
        accounts.map(async (account) => {
          const marketData =
            account.percentage.find(
              (p) => p.itemName === req.body.marketData.marketName
            ) || {};
          // Extract the value based on the given percentage
          const percentageValue = marketData[`${req.body.percentage}%`];
          // Check if the percentage value exists and is not 0
          if (percentageValue && percentageValue !== 0) {
            // Assign the value directly to the amount
            req.body.amount = percentageValue;
            if (req.body.exitFrom) {
              req.body.ammend = undefined;
              const parent = await db.find({
                table: Trade,
                key: {
                  query: { childrens: { $in: [ObjectId(req.body.exitFrom)] } },
                  allowedQuery,
                  populate: { path: "childrens" },
                },
              });
              await Promise.all(
                parent.docs[0].childrens.map(async (children) => {
                  const single = await db.update({
                    table: Trade,
                    key: {
                      _id: children._id,
                      body: {
                        partialExit: true,
                        percentage: req.body.percentage,
                        amount: req.body.amount,
                      },
                    },
                  });
                  updated.push(single);
                  req.body.orderCreated = single.orderCreated;
                })
              );
              await ws.emit("partialExit", {
                id: req.body.exitFrom,
                parentId: parent.docs[0]._id,
                partialExit: true,
                parent: updated,
              });
            }
            const newTrade = await db.create({
              table: Trade,
              key: { ...req.body, account: account._id, populate },
            });
            orders.push(newTrade);
          }
        })
      );
      console.log(orders);

      if (!orders.length > 0)
        return res.status(422).send({ message: "Unprocessable Content" });
      const orderIds = orders.map((order) => order._id);
      const data = {
        orderType: "parent",
        childrens: orderIds,
      };
      
      try {
        const payLoad = {
          accounts: accounts,
          order: orders,
        };

        const response = await axios(`${process.env.BOT_SERVER_URL}/trade`, {
          method: "POST",
          data: payLoad,
        });
        const parentOrder = await db.create({
          table: Trade,
          key: { ...data,status: response?.data?.status, populate: { path: "childrens" } },
        });
      res.status(200).send({ orders, parentOrder });
        await ws.emit("account", response.data);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  };

  export const createTradetoOrder = ({ db, ws }) => async (req, res) => {
    try {
      if (!req.body.percentage)
        return res.status(400).send({ message: "Percentage is required" });
      const isValid = Object.keys(req.body).every((key) =>
        CREATE_ALLOWED.has(key)
      );
      const accounts = await db.find({
        table: Account,
        key: { paginate: req.query.paginate === "false" },
      });
      if (!accounts)
        return res.status(404).send({ message: "No accounts found" });
      const updated = [];
      const orders = [];
      await Promise.all(
        accounts.map(async (account) => {
          const marketData =
            account.percentage.find(
              (p) => p.itemName === req.body.marketData.marketName
            ) || {};
          const percentageValue = marketData[`${req.body.percentage}%`];
          if (percentageValue && percentageValue !== 0) {
            req.body.amount = percentageValue;
            if (req.body.exitFrom) {
              req.body.ammend = undefined;
              const parent = await db.find({
                table: Trade,
                key: {
                  query: { childrens: { $in: [ObjectId(req.body.exitFrom)] } },
                  allowedQuery,
                  populate: { path: "childrens" },
                },
              });
              await Promise.all(
                parent.docs[0].childrens.map(async (children) => {
                  const single = await db.update({
                    table: Trade,
                    key: {
                      _id: children._id,
                      body: {
                        partialExit: true,
                        percentage: req.body.percentage,
                        amount: req.body.amount,
                      },
                    },
                  });
                  updated.push(single);
                  req.body.orderCreated = single.orderCreated;
                })
              );
              await ws.emit("partialExit", {
                id: req.body.exitFrom,
                parentId: parent.docs[0]._id,
                partialExit: true,
                parent: updated,
              });
            }
            const newTrade = await db.create({
              table: orderSchema,
              key: {
                ...req.body,
                toOrder: "toOrder",
                ammount: req.body.amount,
                account: account._id,
                populate,
                accountType: account.accountType,
              },
            });
            orders.push(newTrade);
          }
        })
      );
  
      console.log("orders", orders);
      try {
        const trade = await Trade.findByIdAndUpdate(req.body.id, {
          status: "Closed",
        });
  
        if (trade) {
          console.log(
            `Trade ${req.body.id} status updated to "Closed" successfully.`
          );
        } else {
          console.log(`Trade with ID ${req.body.id} not found.`);
        }
      } catch (error) {
        console.error("Error updating trade status:", error);
      }
  
      if (!orders.length > 0)
        return res.status(422).send({ message: "Unprocessable Content" });
      const orderIds = orders.map((order) => order._id);
      const data = {
        orderType: "parent",
        childrens: orderIds,
      };
  
      try {
        const payLoad = {
          accounts: accounts,
          order: orders,
        };
  
        const response = await axios(`${process.env.BOT_SERVER_URL}/trade`, {
          method: "POST",
          data: payLoad,
        });
        const parentOrder = await db.create({
          table: orderSchema,
          key: { ...data, populate: { path: "childrens" } },
        });
  
        // Create new trades in orderSchema after receiving response from bot
        await Promise.all(orders.map(async (order) => {
          const newTrade = await db.create({
            table: orderSchema,
            key: {
              ...order,
              toOrder: "toOrder",
              ammount: order.amount,
              account: order.account,
              populate,
              accountType: order.accountType,
            },
          });
          console.log("New trade created:", newTrade);
        }));
  
        res.status(200).send({ orders, parentOrder });
        await ws.emit("account", response.data);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  };
  

/**
 * Get a single trade by ID.
 * @param {Object} options - Options for fetching the trade.
 * @param {Object} options.db - The database instance for performing the fetch operation.
 * @returns {Function} - Express middleware function to handle the get trade request.
 */
export const getOne =
  ({ db }) =>
  async (req, res) => {
    try {
      const trade = await db.findOne({
        table: Trade,
        key: { _id: req.params.id },
      });
      console.log(trade);
      if (!trade) return res.status(404).send({ message: "No trades found" });
      res.status(200).send(trade);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  };

export const tradeToOrder =
  ({ db }) =>
  async (req, res) => {
    try {
      const trade = await db.findOne({
        table: Trade,
        key: { _id: req.params.id },
      });

      if (!trade) return res.status(404).send({ message: "No trades found" });

      // Generate a new unique ObjectId for the order document
      const newOrderId = new ObjectId();

      // Create the order document using the trade data and the new ObjectId
      const order = await db.create({
        table: OrderSchama,
        key: {
          ...trade, // Use trade data for the order
          // _id: newOrderId, // Use the new ObjectId
        },
      });

      console.log(order);
      res.status(200).send(order);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  };

/**
 * Get all trades.
 * @param {Object} options - Options for fetching the trades.
 * @param {Object} options.db - The database instance for performing the fetch operation.
 * @returns {Function} - Express middleware function to handle the get trades request.
 */
export const getAll =
  ({ db }) =>
  async (req, res) => {
    try {
      const agg = [
        {
          $match: {
            orderType: "parent",
          },
        },
        {
          $match: {
            "childrens.status": {
              $ne: "Closed",
            },
          },
        },
      ];

      let trades;
      if (req.query.orderType === "parent") {
        const results = await Trade.aggregate(agg);
        const all = await Trade.populate(results, {
          path: "childrens",
          strictPopulate: false,
        });
        trades = all.filter(
          (a) => !a.childrens.some((c) => c.status === "Closed" || c.exitFrom)
        );
      } else
        trades = await db.find({
          table: Trade,
          key: {
            query: { ...req.query },
            populate: { path: "account childrens" },
            allowedQuery,
          },
        });
      if (!trades) return res.status(404).send({ message: "Trades not found" });
      res.status(200).send(trades);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  };

/**
 * UPDATE a single trade by ID.
 * @param {Object} options - Options for fetching the trade.
 * @param {Object} options.db - The database instance for performing the fetch operation.
 * @returns {Function} - Express middleware function to handle the get trade request.
 */
export const updateTrade =
  ({ db, ws }) =>
  async (req, res) => {
    try {
      const isExist = await db.findOne({
        table: Trade,
        key: { _id: req.params.id },
      });
      if (!isExist) return res.status(404).send({ message: "No Order found" });
      const orders = await db.find({
        table: Trade,
        key: {
          query: { childrens: { $in: [ObjectId(req.params.id)] } },
          allowedQuery,
          populate: { path: "childrens" },
        },
      });
      const updated = [];
      await Promise.all(
        orders.docs[0].childrens.map(async (order) => {
          if (req.body.exit === "Partial Exit" && order.ammend === true)
            req.body.ammend = undefined;
          if (req.body.exit === "Exit" && order.ammend === true)
            req.body.ammend = undefined;
          if (req.body.ammend === true && order.exit === "Partial Exit")
            req.body.exit = undefined;
          req.body.placeOrder = false;
          const single = await db.update({
            table: Trade,
            key: { _id: order._id, body: req.body, populate },
          });
          updated.push(single);
        })
      );
      orders.docs[0].childrens = updated;
      try {
        const accounts = await db.find({
          table: Account,
          key: { paginate: req.query.paginate === "true" },
        });
        const payLoad = {
          accounts,
          order: updated,
        };
        const response = await axios(`${process.env.BOT_SERVER_URL}/trade`, {
          method: "POST",
          data: payLoad,
        });
      res.status(200).send({ updated, orders: orders.docs[0] });
        ws.emit("account", response.data);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  };

export const updateOrderMultipleExit =
  ({ db, ws }) =>
  async (req, res) => {
    const reformattedData = req.body.reformattedData;
    const idsArray = req.body.orderIds;
    const tradeIds = req.body.tradeIdArray;
    console.log(tradeIds);
    console.log(idsArray);
    try {
      const idsArrayString = JSON.stringify(idsArray);
      const tradeIdstring = JSON.stringify(tradeIds);

      // Validate IDs
      if (
        !idsArray ||
        !Array.isArray(idsArray) ||
        idsArray.some((id) => typeof id !== "string" || !ObjectId.isValid(id))
      ) {
        return res.status(400).send({ message: "Invalid IDs provided" });
      }

      const orders = await db.find({
        table: Trade,
        key: {
          query: { _id: { $in: idsArray.map((id) => ObjectId(id)) } },
          allowedQuery,
          populate: { path: "childrens" },
        },
      });
      // console.log(orders);

      // if (!orders || !Array.isArray(orders.docs) || orders.docs.length === 0) {
      //   return res.status(404).send({ message: "No Orders found" });
      // }

      const updated = await Promise.all(
        orders.docs.flatMap(async (orderDoc) => {
          const updateBody = {
            ...req.body,
            orderId: idsArrayString,
            tradeIdArray: tradeIdstring,
            reformattedData: reformattedData,
            placeOrder: false,
          };
          // Assuming there's only one child in each order
          const order = orderDoc;
          // if (req.body.exit === "Partial Exit" && order.ammend === true)
          //   req.body.ammend = undefined;
          if (req.body.exit === "Exit") req.body.ammend = undefined;
          // if (req.body.ammend === true && order.exit === "Partial Exit")
          //   req.body.exit = undefined;
          req.body.placeOrder = false;
          return db.update({
            table: Trade,
            key: { _id: order._id, body: updateBody, populate },
          });
        })
      );
      // console.log(updated);

      function getUniqueOrders(data) {
        // Create an empty object to store unique email addresses
        const uniqueEmails = {};

        // Iterate through the data array
        const filteredData = data.filter((order) => {
          const email = order.account.email;

          // Check if the email already exists in the object
          if (!uniqueEmails[email]) {
            uniqueEmails[email] = true;
            return true; // Include the order if the email is unique
          }

          return false; // Exclude the order if the email is not unique
        });

        return filteredData;
      }

      const updatedData = getUniqueOrders(updated);

      orders.idsArray = idsArray;

      // Save the docs array into a new variable
      const orderDocs = orders.docs;

      // Remove the docs array from the orders object
      delete orders.docs;

      const validUpdates = updated.filter((update) => update !== null);

      // function updateDataWithSum(updatedData, sumOfAmounts) {
      //   updatedData.forEach((item) => {
      //     const accountId = item.account.id;
      //     const sum = sumOfAmounts[accountId];
      //     if (sum !== undefined) {
      //       item.ammount = sum;
      //     }
      //   });
      // }

      // updateDataWithSum(updatedData, sumOfAmounts);
      // updatedData.idsArray = req.body.idsArray;
      // Print the updated data
      try {
        const accounts = await db.find({
          table: Account,
          key: { paginate: req.query.paginate === "true" },
        });
        const payLoad = {
          accounts,
          order: updatedData,
        };
        const response = await axios(`${process.env.BOT_SERVER_URL}/trade`, {
          method: "POST",
          data: payLoad,
        });
      res.status(200).send({ updated: updated, updatedData });
        ws.emit("account", response.data);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  };

export const updateTradeMultipleAmmend =
  ({ db, ws }) =>
  async (req, res) => {
    const reformattedData = req.body.reformattedData;
    const idsArray = req.body.orderIds;
    const sumOfAmounts = req.body.sumOfAmounts;
    const tradeIds = req.body.tradeIdArray;
    console.log(tradeIds);
    console.log(idsArray);
    try {
      const idsArrayString = JSON.stringify(idsArray);
      const tradeIdstring = JSON.stringify(tradeIds);

      // Validate IDs
      if (
        !idsArray ||
        !Array.isArray(idsArray) ||
        idsArray.some((id) => typeof id !== "string" || !ObjectId.isValid(id))
      ) {
        return res.status(400).send({ message: "Invalid IDs provided" });
      }

      const orders = await db.find({
        table: Trade,
        key: {
          query: { _id: { $in: idsArray.map((id) => ObjectId(id)) } },
          allowedQuery,
          populate: { path: "childrens" },
        },
      });
      // console.log(orders);

      // if (!orders || !Array.isArray(orders.docs) || orders.docs.length === 0) {
      //   return res.status(404).send({ message: "No Orders found" });
      // }

      const updated = await Promise.all(
        orders.docs.flatMap(async (orderDoc) => {
          const updateBody = {
            ...req.body,
            orderId: idsArrayString,
            tradeIdArray: tradeIdstring,
            reformattedData: reformattedData,
            placeOrder: false,
          };
          // Assuming there's only one child in each order
          const order = orderDoc;
          // if (req.body.exit === "Partial Exit" && order.ammend === true)
          //   req.body.ammend = undefined;
          if (req.body.exit === "Exit") req.body.ammend = undefined;
          // if (req.body.ammend === true && order.exit === "Partial Exit")
          //   req.body.exit = undefined;
          req.body.placeOrder = false;
          return db.update({
            table: Trade,
            key: { _id: order._id, body: updateBody, populate },
          });
        })
      );
      // console.log(updated);

      function getUniqueOrders(data) {
        // Create an empty object to store unique email addresses
        const uniqueEmails = {};

        // Iterate through the data array
        const filteredData = data.filter((order) => {
          const email = order.account.email;

          // Check if the email already exists in the object
          if (!uniqueEmails[email]) {
            uniqueEmails[email] = true;
            return true; // Include the order if the email is unique
          }

          return false; // Exclude the order if the email is not unique
        });

        return filteredData;
      }

      const updatedData = getUniqueOrders(updated);

      orders.sumOfAmounts = sumOfAmounts;
      orders.idsArray = idsArray;

      // Save the docs array into a new variable
      const orderDocs = orders.docs;

      // Remove the docs array from the orders object
      delete orders.docs;

      const validUpdates = updated.filter((update) => update !== null);

      // function updateDataWithSum(updatedData, sumOfAmounts) {
      //   updatedData.forEach((item) => {
      //     const accountId = item.account.id;
      //     const sum = sumOfAmounts[accountId];
      //     if (sum !== undefined) {
      //       item.ammount = sum;
      //     }
      //   });
      // }

      // updateDataWithSum(updatedData, sumOfAmounts);
      // updatedData.idsArray = req.body.idsArray;
      // Print the updated data
      try {
        const accounts = await db.find({
          table: Account,
          key: { paginate: req.query.paginate === "true" },
        });
        const payLoad = {
          accounts,
          order: updatedData,
        };
        const response = await axios(`${process.env.BOT_SERVER_URL}/trade`, {
          method: "POST",
          data: payLoad,
        });
      res.status(200).send({ updated: updated, updatedData });
        ws.emit("account", response.data);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  };
export const updateOrderMultiple =
  ({ db, ws }) =>
  async (req, res) => {
    const idsArray = req.body.idsArray; // Initialization
    const sumOfAmounts = req.body.sumOfAmounts;
    try {
      const idsArrayString = JSON.stringify(idsArray);

      // Validate IDs
      if (
        !idsArray ||
        !Array.isArray(idsArray) ||
        idsArray.some((id) => typeof id !== "string" || !ObjectId.isValid(id))
      ) {
        return res.status(400).send({ message: "Invalid IDs provided" });
      }

      const orders = await db.find({
        table: Trade,
        key: {
          query: { _id: { $in: idsArray.map((id) => ObjectId(id)) } },
          allowedQuery,
          populate: { path: "childrens" },
        },
      });
      console.log(orders);

      if (!orders || !Array.isArray(orders.docs) || orders.docs.length === 0) {
        return res.status(404).send({ message: "No Orders found" });
      }

      const updated = await Promise.all(
        orders.docs.flatMap(async (orderDoc) => {
          const updateBody = { ...req.body, idsArray: idsArrayString };
          // Assuming there's only one child in each order
          const order = orderDoc;
          // if (req.body.exit === "Partial Exit" && order.ammend === true)
          //   req.body.ammend = undefined;
          if (req.body.exit === "Exit") req.body.ammend = undefined;
          // if (req.body.ammend === true && order.exit === "Partial Exit")
          //   req.body.exit = undefined;
          req.body.placeOrder = false;
          return db.update({
            table: Trade,
            key: { _id: order._id, body: updateBody, populate },
          });
        })
      );

      function getUniqueOrders(data) {
        // Create an empty object to store unique email addresses
        const uniqueEmails = {};

        // Iterate through the data array
        const filteredData = data.filter((order) => {
          const email = order.account.email;

          // Check if the email already exists in the object
          if (!uniqueEmails[email]) {
            uniqueEmails[email] = true;
            return true; // Include the order if the email is unique
          }

          return false; // Exclude the order if the email is not unique
        });

        return filteredData;
      }

      const updatedData = getUniqueOrders(updated);

      orders.sumOfAmounts = sumOfAmounts;
      orders.idsArray = idsArray;

      // Save the docs array into a new variable
      const orderDocs = orders.docs;

      // Remove the docs array from the orders object
      delete orders.docs;

      const validUpdates = updated.filter((update) => update !== null);

      function updateDataWithSum(updatedData, sumOfAmounts) {
        updatedData.forEach((item) => {
          const accountId = item.account.id;
          const sum = sumOfAmounts[accountId];
          if (sum !== undefined) {
            item.ammount = sum;
          }
        });
      }

      updateDataWithSum(updatedData, sumOfAmounts);
      updatedData.idsArray = req.body.idsArray;
      // Print the updated data
      console.log("updatedData", updatedData);
      try {
        const accounts = await db.find({
          table: Account,
          key: { paginate: req.query.paginate === "true" },
        });
        const payLoad = {
          accounts,
          order: updatedData,
        };
        console.log("payload", payLoad);
        const response = await axios(`${process.env.BOT_SERVER_URL}/trade`, {
          method: "POST",
          data: payLoad,
        });
      res.status(200).send({ updated: updatedData, orders });
        ws.emit("account", response.data);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  };
export const updateTradeMultiple =
  ({ db, ws }) =>
  async (req, res) => {
    console.log("req body", req.body);
    const idsArray = req.body.idsArray; // Initialization
    const sumOfAmounts = req.body.sumOfAmounts;
    try {
      const idsArrayString = JSON.stringify(idsArray);

      // Validate IDs
      if (
        !idsArray ||
        !Array.isArray(idsArray) ||
        idsArray.some((id) => typeof id !== "string" || !ObjectId.isValid(id))
      ) {
        return res.status(400).send({ message: "Invalid IDs provided" });
      }

      const orders = await db.find({
        table: orderSchema,
        key: {
          query: { _id: { $in: idsArray.map((id) => ObjectId(id)) } },
          allowedQuery,
          populate: { path: "childrens" },
        },
      });

      if (!orders || !Array.isArray(orders.docs) || orders.docs.length === 0) {
        return res.status(404).send({ message: "No Orders found" });
      }

      const updated = await Promise.all(
        orders.docs.flatMap(async (orderDoc) => {
          req.body.logs = [
            ...orderDoc.logs,
            await genLog("Updated", "Order Updated"),
          ];
          const updateBody = { ...req.body, idsArray: idsArrayString };
          // Assuming there's only one child in each order
          const order = orderDoc;
          // if (req.body.exit === "Partial Exit" && order.ammend === true)
          //   req.body.ammend = undefined;
          if (req.body.exit === "Exit") req.body.ammend = undefined;
          // if (req.body.ammend === true && order.exit === "Partial Exit")
          //   req.body.exit = undefined;
          req.body.placeOrder = false;
          return db.update({
            table: orderSchema,
            key: { _id: order._id, body: updateBody, populate },
          });
        })
      );

      function getUniqueOrders(data) {
        // Create an empty object to store unique email addresses
        const uniqueEmails = {};

        // Iterate through the data array
        const filteredData = data.filter((order) => {
          const email = order.account.email;

          // Check if the email already exists in the object
          if (!uniqueEmails[email]) {
            uniqueEmails[email] = true;
            return true; // Include the order if the email is unique
          }

          return false; // Exclude the order if the email is not unique
        });

        return filteredData;
      }

      const updatedData = getUniqueOrders(updated);

      orders.sumOfAmounts = sumOfAmounts;
      orders.idsArray = idsArray;

      // Save the docs array into a new variable
      const orderDocs = orders.docs;

      // Remove the docs array from the orders object
      delete orders.docs;

      const validUpdates = updated.filter((update) => update !== null);
      // res.status(200).send({ updated: updatedData, orders });

      function updateDataWithSum(updatedData, sumOfAmounts) {
        updatedData.forEach((item) => {
          const accountId = item.account.id;
          const sum = sumOfAmounts[accountId];
          if (sum !== undefined) {
            item.ammount = sum;
          }
        });
      }

      updateDataWithSum(updatedData, sumOfAmounts);
      updatedData.idsArray = req.body.idsArray;
      try {
        const accounts = await db.find({
          table: Account,
          key: { paginate: req.query.paginate === "true" },
        });
        const payLoad = {
          accounts,
          order: updatedData,
        };
        const response = await axios(`${process.env.BOT_SERVER_URL}/trade`, {
          method: "POST",
          data: payLoad,
        });
      res.status(200).send({ updated: updatedData, orders });
        ws.emit("account", response.data);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  };
/**
 * Retrieves market data from a specified URL using Axios.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves when the data is retrieved and sent.
 */
export const getMarketData = () => async (req, res) => {
  try {
    const { reqUrl, payLoad } = req.body;
    const response = await axios(reqUrl, {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json; charset=UTF-8",
        "sec-ch-ua":
          "'Google Chrome';v='113', 'Chromium';v='113', 'Not-A.Brand';v='24'",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "'Linux'",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        cookie:
          "HSKCUBJH=MeTqYcd0nt0oRHNFh9tSrlAzLXfM9h8hziCEr3xW1IW5dI8/yFOcR9aqiWykrq04U0U9p7dgvlLeoula; HSKCUBJH_exp=2023-05-29T05:44:39.634Z; NINSBNNI=MeTqYcd0nt0oRHNFh9tSrlAzLXfM9h8hziCEr3xW1IW5dI8/yFOcR9aqiWykrq04U0U9p7dgvlLeoula; NINSBNNI_exp=2023-05-29T09:08:35.236Z; REGOWJJH=MeTqYcd0nt0oRHNFh9tSrlAzLXfM9h8hziCEr3xW1IW5dI8/yFOcR9aqiWykrq04U0U9p7dgvlLeoula; REGOWJJH_exp=2023-05-30T04:39:13.842Z; BFTAKTLS=MeTqYcd0nt0oRHNFh9tSrlAzLXfM9h8hziCEr3xW1IW5dI8/yFOcR9aqiWykrq04U0U9p7dgvlLeoula; BFTAKTLS_exp=2023-05-31T04:56:41.715Z; GSCRGDRH=MeTqYcd0nt0oRHNFh9tSrlAzLXfM9h8hziCEr3xW1IW5dI8/yFOcR9aqiWykrq04U0U9p7dgvlLeoula; GSCRGDRH_exp=2023-05-31T07:55:01.235Z; GYLPQTRJ=vuacXT1ajIx9L7p+KMBUaXjssOlNEyrmzJwpvrazaMVUzf8lstxBctljU+/udtNbzN2sQulg/xGGzzF8; GYLPQTRJ_exp=2023-05-31T08:26:45.316Z; FJHYGBKW=MeTqYcd0nt0oRHNFh9tSrlAzLXfM9h8hziCEr3xW1IW5dI8/yFOcR9aqiWykrq04U0U9p7dgvlLeoula; FJHYGBKW_exp=2023-05-31T08:36:13.738Z; MCVCIIEM=MeTqYcd0nt0oRHNFh9tSrlAzLXfM9h8hziCEr3xW1IW5dI8/yFOcR9aqiWykrq04U0U9p7dgvlLeoula; MCVCIIEM_exp=2023-05-31T12:24:11.077Z; FHDLEUUF=MeTqYcd0nt0oRHNFh9tSrlAzLXfM9h8hziCEr3xW1IW5dI8/yFOcR9aqiWykrq04U0U9p7dgvlLeoula; FHDLEUUF_exp=2023-06-01T04:35:08.639Z; PGRWSFKS=MeTqYcd0nt0oRHNFh9tSrlAzLXfM9h8hziCEr3xW1IW5dI8/yFOcR9aqiWykrq04U0U9p7dgvlLeoula; PGRWSFKS_exp=2023-06-02T04:43:38.002Z; WQHBNAIQ=MeTqYcd0nt0oRHNFh9tSrlAzLXfM9h8hziCEr3xW1IW5dI8/yFOcR9aqiWykrq04U0U9p7dgvlLeoula; WQHBNAIQ_exp=2023-06-02T10:02:21.902Z; ASP.NET_SessionId=gcrru0bute0uip40xfoou22d; JEXJHBJE=MeTqYcd0nt0oRHNFh9tSrlAzLXfM9h8hziCEr3xW1IW5dI8/yFOcR9aqiWykrq04U0U9p7dgvlLeoula; JEXJHBJE_exp=2023-06-05T04:38:42.009Z; AWSALB=8M8SZu16j7FOKvEZPydUmzf+Zu+uw/m0F4opSVk5L50G2pJuzOJSRKTp5Qa0YQplkeTNUov4AIkHlUMXTYJXIEghR8wpz9z0woa766SvrXuNxRsQqnA+wPLY2Mwz; AWSALBCORS=8M8SZu16j7FOKvEZPydUmzf+Zu+uw/m0F4opSVk5L50G2pJuzOJSRKTp5Qa0YQplkeTNUov4AIkHlUMXTYJXIEghR8wpz9z0woa766SvrXuNxRsQqnA+wPLY2Mwz",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      data: payLoad,
      method: "POST",
    });
    return res.status(200).send(response.data.d);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

/**
 * Close an order and update its status to 'Closed' along with its child orders.
 *
 * @function
 * @async
 * @param {Object} options - The options object containing a reference to the database.
 * @param {Object} options.db - The database instance used for operations.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 *
 * @throws {Error} If an error occurs during the database operations or request processing.
 *
 */
export const closeOrder =
  ({ db }) =>
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).send({ message: "Invalid Request" });
      const trade = await db.find({
        table: Trade,
        key: {
          query: { childrens: { $in: [ObjectId(id)] }, orderType: "parent" },
          allowedQuery,
          populate: { path: "childrens" },
        },
      });
      if (!trade) return res.status(404).send({ message: "No order found" });
      await Promise.all(
        trade.docs[0].childrens.map(async (children) => {
          await db.update({
            table: Trade,
            key: { _id: children._id, body: { status: "Closed" } },
          });
        })
      );
      return res.status(200).send(trade);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Something went wrong" });
    }
  };

/**
 * Updates the status of an order and emits it through a WebSocket.
 * @param {Object} options - The options object containing the database (db) and WebSocket (ws) instances.
 * @returns {Promise<void>} - A Promise that resolves when the order is updated and emitted.
 */
export const manageOrder =
  ({ db, ws }) =>
  async (req, res) => {
    try {
      const { status, orderCreated, openPrice, tradeId, id, reformattedData } =
        req.body;
      console.log(req.body);
      const order = await db.findOne({
        table: Trade,
        key: { _id: id, populate },
      });
      if (!order) return res.status(404).send({ message: "Order not found" });
      order.status = status;
      order.orderCreated = orderCreated;
      order.openPrice = openPrice;
      order.tradeId = tradeId;
      order.reformattedData = null;
      await db.save(order);
      ws.emit("order", {
        order,
        message: `Order has been ${status} from account ${order.account.email}`,
      });
      return res.status(200).send(order);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Something went wrong" });
    }
  };
