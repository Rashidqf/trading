import axios from "axios";
import { ObjectId } from "mongodb";
import Account from "../account/acount.schema";
import { genLog, getAmmount, calcAmmount } from "./order.helper";
import Order from "./order.schema"; // this is TradeSchema Named as Order

const createAllowed = new Set([
  "childrens",
  "percentage",
  "ammount",
  "side",
  "marketData",
  "pointsAway",
  "atPrice",
  "stopLimit",
  "account",
  "status",
  "partialExit",
  "exitFrom",
  "ammend",
  "openPrice",
  "orderCreated",
  "logs",
  "orderType",
  "exit",
  "placeOrder",
  "tradeId",
]);

const populate = { path: "account", select: "email password  accountId" };

const allowedQuery = new Set([
  "page",
  "orderType",
  "childrens",
  "paginate",
  "history",
]);

export const createOrder = ({ db, ws }) => async (req, res) => {
  try {
    const isValid = Object.keys(req.body).every((key) => createAllowed.has(key));
    // if (!isValid) return res.status(400).send({ message: 'Bad Request' });
    const accounts = await db.find({ table: Account, key: { paginate: req.query.paginate === 'false' } });
    if (!accounts) return res.status(400).send({ message: 'No accounts found for trade' });

    // const { marketData, percentage, exitFrom, ammount: number } = req.body;
    const { marketData, percentage, exitFrom } = req.body;

    let orders = [];
    await Promise.all(accounts.map(async (account) => {
      // const ammount = exitFrom ? await calcAmmount(number, percentage) : await getAmmount({ marketData, account, percentage });
      const ammount = await getAmmount({ marketData, account, percentage });

      if (exitFrom) {
        delete req.body.logs;
        req.body.ammend = undefined;
        const parent = await Order.findOne({ childrens: { $in: [ObjectId(exitFrom)] } }).populate({ path: 'childrens' });
        const exited = await Promise.all(parent.childrens.map(async (children) => {
          const newPer = Number(children.percentage) - Number(req.body.percentage);
          const single = await db.update({ table: Order, key: { _id: children._id, body: { partialExit: true, percentage: newPer, ammount } } });
          req.body.orderCreated = single.orderCreated;
          // console.log("single",single);
          return single;
        }));
        parent.childrens = exited;
        await ws.emit('partialExit', parent);
      }


      if (ammount !== 0) {
        const log = await genLog('Pending', 'Order Created');
        const order = await db.create({ table: Order, key: { ...req.body, tradeid: req.body.tradeId, ammount, logs: [log], account: account._id, populate } });
        orders.push(order);
      }
    }));

    if (!orders.length > 0) return res.status(400).send({ message: 'Bad Request' });

    const ids = orders.map((order) => order._id);
    const data = { orderType: 'parent', childrens: ids };
    

   

    try {
      const payLoad = { accounts: accounts, order: orders, };
      const response = await axios(`${process.env.BOT_SERVER_URL}/order`, { method: 'POST', data: payLoad });
      const parentOrder = await db.create({ table: Order, key: { ...data, populate: { path: 'childrens' } } });
      res.status(201).send(parentOrder);
      await ws.emit('account', response.data);
    }
    catch (err) {
      console.log(err);
    }

  }
  catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message || 'Internal Server Error' });
  }
};

// export const createOrder = ({ db, ws }) => async (req, res) => {
  
//   try {
//     const isValid = Object.keys(req.body).every((key) => createAllowed.has(key));
//     // if (!isValid) return res.status(400).send({ message: 'Bad Request' });
//     const accounts = await db.find({ table: Account, key: { paginate: req.query.paginate === 'false' } });
//     if (!accounts) return res.status(400).send({ message: 'No accounts found for trade' });

//     // const { marketData, percentage, exitFrom, ammount: number } = req.body;
//     const { marketData, percentage, exitFrom } = req.body;

//     let orders = [];
//     await Promise.all(accounts.map(async (account) => {
//       // const ammount = exitFrom ? await calcAmmount(number, percentage) : await getAmmount({ marketData, account, percentage });
//       const ammount = await getAmmount({ marketData, account, percentage });

//       if (exitFrom) {
//         delete req.body.logs;
//         req.body.ammend = undefined;
//         const parent = await Order.findOne({ childrens: { $in: [ObjectId(exitFrom)] } }).populate({ path: 'childrens' });
//         const exited = await Promise.all(parent.childrens.map(async (children) => {
//           var newOrders = await Order.findOne({account : account?._id, _id: children?._id })
//           const newPer = Number(children.percentage) - Number(req.body.percentage);
//           console.log("new Order",newOrders.tradeId);
//           const single = await db.update({ table: Order, key: { _id: children._id, body: { partialExit: true, tradeId: newOrders.tradeId, percentage: newPer, ammount } } });
//           req.body.orderCreated = single.orderCreated;
//           if (ammount !== 0) {
//             const log = await genLog('Pending', 'Order Created');
//             const order = await db.create({ table: Order, key: { ...req.body, tradeId: newOrders.tradeId, ammount, logs: [log], account: account._id, populate } });
//             orders.push(order);
//           }
//           return single;
//         }));
//         parent.childrens = exited;
//         await ws.emit('partialExit', parent);
//       }
      
//     }));
//     console.log("Orders:", orders);

//     if (!orders.length > 0) return res.status(400).send({ message: 'Bad Request' });

//     const ids = orders.map((order) => order._id);
//     const data = { orderType: 'parent', childrens: ids };

//     try {
//       const payLoad = { accounts: accounts, order: orders };
//       const response = await axios(`${process.env.BOT_SERVER_URL}/order`, { method: 'POST', data: payLoad });
//       newOrder = await db.create({ table: Order, key: { ...data, populate: { path: 'childrens' } } }); 
//       res.status(201).send(newOrder);
//       await ws.emit('account', response.data);
//     } catch (err) {
//       console.log(err);
//     }

//   } catch (err) {
//     console.log(err);
//     return res.status(500).send({ message: err.message || 'Internal Server Error' });
//   }
// };

// export const createOrder =
//   ({ db, ws }) =>
//   async (req, res) => {
//     try {

//       const isValid = Object.keys(req.body).every((key) =>
//         createAllowed.has(key)
//       );
//       // if (!isValid) {
//       //   return res.status(400).send({ message: "Bad Request" });
//       // }

//       const accounts = await db.find({
//         table: Account,
//         key: { paginate: req.query.paginate === "false" },
//       });
//       if (!accounts)
//         return res.status(400).send({ message: "No accounts found for trade" });

//       const { marketData, percentage, exitFrom } = req.body;

//       let orders = [];
//       await Promise.all(
//         accounts.map(async (account) => {
//           const ammount = exitFrom
//             ? await calcAmmount(req.body.ammount, percentage)
//             : await getAmmount({ marketData, account, percentage });
//           // const ammount = await getAmmount({ marketData, account, percentage });

//           if (exitFrom) {
//             delete req.body.logs;
//             req.body.ammend = undefined;
//             const parent = await Order.findOne({
//               childrens: { $in: [ObjectId(exitFrom)] },
//             }).populate({ path: "childrens" });
//             const exited = await Promise.all(
//               parent.childrens.map(async (children) => {
//                 const newPer =
//                   Number(children.percentage) - Number(req.body.percentage);
//                 const single = await db.update({
//                   table: Order,
//                   key: {
//                     _id: children._id,
//                     body: { partialExit: true, percentage: newPer, ammount },
//                   },
//                 });
//                 req.body.orderCreated = single.orderCreated;
//                 return single;
//               })
//             );
//             parent.childrens = exited;
//             await ws.emit("partialExit", parent);
//           }

//           if (ammount !== 0) {
//             const log = await genLog("Pending", "Order Created");
//             const order = await db.create({
//               table: Order,
//               key: {
//                 ...req.body,
//                 ammount,
//                 logs: [log],
//                 account: account._id,
//                 populate,
//                 accountType:account.accountType
//               },
//             });
//             orders.push(order);
//           }
//         })
//       );

//       if (!orders.length > 0)
//         return res.status(400).send({ message: "Bad Request" });

//       const ids = orders.map((order) => order._id);
//       const data = { orderType: "parent", childrens: ids };

//       try {
//         const payLoad = { accounts: accounts, order: orders };
//         const response = await axios(`${process.env.BOT_SERVER_URL}/order`, {
//           method: "POST",
//           data: payLoad,
//         });
//         console.log(response?.data?.status);
//         console.log("response",response);
//         const parentOrder = await db.create({
//           table: Order,
//           key: { ...data,status: response?.data?.status, populate: { path: "childrens" } },
//         });
//         res.status(201).send(parentOrder);
//         console.log(response.data);
//         await ws.emit("account", response.data);
//       } catch (err) {
//         console.log(err);
//       }
//     } catch (err) {
//       console.log(err);
//       return res
//         .status(500)
//         .send({ message: err.message || "Internal Server Error" });
//     }
//   };


export const createOrderPartialExit =
    ({ db, ws }) =>
    async (req, res) => {
      try {
        const isValid = Object.keys(req.body).every((key) =>
          createAllowed.has(key)
        );
        // if (!isValid) {
        //   return res.status(400).send({ message: "Bad Request" });
        // }

        const accounts = await db.find({
          table: Account,
          key: { paginate: req.query.paginate === "false" },
        });
        if (!accounts)
          return res
            .status(400)
            .send({ message: "No accounts found for trade" });

        const { marketData, percentage, exitFrom } = req.body;

        let orders = [];
        await Promise.all(
          accounts.map(async (account) => {
            const ammount = exitFrom
              ? await calcAmmount(req.body.ammount, percentage)
              : await getAmmount({ marketData, account, percentage });
            // const ammount = await getAmmount({ marketData, account, percentage });

            if (exitFrom) {
              const exitFroms = [];
              for (const key in req.body.reformattedData) {
                exitFroms.push(...req.body.reformattedData[key].ids);
              }

              if (exitFroms.length > 0) {
                delete req.body.logs;
                req.body.ammend = undefined;

                // Find the parent order based on the exitFroms ID
                const parent = await Order.find({
                  childrens: { $in: exitFroms.map((id) => ObjectId(id)) },
                }).populate({ path: "childrens" });

                // Iterate over each parent order
                parent.forEach(async (parentOrder) => {
                  // Update each child order
                  const exited = await Promise.all(
                    parentOrder.childrens.map(async (children) => {
                      const newPer =
                        Number(children.percentage) -
                        Number(req.body.percentage);
                      const ammount = await calcAmmount(
                        req.body.ammount,
                        percentage
                      ); // Calculate amount for each order separately
                      const single = await db.update({
                        table: Order,
                        key: {
                          _id: children._id,
                          body: {
                            partialExit: true,
                            percentage: newPer,
                            ammount,
                          },
                        },
                      });
                      return single;
                    })
                  );

                  parentOrder.childrens = exited;

                  // Emit event for partial exit
                  await ws.emit("partialExit", parentOrder);
                });
              }
            }

            if (ammount !== 0) {
              const log = await genLog("Pending", "Order Created");
              const order = await db.create({
                table: Order,
                key: {
                  ...req.body,
                  ammount,
                  logs: [log],
                  account: account._id,
                  populate,
                },
              });
              orders.push(order);
            }
          })
        );

        if (!orders.length > 0)
          return res.status(400).send({ message: "Bad Request" });

        const ids = orders.map((order) => order._id);
        const data = { orderType: "parent", childrens: ids };
        const parentOrder = await db.create({
          table: Order,
          key: { ...data, populate: { path: "childrens" } },
        });

        

        try {
          const payLoad = { accounts: accounts, order: orders };
          console.log("payload", payLoad);
          const response = await axios(`${process.env.BOT_SERVER_URL}/order`, {
            method: "POST",
            data: payLoad,
          });
          res.status(201).send(parentOrder);
          await ws.emit("account", response.data);
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
        return res
          .status(500)
          .send({ message: err.message || "Internal Server Error" });
      }
    };

export const getAll =
  ({ db }) =>
  async (req, res) => {
    try {
      let orders = await db.find({
        table: Order,
        key: {
          query: { ...req.query },
          allowedQuery,
          paginate: req.query.paginate === "false",
          populate: { path: "account childrens" },
        },
      });
      if (!orders) return res.status(404).send({ message: "Orders not found" });
      if (req.query.orderType === "parent")
        orders = orders.filter(
          (order) =>
            !order.childrens.some((c) => c.status === "Closed" || c.exitFrom)
        );
      return res.status(200).send(orders);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: err.message || "Internal Server Error" });
    }
  };

export const getAllHistory =
  ({ db }) =>
  async (req, res) => {
    try {
      let orders = await db.find({
        table: Order,
        key: {
          query: { history: true, ...req.query },
          allowedQuery,
          history: req.query.history,
          paginate: req.query.paginate === "false",
          populate: { path: "account childrens" },
        },
      });
      if (!orders) return res.status(404).send({ message: "Orders not found" });
      if (req.query.orderType === "parent")
        orders = orders.filter(
          (order) =>
            !order.childrens.some((c) => c.status === "Closed" || c.exitFrom)
        );
        console.log(orders);
      return res.status(200).send(orders);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: err.message || "Internal Server Error" });
    }
  };

export const wipeHistory =
  ({ db }) =>
  async (req, res) => {
    try {
      console.log(req.query.history);
      if (req.query.history === "false") {
        await db.updateMany({
          table: Order,
          key: { query: {}, update: { history: false } },
        });
      }
      let orders = await db.find({
        table: Order,
        key: {
          query: { history: true, ...req.query },
          allowedQuery,
          paginate: req.query.paginate === "false",
          populate: { path: "account childrens" },
        },
      });
      if (!orders.length)
        return res.status(404).send({ message: "Orders not found" });
      if (req.query.orderType === "parent") {
        orders = orders.filter(
          (order) =>
            !order.childrens.some((c) => c.status === "Closed" || c.exitFrom)
        );
      }
      return res.status(200).send(orders);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: err.message || "Internal Server Error" });
    }
  };

export const updateOrder =
  ({ db, ws }) =>
  async (req, res) => {
    try {
      const { id } = req.params;
      console.log("req.body", req.body);
      const isExist = await db.findOne({ table: Order, key: { _id: id } });
      if (!isExist) return res.status(404).send({ message: "No Order found" });

      const orders = await Order.findOne({
        childrens: { $in: [ObjectId(id)] },
      }).populate({ path: "childrens" });
      if (!orders) {
        return res
          .status(404)
          .send({ message: "No order found with the specified ID" });
      }
      const accounts = await db.find({
        table: Account,
        key: { paginate: req.query.paginate === "true" },
      });

      const order = await Promise.all(
        orders.childrens.map(async (order) => {
          if (
            (req.body.exit === "Partial Exit" || req.body.exit === "Exit") &&
            order.ammend === true
          )
            req.body.ammend = undefined;
          if (req.body.ammend === true && order.exit === "Partial Exit")
            req.body.exit = undefined;
          req.body.placeOrder = false;
          req.body.logs = [
            ...order.logs,
            await genLog("Updated", "Order Updated"),
          ];
          const updated = await db.update({
            table: Order,
            key: { _id: order._id, body: req.body, populate },
          });
          return updated;
        })
      );

      orders.childrens = order;

      try {
        const payLoad = { accounts, order };
        const response = await axios(`${process.env.BOT_SERVER_URL}/order`, {
          method: "POST",
          data: payLoad,
        });
        console.log(response);
        const updated = await db.update({
          table: Order,
          key: { _id: order._id, status : response?.data?.status, body: req.body, populate },
        });
        res.status(200).send(orders);
        ws.emit("account", response.data);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: err.message || "Internal Server Error" });
    }
  };
  export const updateTradeMultiplePartialExit =
    ({ db, ws }) =>
    async (req, res) => {
      const reformattedData = req.body.reformattedData;
      const tradeIds = [];
      const idsArray = [];
      console.log(reformattedData);

      for (const key in reformattedData) {
        if (reformattedData.hasOwnProperty(key)) {
          const element = reformattedData[key];
          tradeIds.push(...element.tradeIds);
          idsArray.push(...element.ids);
        }
      }
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
          table: Order,
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
              table: Order,
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
          const response = await axios(`${process.env.BOT_SERVER_URL}/order`, {
            method: "POST",
            data: payLoad,
          });
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
        table: Order,
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
          req.body.logs = [
            ...orderDoc.logs,
            await genLog("Updated", "Order Updated"),
          ];
          const updateBody = { ...req.body, orderId: idsArrayString,tradeIdArray : tradeIdstring, reformattedData: reformattedData, placeOrder: false};
          // Assuming there's only one child in each order
          const order = orderDoc;
          // if (req.body.exit === "Partial Exit" && order.ammend === true)
          //   req.body.ammend = undefined;
          if (req.body.exit === "Exit") req.body.ammend = undefined;
          // if (req.body.ammend === true && order.exit === "Partial Exit")
          //   req.body.exit = undefined;
          req.body.placeOrder = false;
          
          return db.update({
            table: Order,
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
        const response = await axios(`${process.env.BOT_SERVER_URL}/order`, {
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
    const idsArray = req.body.orderIds; // Initialization
    const sumOfAmounts = req.body.sumOfAmounts;
    console.log(idsArray);
    try {
      const idsArrayString = JSON.stringify(idsArray);
      console.log(idsArrayString);

      // Validate IDs
      // if (
      //   !idsArray ||
      //   !Array.isArray(idsArray) ||
      //   idsArray.some((id) => typeof id !== "string" || !ObjectId.isValid(id))
      // ) {
      //   return res.status(400).send({ message: "Invalid IDs provided" });
      // }

      const orders = await db.find({
        table: Order,
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
            table: Order,
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
      res.status(200).send({ updated: updatedData, orders });

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
        ws.emit("account", response.data);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  };


// export const updateOrderMultiple =
//   ({ db, ws }) =>
//   async (req, res) => {
//     try {
//       const {
//         orderIds,
//         accountIds,
//         atPrice,
//         pointsAway,
//         limitPointsAway,
//         ammend,
//       } = req.body;

//       // Check if orderIds and accountIds arrays have the same length
//       if (orderIds.length !== accountIds.length) {
//         return res.status(400).send({
//           message: "OrderIds and AccountIds arrays must have the same length",
//         });
//       }

//       const updatedOrders = [];

//       for (let i = 0; i < orderIds.length; i++) {
//         const orderId = orderIds[i];
//         const accountId = accountIds[i];

//         console.log("Updating order with ID:", orderId);

//         // Find the order
//         const order = await db.findOne({ table: Order, key: { _id: orderId } });
//         if (!order) {
//           return res
//             .status(404)
//             .send({ message: `No Order found with ID: ${orderId}` });
//         }

//         // Update the order
//         const updatedOrder = await Order.findByIdAndUpdate(orderId, {
//           $set: {
//             atPrice,
//             pointsAway,
//             limitPointsAway,
//             ammend,
//             idsArray: orderIds.join(','),
//           },
//           new: true, // Return the updated document
//         });

//         updatedOrders.push(updatedOrder);
//       }
//       // orders.childrens = order;
//       const firstUpdatedOrder = updatedOrders[0];
//       res.status(200).send(firstUpdatedOrder);

//       try {
//         const accounts = await db.find({
//           table: Account,
//           key: { paginate: req.query.paginate === "true" },
//         });
//         const payLoad = { accounts, order: firstUpdatedOrder };
//         const response = await axios.post(
//           `${process.env.BOT_SERVER_URL}/order`,
//           payLoad
//         );
//         ws.emit("account", response.data);
//       } catch (err) {
//         console.log("Error emitting WebSocket event:", err);
//       }
//     } catch (err) {
//       console.log("Error updating orders:", err);
//       return res
//         .status(500)
//         .send({ message: err.message || "Internal Server Error" });
//     }
//   };

// export const updateOrderMultiple =
// ({ db, ws }) =>
// async (req, res) => {
//   try {
//     res.json({ message: "Trades updated successfully" });
//   } catch (error) {
//     // Handle any errors that occur during the process
//     console.error("Error updating trades:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const closeOrder =
  ({ db }) =>
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).send({ message: "Invalid Request" });
      const trade = await Order.findOne({
        childrens: { $in: [ObjectId(id)] },
      }).populate({ path: "childrens" });
      if (!trade) return res.status(404).send({ message: "No order found" });
      const childs = await Promise.all(
        trade.childrens.map(async (children) => {
          const logs = [
            ...children.logs,
            await genLog("Closed", "Order Closed"),
          ];
          const updated = await db.update({
            table: Order,
            key: { _id: children._id, body: { status: "Closed", logs } },
          });
          return updated;
        })
      );
      trade.childrens = childs;
      return res.status(200).send(trade);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Something went wrong" });
    }
  };

export const manageOrder =
  ({ db, ws }) =>
  async (req, res) => {
    try {
      const {
        status,
        orderCreated,
        openPrice,
        id,
        message,
        tradeId,
        idsArray,
        reformattedData
      } = req.body;
      console.log(req.body);

      // Check if idsArray is defined
      if (idsArray) {
        const ids = JSON.parse(idsArray); // Parse idsArray string to array
        // Update all orders specified by the IDs in idsArray
        for (const orderId of ids) {
          const order = await db.findOne({
            table: Order,
            key: { _id: orderId, populate },
          });
          if (!order)
            return res
              .status(404)
              .send({ message: `Order with ID ${orderId} not found` });
          order.status = status;
          order.orderCreated = orderCreated;
          order.openPrice = openPrice;
          order.tradeId = tradeId;
          order.reformattedData = null
          order.logs = [...order.logs, await genLog(status, message)];
          await db.save(order);
          ws.emit("order", {
            order,
            message: `Order has been ${status} from account ${order.account.email}`,
          });
        }
        return res.status(200).send({ message: "Orders updated successfully" });
      } else {
        // Update the order specified by the id property
        const order = await db.findOne({
          table: Order,
          key: { _id: id, populate },
        });
        if (!order) return res.status(404).send({ message: "Order not found" });
        order.status = status;
        order.orderCreated = orderCreated;
        order.openPrice = openPrice;
        order.tradeId = tradeId;
        order.reformattedData = null
        order.logs = [...order.logs, await genLog(status, message)];
        await db.save(order);
        ws.emit("order", {
          order,
          message: `Order has been ${status} from account ${order.account.email}`,
        });
        return res.status(200).send(order);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Something went wrong" });
    }
  };
