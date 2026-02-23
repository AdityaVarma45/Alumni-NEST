import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getAllUsers, blockUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, getAllUsers);

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

router.post("/block", protect, blockUser);

export default router;
