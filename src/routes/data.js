const express = require("express");
const router = express.Router();

const dataController = require("../controllers/data");

router.get("/", dataController.getPlanning);

module.exports = router;
