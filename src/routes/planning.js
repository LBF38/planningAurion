const express = require("express");
const router = express.Router();

const planningController = require("../controllers/planning");

router.get("/", planningController.showPlanningForm);
router.post("/pull", planningController.getPlanning);

module.exports = router;
