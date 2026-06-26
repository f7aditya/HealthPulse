import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  getProfile,
  updateProfile,
} from "../controllers/hospitalProfileController.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

router.patch("/profile", protect, updateProfile);

export default router;
