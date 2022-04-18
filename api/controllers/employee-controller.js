/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");
const {
  getAllEmployees,
  getTotalMatch,
  storeEmployee,
  findById,
  deleteEmployee,
  updateOneEmployee,
} = require("../services/employee-service");
const User = require("../models/user");

const index = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 1000;
    const skip = parseInt(req.query.offset, 10) || 0;
    const branch = req.query.branch || "";
    const totalMatch = await getTotalMatch(branch);
    const employeees = await getAllEmployees(branch, skip, limit);
    return res.status(200).json({
      results: employeees,
      total: totalMatch[0] && totalMatch[0].total ? totalMatch[0].total : 0,
    });
  } catch (e) {
    return res.status(500).json(e);
  }
};

const createUser = async (name, email, password) =>
  new Promise((resolve, reject) => {
    User.findOne({ email })
      .then((user) => {
        if (user) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject("User already exist");
        }
        const newUser = new User({
          _id: mongoose.Types.ObjectId(),
          name,
          email,
          password,
        });
        newUser
          .save()
          .then(() => {
            resolve("Successfully created user");
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
const store = async (req, res) => {
  const data = {
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    branch: req.body.branch,
    email: req.body.email,
    phone: req.body.phone,
    nid: req.body.nid,
  };
  try {
    const employee = await storeEmployee(data);
    const getEmployee = await findById(employee._id);
    return res.status(200).json({
      results: getEmployee[0] || null,
      message: "Successfully created employee",
    });
  } catch (e) {
    return res.status(500).json({
      message: e,
    });
  }
};

const updateOne = async (req, res) => {
  const data = {
    name: req.body.name,
    branch: req.body.branch,
    email: req.body.email,
    phone: req.body.phone,
    nid: req.body.nid,
  };
  const { id } = req.params;
  try {
    await updateOneEmployee(id, data);
    const employee = await findById(id);
    return res.status(200).json({
      results: employee[0] || {},
      message: "Successfully updated employee",
      _id: id,
    });
  } catch (e) {
    if (e.message.indexOf("duplicate key error") !== -1)
      return res.status(409).json({
        message: "Validation failed.",
        errors: [{ name: `"${data.name}" Already exist.` }],
      });
    const errors = [];
    if (e.errors) {
      const keys = Object.keys(e.errors || {});
      for (let i = 0; i < keys.length; i += 1) {
        errors.push({ [keys[i]]: e.errors[keys[i]].message });
      }
    }
    if (errors.length)
      return res.status(400).json({
        message: "Validation failed.",
        errors,
      });

    return res.status(500).json({
      message: e.message,
    });
  }
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteEmployee(id);
    if (result.deletedCount === 0)
      return res.status(200).json({
        message: "Record could not found.",
        results: result,
      });
    return res.status(200).json({
      message: "Employee deleted successfully",
      results: result,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await findById(id);
    return res.status(200).json({
      results: employee,
    });
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

module.exports = { index, store, updateOne, deleteOne, findOne };
