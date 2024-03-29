import express from "express";
const router = express.Router();

import planningController from "../controllers/planning";

router.get("/form", planningController.showPlanningForm);
router.post("/pull", planningController.getPlanning);
router.get("/link", planningController.getICSLink);
router.get("/update", planningController.updateMyPlanning);

export default router;
