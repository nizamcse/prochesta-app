const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  transactionDate: {
    type: Date,
    required: true,
    default: new Date("01-01-1970"),
  },
  installmentDate: {
    type: Date,
    required: true,
    default: new Date("01-01-1970"),
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  installmentAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loan",
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
