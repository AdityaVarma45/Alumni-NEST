import express from "express";
import {
  searchSkills,
  searchInterests,
} from "../controllers/skillController.js";

const router = express.Router();

/*
  Skill autocomplete
  Example:
  /api/skills/skills?q=react
*/
router.get("/skills", searchSkills);

/*
  Interest autocomplete
  Example:
  /api/skills/interests?q=ai
*/
router.get("/interests", searchInterests);

export default router;