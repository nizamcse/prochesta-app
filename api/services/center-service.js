const mongoose = require("mongoose");
const Center = require("../models/center");

const { ObjectId } = mongoose.Types;
const getAllCenters = (q, s, l) => {
  if (q) {
    return Center.aggregate([
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
  return Center.aggregate([
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
const getTotalMatch = (q) =>
  Center.aggregate([
    { $match: { name: { $regex: q, $options: "i" } } },
    { $count: "total" },
  ]);

const matchedRecords = (q) =>
  Center.aggregate([{ $match: { name: q } }, { $count: "total" }]);

const doesItExist = async (req, comparer = 0) => {
  const { name } = req.body;
  const total = await matchedRecords(name);
  const { total: count } = total[0] ? total[0] : { total: 0 };
  return count > comparer;
};

const storeCenter = (data) => {
  const branch = new Center(data);
  return branch.save();
};

const updateOneCenter = (id, data) =>
  Center.updateOne({ _id: id }, { ...data });

const getById = (id) => Center.findById(id);

const deleteCenter = (id) => Center.remove({ _id: id });

const findById = async (id) =>
  Center.aggregate([
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
  getAllCenters,
  storeCenter,
  findById,
  doesItExist,
  updateOneCenter,
  getById,
  deleteCenter,
};
