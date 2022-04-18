const Employee = require("../models/employee");

const getAllEmployees = (q, s, l) =>
  Employee.aggregate([
    { $match: { name: { $regex: q, $options: "i" } } },
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
const getTotalMatch = (q) =>
  Employee.aggregate([
    { $match: { name: { $regex: q, $options: "i" } } },
    { $count: "total" },
  ]);

const storeEmployee = (data) => {
  const employee = new Employee(data);
  return employee.save();
};

const updateOneEmployee = (id, data) =>
  Employee.updateOne({ _id: id }, { ...data });

const getById = (id) => Employee.findById(id);

const deleteEmployee = (id) => Employee.remove({ _id: id });

const findById = (id) => Employee.findById(id);

module.exports = {
  getTotalMatch,
  getAllEmployees,
  storeEmployee,
  findById,
  updateOneEmployee,
  getById,
  deleteEmployee,
};
