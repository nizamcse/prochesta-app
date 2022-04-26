const mongoose = require("mongoose");
const Saving = require("../models/saving");
const Client = require("../models/client");

const { ObjectId } = mongoose.Types;
const getAllSavings = (q, s, l) => {
  if (q) {
    return Saving.aggregate([
      { $match: { branch: ObjectId(q) } },
      {
        $lookup: {
          from: "clients",
          localField: "client",
          foreignField: "_id",
          as: "client",
        },
      },
      {
        $unwind: {
          path: "$client",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "nominee",
          foreignField: "_id",
          as: "nominee",
        },
      },
      {
        $unwind: {
          path: "$nominee",
          preserveNullAndEmptyArrays: true,
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
      { $skip: s },
      { $limit: l },
    ]);
  }
  return Saving.aggregate([
    {
      $lookup: {
        from: "clients",
        localField: "client",
        foreignField: "_id",
        as: "client",
      },
    },
    {
      $unwind: {
        path: "$client",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "centers",
        localField: "client.center",
        foreignField: "_id",
        as: "client.center",
      },
    },
    {
      $unwind: {
        path: "$client.center",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "client.center.branch",
        foreignField: "_id",
        as: "client.center.branch",
      },
    },
    {
      $unwind: {
        path: "$client.center.branch",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "clients",
        localField: "nominee",
        foreignField: "_id",
        as: "nominee",
      },
    },
    {
      $unwind: {
        path: "$nominee",
        preserveNullAndEmptyArrays: true,
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
        localField: "center.branch",
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

const listAllSavings = (q, s, l) => {
  if (q) {
    return Saving.aggregate([
      { $match: { branch: ObjectId(q) } },
      {
        $lookup: {
          from: "clients",
          localField: "client",
          foreignField: "_id",
          as: "client",
        },
      },
      {
        $unwind: {
          path: "$client",
          preserveNullAndEmptyArrays: true,
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
          localField: "center.branch",
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
      {
        $lookup: {
          from: "centers",
          localField: "client.center",
          foreignField: "_id",
          as: "client.center",
        },
      },
      {
        $unwind: {
          path: "$client.center",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "client.center.branch",
          foreignField: "_id",
          as: "client.center.branch",
        },
      },
      {
        $unwind: {
          path: "$client.center.branch",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "client.branch",
          foreignField: "_id",
          as: "client.branch",
        },
      },
      {
        $unwind: {
          path: "$client.branch",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "nominee",
          foreignField: "_id",
          as: "nominee",
        },
      },
      {
        $unwind: {
          path: "$nominee",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "centers",
          localField: "nominee.center",
          foreignField: "_id",
          as: "nominee.center",
        },
      },
      {
        $unwind: {
          path: "$nominee.center",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "nominee.center.branch",
          foreignField: "_id",
          as: "nominee.center.branch",
        },
      },
      {
        $unwind: {
          path: "$nominee.center.branch",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "nominee.branch",
          foreignField: "_id",
          as: "nominee.branch",
        },
      },
      {
        $unwind: {
          path: "$nominee.branch",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $skip: s },
      { $limit: l },
    ]);
  }
  return Saving.aggregate([
    {
      $lookup: {
        from: "clients",
        localField: "client",
        foreignField: "_id",
        as: "client",
      },
    },
    {
      $unwind: {
        path: "$client",
        preserveNullAndEmptyArrays: true,
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
        localField: "center.branch",
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
    {
      $lookup: {
        from: "centers",
        localField: "client.center",
        foreignField: "_id",
        as: "client.center",
      },
    },
    {
      $unwind: {
        path: "$client.center",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "client.center.branch",
        foreignField: "_id",
        as: "client.center.branch",
      },
    },
    {
      $unwind: {
        path: "$client.center.branch",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "client.branch",
        foreignField: "_id",
        as: "client.branch",
      },
    },
    {
      $unwind: {
        path: "$client.branch",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "clients",
        localField: "nominee",
        foreignField: "_id",
        as: "nominee",
      },
    },
    {
      $unwind: {
        path: "$nominee",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "centers",
        localField: "nominee.center",
        foreignField: "_id",
        as: "nominee.center",
      },
    },
    {
      $unwind: {
        path: "$nominee.center",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "nominee.center.branch",
        foreignField: "_id",
        as: "nominee.center.branch",
      },
    },
    {
      $unwind: {
        path: "$nominee.center.branch",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "nominee.branch",
        foreignField: "_id",
        as: "nominee.branch",
      },
    },
    {
      $unwind: {
        path: "$nominee.branch",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $skip: s },
    { $limit: l },
  ]);
};

const getTotalMatch = (q) => {
  if (q) {
    return Saving.aggregate([
      { $match: { branch: ObjectId(q) } },
      { $count: "total" },
    ]);
  }
  return Saving.aggregate([{ $count: "total" }]);
};

const storeSaving = (data) => {
  const saving = new Saving(data);
  return saving.save();
};

const updateOneSaving = (id, data) =>
  Saving.updateOne({ _id: id }, { ...data });

const getById = (id) => Saving.findById(id);

const getClientById = (id) => Client.findById(id);

const deleteSaving = (id) => Saving.remove({ _id: id });

const findById = async (id) =>
  Saving.aggregate([
    { $match: { _id: ObjectId(id) } },
    {
      $lookup: {
        from: "clients",
        localField: "client",
        foreignField: "_id",
        as: "client",
      },
    },
    {
      $unwind: {
        path: "$client",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "clients",
        localField: "nominee",
        foreignField: "_id",
        as: "nominee",
      },
    },
    {
      $unwind: {
        path: "$nominee",
        preserveNullAndEmptyArrays: true,
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
        localField: "center.branch",
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
    {
      $lookup: {
        from: "branches",
        localField: "client.branch",
        foreignField: "_id",
        as: "client.branch",
      },
    },
    {
      $unwind: {
        path: "$client.branch",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "centers",
        localField: "client.center",
        foreignField: "_id",
        as: "client.center",
      },
    },
    {
      $unwind: {
        path: "$client.center",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "client.center.branch",
        foreignField: "_id",
        as: "client.center.branch",
      },
    },
    {
      $unwind: {
        path: "$client.center.branch",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "nominee.branch",
        foreignField: "_id",
        as: "nominee.branch",
      },
    },
    {
      $unwind: {
        path: "$nominee.branch",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "centers",
        localField: "nominee.center",
        foreignField: "_id",
        as: "nominee.center",
      },
    },
    {
      $unwind: {
        path: "$nominee.center",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "nominee.center.branch",
        foreignField: "_id",
        as: "nominee.center.branch",
      },
    },
    {
      $unwind: {
        path: "$nominee.center.branch",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

const search = async (q) =>
  Saving.aggregate([
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
        from: "clients",
        localField: "client",
        foreignField: "_id",
        as: "client",
      },
    },
    {
      $unwind: {
        path: "$client",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "clients",
        localField: "nominee",
        foreignField: "_id",
        as: "nominee",
      },
    },
    {
      $unwind: {
        path: "$nominee",
        preserveNullAndEmptyArrays: true,
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
  getAllSavings,
  storeSaving,
  findById,
  updateOneSaving,
  getById,
  deleteSaving,
  search,
  getClientById,
  listAllSavings,
};
