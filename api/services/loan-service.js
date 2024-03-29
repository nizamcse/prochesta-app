const mongoose = require("mongoose");
const Loan = require("../models/loan");
const Client = require("../models/client");

const { ObjectId } = mongoose.Types;
const getAllLoans = (q, s, l) => {
  if (q) {
    return Loan.aggregate([
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
          from: "clients",
          localField: "granter",
          foreignField: "_id",
          as: "granter",
        },
      },
      {
        $unwind: {
          path: "$granter",
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
  return Loan.aggregate([
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
        from: "clients",
        localField: "granter",
        foreignField: "_id",
        as: "granter",
      },
    },
    {
      $unwind: {
        path: "$granter",
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

const listAllLoans = (q, s, l) => {
  if (q) {
    return Loan.aggregate([
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
          from: "clients",
          localField: "granter",
          foreignField: "_id",
          as: "granter",
        },
      },
      {
        $unwind: {
          path: "$granter",
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
      {
        $project: {
          _id: 1,
          "client.name": 1,
          "granter.name": 1,
          "nominee.name": 1,
          "center.name": 1,
          "center.branch.name": 1,
          serviceCharge: 1,
          totalAmount: 1,
          amount: 1,
          status: 1,
          totalInstallment: 1,
          installmentAmount: 1,
          runningInstallment: 1,
          installmentReceived: 1,
          installmentShortage: 1,
        },
      },
    ]);
  }
  return Loan.aggregate([
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
        from: "clients",
        localField: "granter",
        foreignField: "_id",
        as: "granter",
      },
    },
    {
      $unwind: {
        path: "$granter",
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
    {
      $project: {
        _id: 1,
        "client.name": 1,
        "granter.name": 1,
        "nominee.name": 1,
        "center.name": 1,
        "center.branch.name": 1,
        serviceCharge: 1,
        totalAmount: 1,
        amount: 1,
        status: 1,
        totalInstallment: 1,
        installmentAmount: 1,
        runningInstallment: 1,
        installmentReceived: 1,
        installmentShortage: 1,
      },
    },
  ]);
};

const getTotalMatch = (q) => {
  if (q) {
    return Loan.aggregate([
      { $match: { branch: ObjectId(q) } },
      { $count: "total" },
    ]);
  }
  return Loan.aggregate([{ $count: "total" }]);
};

const storeLoan = (data) => {
  const loan = new Loan(data);
  return loan.save();
};

const updateOneLoan = (id, data) => Loan.updateOne({ _id: id }, { ...data });

const getById = (id) => Loan.findById(id);

const getClientById = (id) => Client.findById(id);

const deleteLoan = (id) => Loan.remove({ _id: id });

const findById = async (id) =>
  Loan.aggregate([
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
        from: "clients",
        localField: "granter",
        foreignField: "_id",
        as: "granter",
      },
    },
    {
      $unwind: {
        path: "$granter",
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

const search = async (q) =>
  Loan.aggregate([
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
        from: "clients",
        localField: "granter",
        foreignField: "_id",
        as: "granter",
      },
    },
    {
      $unwind: {
        path: "$granter",
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
  getAllLoans,
  storeLoan,
  findById,
  updateOneLoan,
  getById,
  deleteLoan,
  search,
  getClientById,
  listAllLoans,
};
