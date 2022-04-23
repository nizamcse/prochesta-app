/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");
const {
  getAllCenters,
  getTotalMatch,
  storeCenter,
  findById,
  doesItExist,
  deleteCenter,
  updateOneCenter,
} = require("../services/center-service");

const index = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 100;
    const skip = parseInt(req.query.offset, 10) || 0;
    const query = req.query.branch || "";
    console.log(query);
    const totalMatch = await getTotalMatch(query);
    const centeres = await getAllCenters(query, skip, limit);
    return res.status(200).json({
      results: centeres,
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
    branch: req.body.branch,
  };
  try {
    const doesCenterExist = await doesItExist(req);
    if (doesCenterExist) {
      return res.status(409).json({
        message: "Center already exist",
      });
    }
    const center = await storeCenter(data);
    const getCenter = await findById(center._id);
    return res.status(200).json({
      results: getCenter[0] || null,
      message: "Successfully created center",
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
    branch: req.body.branch,
  };
  const { id } = req.params;

  try {
    const doesCenterExist = await doesItExist(req, 1);
    if (doesCenterExist) {
      return res.status(409).json({
        message: "Center already exist",
      });
    }
    await updateOneCenter(id, data);
    const center = await findById(id);
    return res.status(200).json({
      results: center,
      message: "কেন্দ্রটি সম্পাদন করা হয়েছে।",
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
    const result = await deleteCenter(id);
    if (result.deletedCount === 0)
      return res.status(200).json({
        message: "Record could not found.",
        results: result,
      });
    return res.status(200).json({
      message: "Center deleted successfully",
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
    const center = await findById(id);
    return res.status(200).json({
      results: center[0],
    });
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

module.exports = { index, store, updateOne, deleteOne, findOne };
