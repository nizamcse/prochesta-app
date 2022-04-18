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
    const query = req.query.search || "";
    const totalMatch = await getTotalMatch(query);
    const employeees = await getAllEmployees(query, skip, limit);
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
    const u = await createUser(
      req.body.name,
      req.body.email,
      req.body.password
    );
    if (u) {
      const employee = await storeEmployee(data);
      console.log("Employee", employee);
      const getEmployee = await findById(employee._id);
      return res.status(200).json({
        results: getEmployee || null,
        message: "Successfully created employee",
      });
    }
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
      results: employee,
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
