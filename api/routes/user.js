const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      users
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const users = await User.find({ email: req.body.email });
    if (users.length > 0) {
      return res.status(409).json({
        message: 'User already exist'
      });
    }
    const newUser = new User({
      _id: mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      employee: req.body.employee
    });
    await newUser.save();
    res.status(201).json({
      message: 'Successfully created user.'
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
});

router.post('/attach-branches/:userId', async (req, res) => {
  try {
    const ids = req.body.branchIds || [];
    const { userId } = req.params;
    if (Array.isArray(ids)) {
      const objectIds = ids.map((id) => mongoose.Types.ObjectId(id));
      const user = await User.updateOne({ _id: userId }, { $set: { branches: objectIds } });
      res.status(200).json({ user });
    } else {
      res.status(500).json({
        error: 'Payload should be array of branch id.'
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
});

router.post('/attach-centers/:userId', async (req, res) => {
  try {
    const ids = req.body.centerIds || [];
    const { userId } = req.params;
    if (Array.isArray(ids)) {
      const objectIds = ids.map((id) => mongoose.Types.ObjectId(id));
      const user = await User.updateOne({ _id: userId }, { $set: { centers: objectIds } });
      res.status(200).json({ user });
    } else {
      res.status(500).json({
        error: 'Payload should be array of branch id.'
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
});

router.delete('/:userId', (req, res) => {
  User.remove({ _id: req.params.id })
    .exec()
    .then(() =>
      res.status(200).json({
        message: 'User has been deleted'
      })
    )
    .catch((err) =>
      res.status(500).json({
        error: err
      })
    );
});

module.exports = router;

// openssl rand -base64 64 Hello
