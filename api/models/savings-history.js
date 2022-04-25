const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
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
  transactionType: {
    type: String,
    enum: ["IN", "OUT"],
    required: true,
  },
  clientType: {
    type: String,
    enum: ["CLIENT", "NOMINEE"],
    required: true,
  },
  savings: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Saving",
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

module.exports = mongoose.model("Loan", historySchema);
