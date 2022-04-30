const Installment = require("../models/installment-collection");

const getAllInstallments = (q, s, l) =>
  Installment.aggregate([{ $skip: s }, { $limit: l }]);
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
