/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");

const {
  getAllClients,
  getTotalMatch,
  storeClient,
  findById,
  deleteClient,
  updateOneClient,
  search,
} = require("../services/client-service");

const index = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 1000;
    const skip = parseInt(req.query.offset, 10) || 0;
    const branch = req.query.branch || "";
    const totalMatch = await getTotalMatch(branch);
    const clientes = await getAllClients(branch, skip, limit);
    return res.status(200).json({
      results: clientes,
      total: totalMatch[0] && totalMatch[0].total ? totalMatch[0].total : 0,
    });
  } catch (e) {
    return res.status(500).json({
      message: e,
    });
  }
};

const store = async (req, res) => {
  const data = {
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    branch: req.body.branch,
    center: req.body.center,
    phone: req.body.phone,
    nid: req.body.nid,
    dob: new Date(req.body.dob).toISOString(),
    father_name: req.body.father_name,
    mother_name: req.body.mother_name,
    present_address: req.body.present_address,
    permanent_address: req.body.permanent_address,
  };
  try {
    const client = await storeClient(data);
    const getClient = await findById(client.id);
    return res.status(200).json({
      results: getClient[0] || null,
      message: "Successfully created client",
    });
  } catch (e) {
    return res.status(500).json({
      message: e,
    });
  }
};

const updateOne = async (req, res) => {
  const data = {
    name: req.body.name,
    branch: req.body.branch,
    phone: req.body.phone,
    nid: req.body.nid,
    dob: new Date(req.body.dob).toISOString(),
    father_name: req.body.father_name,
    mother_name: req.body.mother_name,
    present_address: req.body.present_address,
    permanent_address: req.body.permanent_address,
  };
  const { id } = req.params;
  try {
    await updateOneClient(id, data);
    const client = await findById(id);
    return res.status(200).json({
      results: client[0] || {},
      message: "Successfully updated client",
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
    });
  }
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteClient(id);
    if (result.deletedCount === 0)
      return res.status(200).json({
        message: "Record could not found.",
        results: result,
      });
    return res.status(200).json({
      message: "Client deleted successfully",
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
    const client = await findById(id);
    return res.status(200).json({
      results: client[0],
    });
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
};

const searchClient = async (req, res) => {
  const { query } = req.params;
  try {
    const clients = await search(query);
    return res.status(200).json({
      results: clients,
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

module.exports = { index, store, updateOne, deleteOne, findOne, searchClient };
