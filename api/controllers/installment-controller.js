const mongoose = require("mongoose");

const {
  getTotalMatch,
  findById,
  insertMany,
  getAllInstallments,
} = require("../services/installment-service");

const index = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 100;
    const skip = parseInt(req.query.offset, 10) || 0;

    const query = req.query.search || "";
    const totalMatch = await getTotalMatch(query);
    const installments = await getAllInstallments(query, skip, limit);
    return res.status(200).json({
      results: installments,
      total: totalMatch[0] && totalMatch[0].total ? totalMatch[0].total : 0,
    });
  } catch (e) {
    return res.status(500).json(e);
  }
};

const store = async (req, res) => {
  const { collection } = req.body;
  try {
    const data = [];
    for (let i = 0; i < collection.length; i += 1) {
      data.push({
        _id: mongoose.Types.ObjectId(),
        amount: collection[i].amount,
        installmentDate: new Date(collection[i].installmentDate).toISOString(),
        loan: new Date(collection[i].loan),
      });
    }
    await insertMany(data);
    return res.status(200).json({
      message: "Successfully created installments",
    });
  } catch (e) {
    const errors = [];
    if (e.errors) {
      const keys = Object.keys(e.errors || {});
      for (let i = 0; i < keys.length; i += 1) {
        errors.push({ [keys[i]]: e.errors[keys[i]].message });
      }
    }
    if (errors.length)
      return res.status(400).json({
        message: "Validation failed.",
        errors,
      });

    return res.status(500).json({
      message: e.message,
    });
  }
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteOne(id);
    if (result.deletedCount === 0)
      return res.status(200).json({
        message: "Record could not found.",
        results: result,
      });
    return res.status(200).json({
      message: "Branch deleted successfully",
      results: result,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const branch = await findById(id);
    return res.status(200).json({
      results: branch,
    });
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

module.exports = { index, store, deleteOne, findOne };
