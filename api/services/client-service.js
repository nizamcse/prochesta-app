const mongoose = require("mongoose");
const Client = require("../models/client");

const { ObjectId } = mongoose.Types;
const getAllClients = (q, s, l) => {
  if (q) {
    return Client.aggregate([
      { $match: { branch: ObjectId(q) } },
      {
        $lookup: {
          from: "centers",
          localField: "center",
          foreignField: "_id",
          as: "center",
        },
      },
      {
        $unwind: {
          path: "$center",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "center.branch",
        },
      },
      {
        $unwind: {
          path: "$center.branch",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $skip: s },
      { $limit: l },
    ]);
  }
  return Client.aggregate([
    {
      $lookup: {
        from: "centers",
        localField: "center",
        foreignField: "_id",
        as: "center",
      },
    },
    {
      $unwind: {
        path: "$center",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "center.branch",
      },
    },
    {
      $unwind: {
        path: "$center.branch",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $skip: s },
    { $limit: l },
  ]);
};
const getTotalMatch = (q) => {
  if (q) {
    return Client.aggregate([
      { $match: { branch: ObjectId(q) } },
      { $count: "total" },
    ]);
  }
  return Client.aggregate([{ $count: "total" }]);
};

const storeClient = (data) => {
  const client = new Client(data);
  return client.save();
};

const updateOneClient = (id, data) =>
  Client.updateOne({ _id: id }, { ...data });

const getById = (id) => Client.findById(id);

const deleteClient = (id) => Client.remove({ _id: id });

const findById = async (id) =>
  Client.aggregate([
    { $match: { _id: ObjectId(id) } },
    {
      $lookup: {
        from: "centers",
        localField: "center",
        foreignField: "_id",
        as: "center",
      },
    },
    {
      $unwind: {
        path: "$center",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "center.branch",
      },
    },
    {
      $unwind: {
        path: "$center.branch",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

const search = async (q) =>
  Client.aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: `${q}`, $options: "i" } },
          { nid: { $regex: `${q}`, $options: "i" } },
          { phone: { $regex: `${q}`, $options: "i" } },
        ],
      },
    },
    {
      $lookup: {
        from: "centers",
        localField: "center",
        foreignField: "_id",
        as: "center",
      },
    },
    {
      $unwind: {
        path: "$center",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "center.branch",
      },
    },
    {
      $unwind: {
        path: "$center.branch",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

module.exports = {
  getTotalMatch,
  getAllClients,
  storeClient,
  findById,
  updateOneClient,
  getById,
  deleteClient,
  search,
};
