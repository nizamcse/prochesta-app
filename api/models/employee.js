const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    minlength: [3, "Center name should be minimum 3 character."],
  },
  phone: {
    type: String,
    minlength: [3, "Center name should be minimum 3 character."],
  },
  nid: {
    type: String,
    minlength: [3, "Center name should be minimum 3 character."],
  },
  dob: {
    type: Date,
    required: true,
    default: new Date("01-01-1970"),
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  status: {
    type: String,
    enum: ["DRAFTED", "UNDER REVIEW", "APPROVED"],
    required: true,
    default: "DRAFTED",
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
