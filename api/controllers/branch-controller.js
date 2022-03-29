const mongoose = require('mongoose')
const {
  getAllSubjects,
  getTotalMatch,
  storeSubject,
  findById,
  doesItExist,
  updateOneSubject,
  deleteSubject
} = require('../services/SubjectService')

const index = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit)
    const skip = parseInt(req.query.offset)
    const query = req.query.search
    const totalMatch = await getTotalMatch(query)
    const subjects = await getAllSubjects(query, skip, limit)
    return res.status(200).json({
      results: subjects,
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
    name: req.body.name
  }
  try {
    const doesSubjectExist = await doesItExist(req)
    if (doesSubjectExist) {
      return res.status(409).json({
        message: 'Subject already exist'
      })
    }
    const subject = await storeSubject(data)
    console.log('Subject from controller', subject)
    return res.status(201).json({
      results: subject,
      message: 'Successfully created subject'
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
    name: req.body.name
  }
  const id = req.params.id

  try {
    const doesSubjectExist = await doesItExist(req, 1)
    if (doesSubjectExist) {
      return res.status(409).json({
        message: 'Subject already exist'
      })
    }
    const subject = await updateOneSubject(id, data)
    return res.status(200).json({
      results: subject,
      message: 'Successfully updated subject',
      l: req.query
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
    const result = await deleteSubject(id)
    if (result.deletedCount === 0)
      return res.status(200).json({
        message: 'Record could not found.',
        results: result
      })
    return res.status(200).json({
      message: 'Subject deleted successfully',
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
    const subject = await findById(id)
    return res.status(200).json({
      results: subject
    })
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message
    })
  }
}

module.exports = { index, store, updateOne, deleteOne, findOne }
