const mongoose = require("mongoose");
const Employee = require("../models/employee");

const { ObjectId } = mongoose.Types;
const getAllEmployees = (q, s, l) => {
  if (q) {
    return Employee.aggregate([
      { $match: { branch: ObjectId(q) } },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branch",
        },
      },
      { $unwind: "$branch" },
      { $skip: s },
      { $limit: l },
    ]);
  }
  return Employee.aggregate([
    {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "branch",
      },
    },
    { $unwind: "$branch" },
    { $skip: s },
    { $limit: l },
  ]);
};
const getTotalMatch = (q) => {
  if (q) {
    return Employee.aggregate([
      { $match: { branch: ObjectId(q) } },
      { $count: "total" },
    ]);
  }
  return Employee.aggregate([{ $count: "total" }]);
};

const storeEmployee = (data) => {
  const employee = new Employee(data);
  return employee.save();
};

const updateOneEmployee = (id, data) =>
  Employee.updateOne({ _id: id }, { ...data });

const getById = (id) => Employee.findById(id);

const deleteEmployee = (id) => Employee.remove({ _id: id });

const findById = async (id) =>
  Employee.aggregate([
    { $match: { _id: ObjectId(id) } },
    {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "branch",
      },
    },
    { $unwind: "$branch" },
  ]);

module.exports = {
  getTotalMatch,
  getAllEmployees,
  storeEmployee,
  findById,
  updateOneEmployee,
  getById,
  deleteEmployee,
};
