const express = require("express");
const router = express.Router();

const planningController = require("../controllers/planning");

router.get("/form", planningController.showPlanningForm);
router.post("/pull", planningController.getPlanning);
router.get("/link", planningController.getICSLink); 

module.exports = router;
