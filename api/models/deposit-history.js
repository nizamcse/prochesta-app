const mongoose = require("mongoose");

const depositHistorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  transactionDate: {
    type: Date,
    required: true,
    default: new Date("01-01-1970"),
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  clientType: {
    type: String,
    enum: ["CLIENT", "NOMINEE"],
    required: true,
  },
  deposit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deposit",
    required: true,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  status: {
    type: String,
    enum: ["APPROVED", "UNDERREVIEW"],
    required: true,
  },
});

module.exports = mongoose.model("DepositHistory", depositHistorySchema);
