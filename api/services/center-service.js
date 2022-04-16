const Center = require('../models/center')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const getAllCenters = (q, s, l) => {
  return Center.aggregate([
    { $match: { name: { $regex: q, $options: 'i' } } },
    {
      $lookup: {
        from: 'branches',
        localField: 'branch',
        foreignField: '_id',
        as: 'branch'
      }
    },
    { $unwind : "$branch" },
    { $skip: s },
    { $limit: l }
  ])
}
const getTotalMatch = (q) => {
  return Center.aggregate([
    { $match: { name: { $regex: q, $options: 'i' } } },
    { $count: 'total' }
  ])
}

const matchedRecords = (q) => {
  return Center.aggregate([{ $match: { name: q } }, { $count: 'total' }])
}

const doesItExist = async (req, comparer = 0) => {
  const name = req.body.name
  const total = await matchedRecords(name)
  const { total: count } = total[0] ? total[0] : { total: 0 }
  return count > comparer
}

const storeCenter = (data) => {
  const branch = new Center(data)
  return branch.save()
}

const firstOrCreate = (q) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        let allMatches = await Center.aggregate([
          { $match: { name: { $regex: q.name, $options: 'i' } } }
        ])
        if (allMatches.length > 0)
          resolve({ name: allMatches[0].name, _id: allMatches[0]._id })
        else {
          let createdCenter = await storeCenter(q)
          resolve({ name: createdCenter.name, _id: createdCenter._id })
        }
      } catch (e) {
        reject(e)
      }
    })()
  })
}

const updateOneCenter = (id, data) => {
  return Center.updateOne({ _id: id }, { ...data })
}

const getById = (id) => {
  return Center.findById(id)
}

const deleteCenter = (id) => {
  return Center.remove({ _id: id })
}

const findById = async (id) =>  {
    return Center.aggregate([
    { $match: { _id: ObjectId(id) } },
    {
      $lookup: {
        from: 'branches',
        localField: 'branch',
        foreignField: '_id',
        as: 'branch'
      }
    },
    { $unwind : "$branch" },
  ]);
}

module.exports = {
  getTotalMatch,
  getAllCenters,
  storeCenter,
  findById,
  doesItExist,
  updateOneCenter,
  getById,
  deleteCenter
}
