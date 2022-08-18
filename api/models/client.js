const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    minlength: [3, 'Center name should be minimum 3 character.']
  },
  father_name: {
    type: String,
    minlength: [3, 'Center name should be minimum 3 character.']
  },
  mother_name: {
    type: String,
    minlength: [3, 'Center name should be minimum 3 character.']
  },
  present_address: {
    city: { type: String },
    word: { type: String },
    local_area: { type: String },
    holding_no: { type: String }
  },
  permanent_address: {
    city: { type: String },
    word: { type: String },
    local_area: { type: String },
    holding_no: { type: String }
  },
  nid: {
    type: String,
    minlength: [3, 'Center name should be minimum 3 character.']
  },
  dob: {
    type: Date,
    required: true,
    default: new Date('01-01-1970')
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true
  },
  avatar: {
    type: mongoose.Schema.Types.String,
    required: false
  },
  phone: {
    type: String,
    minlength: [3, 'Center name should be minimum 3 character.']
  }
});

module.exports = mongoose.model('Client', clientSchema);
