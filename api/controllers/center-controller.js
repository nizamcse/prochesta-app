const mongoose = require('mongoose')
const {
  getAllCenters,
  getTotalMatch,
  storeCenter,
  findById,
  doesItExist,
  updateOneCenter,
  deleteCenter
} = require('../services/center-service')

const index = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100
    const skip = parseInt(req.query.offset) || 0
    const query = req.query.search || ''
    const totalMatch = await getTotalMatch(query)
    const centeres = await getAllCenters(query, skip, limit)
    return res.status(200).json({
      results: centeres,
      total: totalMatch[0] && totalMatch[0].total ? totalMatch[0].total : 0
    })
  } catch (e) {
    console.log(e)
    return res.status(500).json(e)
  }
}

const store = async (req, res) => {
  const data = {
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    branch: req.body.branch
  }
  console.log(data,req.body)
  try {
    const doesCenterExist = await doesItExist(req)
    if (doesCenterExist) {
      return res.status(409).json({
        message: 'Center already exist'
      })
    }
    const center = await storeCenter(data)
    return res.status(200).json({
      results: center,
      message: 'Successfully created center'
    })
  } catch (e) {
    if (e.message.indexOf('duplicate key error') !== -1)
      return res.status(409).json({
        message: 'Validation failed.',
        errors: [{ name: `"${data.name}" Already exist.` }]
      })
    let errors = []
    if (e.errors) {
      let keys = Object.keys(e.errors || {})
      for (let key of keys) {
        errors.push({ [key]: e.errors[key].message })
      }
    }
    if (errors.length)
      return res.status(400).json({
        message: 'Validation failed.',
        errors: errors
      })

    return res.status(500).json({
      message: e.message
    })
  }
}

const updateOne = async (req, res) => {
  const data = {
    name: req.body.name,
    branch: req.body.branch
  }
  const id = req.params.id

  try {
    const doesCenterExist = await doesItExist(req, 1)
    if (doesCenterExist) {
      return res.status(409).json({
        message: 'Center already exist'
      })
    }
    const b = await updateOneCenter(id, data)
    const center = await findById(id)
    return res.status(200).json({
      results: center,
      message: 'Successfully updated center',
    })
  } catch (e) {
    if (e.message.indexOf('duplicate key error') !== -1)
      return res.status(409).json({
        message: 'Validation failed.',
        errors: [{ name: `"${data.name}" Already exist.` }]
      })
    let errors = []
    if (e.errors) {
      let keys = Object.keys(e.errors || {})
      for (let key of keys) {
        errors.push({ [key]: e.errors[key].message })
      }
    }
    if (errors.length)
      return res.status(400).json({
        message: 'Validation failed.',
        errors: errors
      })

    return res.status(500).json({
      message: e.message
    })
  }
}

const deleteOne = async (req, res) => {
  const id = req.params.id
  try {
    const result = await deleteCenter(id)
    if (result.deletedCount === 0)
      return res.status(200).json({
        message: 'Record could not found.',
        results: result
      })
    return res.status(200).json({
      message: 'Center deleted successfully',
      results: result
    })
  } catch (e) {
    return res.status(500).json({
      message: e.message
    })
  }
}

const findOne = async (req, res) => {
  const id = req.params.id
  try {
    const center = await findById(id)
    return res.status(200).json({
      results: center
    })
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message
    })
  }
}

module.exports = { index, store, updateOne, deleteOne, findOne }
