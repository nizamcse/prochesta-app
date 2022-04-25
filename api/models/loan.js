const mongoose = require("mongoose");

const loanSchema = mongoose.Schema(
  {
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
    granter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Center",
      required: true,
    },
    granterRelation: {
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
        "HUSBAND",
        "WIFE",
      ],
      required: true,
      default: "USER",
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
        "HUSBAND",
        "WIFE",
      ],
      required: true,
    },
    installmentType: {
      type: String,
      enum: ["DAILY", "WEEKLY", "MONTHLY"],
      required: true,
    },
    loanDuration: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    serviceCharge: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
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
    disbursementDate: {
      type: Date,
      required: true,
      default: new Date("01-01-1970"),
    },
    currentInstallmentDate: {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loan", loanSchema);
