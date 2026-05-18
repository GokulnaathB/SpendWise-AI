const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nameOfTheExpense: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expense", expenseSchema);
