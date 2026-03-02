import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  deleteOpportunity,
  toggleOpportunityStatus,
  toggleSaveOpportunity,
} from "../controllers/opportunityController.js";

const router = express.Router();

/* create */
router.post(
  "/",
  protect,
  authorizeRoles("alumni", "admin"),
  createOpportunity
);

/* get all */
router.get("/", protect, getOpportunities);

/* get one */
router.get("/:id", protect, getOpportunityById);

/* delete */
router.delete("/:id", protect, deleteOpportunity);

/* archive */
router.put("/:id/toggle", protect, toggleOpportunityStatus);

/* save */
router.put("/:id/save", protect, toggleSaveOpportunity);

export default router;