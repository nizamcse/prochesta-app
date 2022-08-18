const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const userSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match:
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true },
    type: {
      type: String,
      enum: ['ADMIN', 'MANAGER', 'FIELD WORKER'],
      required: true,
      default: 'FIELD WORKER'
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    centers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Center' }],
    branches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }]
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(saltRounds, (err) => {
      if (err) {
        return next(err);
      }
      // eslint-disable-next-line no-shadow
      bcrypt.hash(user.password, saltRounds, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (passw, cb) {
  console.log(passw, this);
  bcrypt.compare(passw, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);
