const mongoose = require("mongoose");

const installmentSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    loan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: true,
    },
    amount: {
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
    installmentDate: {
      type: Date,
      required: true,
      default: new Date("01-01-1970"),
    },
    collectedDate: {
      type: Date,
      required: true,
      default: new Date(),
    },
    isLate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Installment", installmentSchema);
