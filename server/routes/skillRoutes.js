import express from "express";
import {
  searchSkills,
  searchInterests,
} from "../controllers/skillController.js";

const router = express.Router();

/* =====================================================
   Skill autocomplete routes
===================================================== */

router.get("/skills", searchSkills);
router.get("/interests", searchInterests);

export default router;