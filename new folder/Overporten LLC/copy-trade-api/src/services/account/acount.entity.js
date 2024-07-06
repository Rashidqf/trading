import axios from "axios";
import Account from "./acount.schema";
import { processCSVFile } from "../../utils/processCSVFile";
import { processCSVFileAccount } from "../../utils/processCSVFileAccount";

// allowed fields for creatign a new account
const CREATE_ALLOWED = new Set([
  "accountId",
  "u",
  "accountType",
  "email",
  "password",
]);

// allowed field for upating the existing account
const UPDATE_ALLOWED = new Set([
  "accountId",
  "percentage",
  "accountType",
  "email",
  "password",
]);

// allowed query
const allowedQuery = new Set(["id", "email", "page"]);

/**
 * Create a new account.
 * @param {Object} options - The options object..
 * @param {Object} options.db - The database instance for performing create operation.
 * @returns {Function} - Express middleware function to handle the user request.
 */
export const createNew =
  ({ db }) =>
  async (req, res) => {
    try {
      if (!req.body.accountId || !req.body.password)
        return res.status(400).send({ message: "Account Id is required" });
      const isValid = Object.keys(req.body).every((key) =>
        CREATE_ALLOWED.has(key)
      );
      if (!isValid) return res.status(400).send({ message: "Bad Request" });
      const account = await db.create({ table: Account, key: req.body });
      res.status(200).send(account);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  };

  export const createNewAccountwithCSV =
  ({ db, ws }) =>
  async (req, res) => {
    try {
      if (!req?.files?.docs?.path)
        return res.status(400).send({ message: "Bad Request" });

      const doc = await processCSVFileAccount(req.files.docs.path);
      console.log("doc",doc);

      if (!doc.length > 0)
        return res.status(400).send({ message: "Unable to read CSV File" });

      const users = doc.map((row) => ({
        email: row.Username,
        accountId: row.AccountId,
        password: row.password,
      }));
      console.log(users);

      const account = await Account.insertMany(users);
      ws.emit("account", account);
      res.status(200).send({ message: "Accounts created successfully" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  };


/**
 * Update account data from a CSV file.
 * @function updateFromCSV
 * @param {Object} options - The options object.
 * @param {Object} options.db - The database instance to perform operations on.
 * @param {Object} req - The request object containing the CSV file.
 * @param {Object} res - The response object to send the result.
 * @returns {Promise<void>} - A Promise that resolves once the update is completed or rejects on error.
 * @throws {Error} Will throw an error if there's an issue processing the CSV file or updating the data.
 */
export const updateFromCSV =
  ({ db }) =>
  async (req, res) => {
    try {
      if (!req?.files?.docs?.path)
        return res.status(400).send({ message: "Bad Request" });
      // read the data from the csv file
      const doc = await processCSVFile(req.files.docs.path);
      console.log("doc", doc);
      if (!doc.length > 0)
        return res.status(400).send({ message: "Unable to read CSV File" });
      // iterate over the total docs
      const emails = doc.map((d) => d.email).filter(Boolean);
      const U = doc.map((d) => d.U).filter(Boolean);
      const accounts = await db.find({
        table: Account,
        key: {
          query: { email: { $in: emails } },
          allowedQuery,
          paginate: req.query.paginate === "true",
        },
      });
      let results = doc.map((d) => {
        // finding if the account exists or not
        const existingAcc = accounts.find((a) => a.email === d.email);
        // if not exists then return to the next operation
        if (!existingAcc) return;
        // if the account conatains account Id then updaate
        if (d.accountId) {
          existingAcc.accountId = d.accountId;
        }
        if (d.u) {
          existingAcc.u = d.u;
        }

        // iterate over the percentages of the data
        // for (const newPer of d.percentage) {
        //   const existingPercIndex = existingAcc.percentage.findIndex((p) => p.itemName === newPer.itemName);
        //   // if the percentage already exists then replace it with new data
        //   if (existingPercIndex !== -1) {
        //     // replacing the existing percentage
        //     existingAcc.percentage[existingPercIndex] = newPer;
        //   }
        //   else {
        //     // if not exist then push the new data to the percentage array
        //     existingAcc.percentage.push(newPer);
        //   }
        // }
        return existingAcc;
      });
      // filter out the falsy values
      results = results.filter(Boolean);
      console.log(results);
      // preparting the bulk write array with operations
      const operations = results.map((r) => ({
        updateOne: { filter: { email: r.email }, update: { u: r.u } },
      }));
      await Account.bulkWrite(operations);
      return res.status(200).send(results);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  };

/**
 * Update an existing account.
 * @param {Object} options - Options for account update.
 * @param {Object} options.db - The database instance for performing the account update operation.
 * @returns {Function} - Express middleware function to handle the account update request.
 */
export const updateAccount =
  ({ db }) =>
  async (req, res) => {
    try {
      // 1. Input Validation & Security Checks
      const isValid = Object.keys(req.body).every((key) =>
        UPDATE_ALLOWED.has(key)
      );
      if (!isValid) {
        return res.status(400).send({ message: "Bad Request: Invalid update fields" });
      }

      // 2. Retrieve Account (Handles Missing Account)
      const accountId = req.params.id; // Assuming ID is in params
      let accountToUpdate;
      try {
        accountToUpdate = await db.findOne({ table: Account, key: { _id: accountId } });
      } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal server error (retrieval)" });
      }

      if (!accountToUpdate) {
        return res.status(404).send({ message: "Account not found" });
      }

      // 3. Handle Primary Account Update Request
      if (req.body.accountType === "Primary") {
        try {
          // 3.1 Fetch All Accounts (Consider Pagination if necessary)
          const allAccounts = await Account.find();

          // 3.2 Check for Existing Primary Account (Optional)
          const existingPrimary = allAccounts.find(
            (account) => account.accountType === "Primary"
          );
          if (existingPrimary && existingPrimary._id !== accountId) {
            return res.status(403).send({
              message: "Another account is already set as primary",
            });
          }

          // 3.3 Update Account (Optimized)
          await db.update({
            table: Account,
            key: { _id: req.params.id, body: req.body },
          });

          // 3.4 Retrieve Updated Account (Optional)
          const updatedAccount = await db.findOne({ table: Account, key: { _id: accountId } });
          return res.status(200).send(updatedAccount || accountToUpdate); // Send updated or original account
        } catch (error) {
          console.error(error);
          return res.status(500).send({ message: "Internal server error (update primary)" });
        }
      } else {
        // 4. Update Account (Standard)
        try {
          await db.update({
            table: Account,
            key: { _id: req.params.id, body: req.body },
          });

          // Retrieve Updated Account (Optional)
          const updatedAccount = await db.findOne({ table: Account, key: { _id: accountId } });
          return res.status(200).send(updatedAccount || accountToUpdate); // Send updated or original account
        } catch (error) {
          console.error(error);
          return res.status(500).send({ message: "Internal server error (update standard)" });
        }
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "Something went wrong" });
    }
  };


/**
 * Remove an existing account.
 * @param {Object} options - Options for getting all accounts.
 * @param {Object} options.db - The database instance for performing the account finding operation.
 * @returns {Function} - Express middleware function to handle getting all the accounts request.
 */
export const getAll =
  ({ db }) =>
  async (req, res) => {
    try {
      const accounts = await db.find({
        table: Account,
        key: { query: { ...req.query }, allowedQuery },
      });
      res.status(200).send(accounts);
    } catch (err) {
      console.log(err);
    }
  };

export const sendAll =
  ({ db }) =>
  async (req, res) => {
    try {
      const accounts = await db.find({ table: Account, key: {} });
      if (!accounts) return res.status(404).send({ message: "Not Found" });
      try {
        await axios(`${process.env.BOT_SERVER_URL}/accounts`, {
          method: "POST",
          data: accounts,
        });
      } catch (err) {
        console.log(err);
      }
      res.status(200).send({ message: "OK" });
    } catch (err) {
      console.log(err);
    }
  };

/**
 * Remove an existing account.
 * @param {Object} options - Options for account remove.
 * @param {Object} options.db - The database instance for performing the account remove operation.
 * @returns {Function} - Express middleware function to handle the account remove request.
 */
export const removeAccount =
  ({ db }) =>
  async (req, res) => {
    try {
      const reqAccount = await db.findOne({
        table: Account,
        key: { _id: req.params.id },
      });
      if (!reqAccount)
        return res.status(400).send({ message: "Account not found" });
      await db.remove({ table: Account, key: { _id: req.params.id } });
      res.status(200).send({ success: true });
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  };

export const manageAccount =
  ({ ws }) =>
  async (req, res) => {
    try {
      if (req.body.status) ws.emit("account", req.body);
      res.status(200).send({ status: "Status Received" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Somthing Went Wrong" });
    }
  };
