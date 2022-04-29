/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");

const {
  getTotalMatch,
  storeDeposit,
  findById,
  deleteDeposit,
  updateOneDeposit,
  search,
  getClientById,
  listAllDeposits,
} = require("../services/deposit-service");

const statuses = ["DRAFTED", "UNDER REVIEW", "APPROVED"];

const index = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 1000;
    const skip = parseInt(req.query.offset, 10) || 0;
    const branch = req.query.branch || "";
    const totalMatch = await getTotalMatch(branch);
    const deposits = await listAllDeposits(branch, skip, limit);
    return res.status(200).json({
      results: deposits,
      total: totalMatch[0] && totalMatch[0].total ? totalMatch[0].total : 0,
    });
  } catch (e) {
    return res.status(500).json({
      message: e,
    });
  }
};

const store = async (req, res) => {
  const { amount, interest } = req.body;
  const totalAmount = (parseInt(amount, 10) * parseInt(interest, 10)) / 100;
  const applicant = await getClientById(req.body.client);
  const { center } = applicant;
  const data = {
    _id: mongoose.Types.ObjectId(),
    client: req.body.client,
    nominee: req.body.nominee,
    center,
    nomineeRelation: req.body.nomineeRelation,
    amount: req.body.amount,
    interest: req.body.interest,
    interestAmount: totalAmount,
    openingDate: new Date(req.body.openingDate).toISOString(),
  };
  try {
    const deposit = await storeDeposit(data);
    const getDeposit = await findById(deposit.id);
    return res.status(200).json({
      results: getDeposit[0] || null,
      message: "Successfully created deposit",
    });
  } catch (e) {
    return res.status(500).json({
      message: e,
    });
  }
};

const updateOne = async (req, res) => {
  const { amount, interest } = req.body;
  const totalAmount = (parseInt(amount, 10) * parseInt(interest, 10)) / 100;
  const applicant = await getClientById(req.body.client);
  const { center } = applicant;
  const data = {
    client: req.body.client,
    nominee: req.body.nominee,
    center,
    nomineeRelation: req.body.nomineeRelation,
    amount: req.body.amount,
    interest: req.body.interest,
    interestAmount: totalAmount,
    openingDate: new Date(req.body.openingDate).toISOString(),
  };
  const { id } = req.params;
  try {
    await updateOneDeposit(id, data);
    const deposit = await findById(id);
    return res.status(200).json({
      results: deposit[0] || {},
      message: "Successfully updated deposit",
      _id: id,
    });
  } catch (e) {
    if (e.message.indexOf("duplicate key error") !== -1)
      return res.status(409).json({
        message: "Validation failed.",
        errors: [{ name: `"${data.name}" Already exist.` }],
      });
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
      data,
    });
  }
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteDeposit(id);
    if (result.deletedCount === 0)
      return res.status(200).json({
        message: "Record could not found.",
        results: result,
      });
    return res.status(200).json({
      message: "Deposit deleted successfully",
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
    const deposit = await findById(id);
    return res.status(200).json({
      results: deposit[0],
    });
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

const searchDeposit = async (req, res) => {
  const { query } = req.params;
  try {
    const deposits = await search(query);
    return res.status(200).json({
      results: deposits,
    });
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const deposit = await findById(id);
    const { status } = deposit[0];
    const ind = statuses.indexOf(status);
    if (ind > -1 && ind < statuses.length - 1) {
      const s = statuses[ind + 1];
      await updateOneDeposit(id, { status: s });
      const l = await findById(id);
      return res.status(200).json({
        results: l[0] || {},
        message: "Successfully updated status",
        _id: id,
      });
    }
    return res.status(500).json({
      message: "Unknown error.",
    });
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

/**
 https://drive.google.com/uc?id=12SRDZInmm4DYiPkG_dNi_cKsDOkLcPv5&export=download
 */

module.exports = {
  index,
  store,
  updateOne,
  deleteOne,
  findOne,
  searchDeposit,
  updateStatus,
};
