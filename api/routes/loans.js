const express = require('express');

const router = express.Router();
const {
  index,
  store,
  updateOne,
  deleteOne,
  findOne,
  updateStatus,
  revokeStatus
} = require('../controllers/loan-controller');

router.get('/', index);

router.post('/', store);

router.get('/:id', findOne);

router.patch('/:id', updateOne);

router.patch('/update-status/:id', updateStatus);
router.patch('/revoke-status/:id', revokeStatus);

router.delete('/:id', deleteOne);

module.exports = router;
