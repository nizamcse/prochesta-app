const Branch = require("../models/branch");

const getAllBranches = (q, s, l) =>
  Branch.aggregate([
    { $match: { name: { $regex: q, $options: "i" } } },
    { $skip: s },
    { $limit: l },
  ]);
const getTotalMatch = (q) =>
  Branch.aggregate([
    { $match: { name: { $regex: q, $options: "i" } } },
    { $count: "total" },
  ]);

const matchedRecords = (q) =>
  Branch.aggregate([{ $match: { name: q } }, { $count: "total" }]);

const doesItExist = async (req, comparer = 0) => {
  const { name } = req.body;
  const total = await matchedRecords(name);
  const { total: count } = total[0] ? total[0] : { total: 0 };
  return count > comparer;
};

const storeBranch = (data) => {
  const branch = new Branch(data);
  return branch.save();
};

const updateOneBranch = (id, data) =>
  Branch.updateOne({ _id: id }, { ...data });

const getById = (id) => Branch.findById(id);

const deleteBranch = (id) => Branch.remove({ _id: id });

const findById = (id) => Branch.findById(id);

module.exports = {
  getTotalMatch,
  getAllBranches,
  storeBranch,
  findById,
  doesItExist,
  updateOneBranch,
  getById,
  deleteBranch,
};
