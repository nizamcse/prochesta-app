const Installment = require("../models/installment-collection");

const getAllInstallments = (q, s, l) =>
  Installment.aggregate([
    {
      $lookup: {
        from: "loans",
        localField: "loan",
        foreignField: "_id",
        as: "loan",
      },
    },
    {
      $unwind: {
        path: "$loan",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "clients",
        localField: "loan.client",
        foreignField: "_id",
        as: "loan.client",
      },
    },
    {
      $unwind: {
        path: "$loan.client",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "centers",
        localField: "loan.client.center",
        foreignField: "_id",
        as: "loan.client.center",
      },
    },
    {
      $unwind: {
        path: "$loan.client.center",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "loan.client.center.branch",
        foreignField: "_id",
        as: "loan.client.center.branch",
      },
    },
    {
      $unwind: {
        path: "$loan.client.center.branch",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "loan.client.branch",
        foreignField: "_id",
        as: "loan.client.branch",
      },
    },
    {
      $unwind: {
        path: "$loan.client.branch",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $skip: s },
    { $limit: l },
  ]);
// eslint-disable-next-line no-unused-vars
const getTotalMatch = (_q) => Installment.aggregate([{ $count: "total" }]);

const matchedRecords = (q) =>
  Installment.aggregate([{ $match: { name: q } }, { $count: "total" }]);

const doesItExist = async (req, comparer = 0) => {
  const { name } = req.body;
  const total = await matchedRecords(name);
  const { total: count } = total[0] ? total[0] : { total: 0 };
  return count > comparer;
};

const storeInstallment = (data) => {
  const installment = new Installment(data);
  return installment.save();
};

const insertMany = (data) => Installment.insertMany(data);

const updateOneInstallment = (id, data) =>
  Installment.updateOne({ _id: id }, { ...data });

const getById = (id) => Installment.findById(id);

const deleteInstallment = (id) => Installment.remove({ _id: id });

const findById = (id) => Installment.findById(id);

module.exports = {
  getTotalMatch,
  getAllInstallments,
  storeInstallment,
  findById,
  doesItExist,
  updateOneInstallment,
  getById,
  deleteInstallment,
  insertMany,
};
