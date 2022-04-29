const Installment = require("../models/installment-collection");

const getAllInstallments = (q, s, l) =>
  Installment.aggregate([
    { $match: { name: { $regex: q, $options: "i" } } },
    { $skip: s },
    { $limit: l },
  ]);
const getTotalMatch = (q) =>
  Installment.aggregate([
    { $match: { name: { $regex: q, $options: "i" } } },
    { $count: "total" },
  ]);

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
