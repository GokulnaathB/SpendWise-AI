require("dotenv").config();

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {
  createUser,
  login,
  addExpense,
  fetchExpenses,
  fetchExpense,
  editExpense,
  deleteExpense,
  addBudget,
  updateBudget,
  getBudget,
  getTotal,
  visualize,
  analyzeMonthly,
  analyzeYearly,
  getYearly,
  getMonthly,
} = require("./mongoose");
const checkAuth = require("./middleware/checkAuth");

app.use(express.json());
// express.json() middleware:
// -Reads the request body
// -Converts JSON → JavaScript object
// -Attaches it to req.body

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.post("/signup", createUser);

app.post("/login", login);

const router = express.Router();
router.use(checkAuth);

router.post("/expenses/add", addExpense);

router.get("/expenses", fetchExpenses);

router.post("/fetchExpense", fetchExpense);

router.patch("/editExpense", editExpense);

router.delete("/deleteExpense", deleteExpense);

router.post("/addBudget", addBudget);

router.patch("/updateBudget", updateBudget);

router.post("/getBudget", getBudget);

router.post("/getTotal", getTotal);

router.post("/visualize", visualize);

router.post("/analyzeMonthly", analyzeMonthly);

router.post("/analyzeYearly", analyzeYearly);

router.post("/getYearly", getYearly);
router.post("/getMonthly", getMonthly);

app.use("/", router);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cbksjqx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log("Connection failed!", err);
  });
