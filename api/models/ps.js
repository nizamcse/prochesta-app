const mongoose = require("mongoose");

const pensionSchema = mongoose.Schema({
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
  installmentType: {
    type: String,
    enum: ["DAILY", "WEEKLY", "MONTHLY"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  totalInstallment: {
    type: Number,
    required: true,
    default: 0,
  },
  installmentAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPaid: {
    type: Number,
    required: true,
    default: 0,
  },
  totalDue: {
    type: Number,
    required: true,
    default: 0,
  },
  runningInstallment: {
    type: Number,
    required: true,
    default: 0,
  },
  installmentReceived: {
    type: Number,
    required: true,
    default: 0,
  },
  installmentShortage: {
    type: Number,
    required: true,
    default: 0,
  },
  billingCycle: {
    type: Number,
    required: true,
    default: 0,
  },
  psDuration: {
    type: Number,
    required: true,
    default: 0,
  },
  nextInstallmentDate: {
    type: Date,
    required: true,
    default: new Date("01-01-1970"),
  },
  status: {
    type: String,
    enum: ["DRAFTED", "UNDER REVIEW", "APPROVED", "DISBURSED"],
    required: true,
    default: "DRAFTED",
  },
});

module.exports = mongoose.model("PensionScheme", pensionSchema);
