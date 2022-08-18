const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/login', (req, res) => {
  User.findOne(
    {
      email: req.body.email
    },
    (err, user) => {
      if (err) throw err;
      if (!user) {
        res.status(403).send({
          success: false,
          msg: 'Authentication Failed, User not found',
          u: req.body.email
        });
      } else {
        // eslint-disable-next-line no-shadow
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (isMatch && !err) {
            const token = jwt.sign(
              {
                name: user.name,
                email: user.email,
                // eslint-disable-next-line no-underscore-dangle
                _id: user._id
              },
              process.env.JWT_SECRET,
              {
                expiresIn: 60 * 60 * 24 * 30
              }
            );
            return res.status(200).json({
              message: 'Login successfull',
              token
            });
          }
          console.log('isMatch', isMatch, 'error', err);
          return res.status(403).json({
            success: false,
            msg: 'Authentication failed, wrong password'
          });
        });
      }
    }
  );
});

module.exports = router;
