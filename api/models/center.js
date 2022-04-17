const mongoose = require("mongoose");

const centerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    minlength: [3, "Center name should be minimum 3 character."],
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
});

module.exports = mongoose.model("Center", centerSchema);
