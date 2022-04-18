const mongoose = require("mongoose");

const {
  getAllBranches,
  getTotalMatch,
  storeBranch,
  findById,
  doesItExist,
  deleteBranch,
  updateOneBranch,
} = require("../services/branch-service");

const index = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 100;
    const skip = parseInt(req.query.offset, 10) || 0;
    const query = req.query.search || "";
    const totalMatch = await getTotalMatch(query);
    const branches = await getAllBranches(query, skip, limit);
    return res.status(200).json({
      results: branches,
      total: totalMatch[0] && totalMatch[0].total ? totalMatch[0].total : 0,
    });
  } catch (e) {
    return res.status(500).json(e);
  }
};

const store = async (req, res) => {
  const data = {
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
  };
  try {
    const doesBranchExist = await doesItExist(req);
    if (doesBranchExist) {
      return res.status(409).json({
        message: "Branch already exist",
      });
    }
    const branch = await storeBranch(data);
    return res.status(200).json({
      results: branch,
      message: "Successfully created branch",
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
    });
  }
};

const updateOne = async (req, res) => {
  const data = {
    name: req.body.name,
  };
  const { id } = req.params;

  try {
    const doesBranchExist = await doesItExist(req, 1);
    if (doesBranchExist) {
      return res.status(409).json({
        message: "Branch already exist",
      });
    }
    await updateOneBranch(id, data);
    const branch = await findById(id);
    return res.status(200).json({
      results: branch,
      message: "Successfully updated branch",
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
    });
  }
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteBranch(id);
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

module.exports = { index, store, updateOne, deleteOne, findOne };
