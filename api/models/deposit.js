const mongoose = require("mongoose");

const depositSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  nominee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Center",
    required: true,
  },
  nomineeRelation: {
    type: String,
    enum: [
      "FATHER",
      "MOTHER",
      "UNCLE",
      "AUNT",
      "BROTHER",
      "NEPHEW",
      "SON",
      "COLLEAGUE",
    ],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  interest: {
    type: Number,
    required: true,
    default: 0,
  },
  interestAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  openingDate: {
    type: Date,
    required: true,
    default: new Date("01-01-1970"),
  },
  billingCycle: {
    type: Number,
    required: true,
    min: 1,
    max: 31,
  },
  status: {
    type: String,
    enum: ["DRAFTED", "UNDER REVIEW", "APPROVED", "DISBURSED"],
    required: true,
    default: "DRAFTED",
  },
});

module.exports = mongoose.model("Deposit", depositSchema);
