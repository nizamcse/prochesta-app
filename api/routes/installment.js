const express = require("express");

const router = express.Router();
const {
  index,
  store,
  deleteOne,
  findOne,
} = require("../controllers/installment-controller");

router.get("/", index);

router.post("/", store);

router.get("/:id", findOne);

router.delete("/:id", deleteOne);

module.exports = router;
