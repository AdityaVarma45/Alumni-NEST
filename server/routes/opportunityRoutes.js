import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {createOpportunity} from "../controllers/opportunityController.js";
import {getOpportunities} from "../controllers/opportunityController.js";


const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("alumni", "admin"),
  createOpportunity
);

router.get("/", protect, getOpportunities);

export default router;