import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  getResources,
  updateResources,
} from "../controllers/hospitalResourceController.js";

const router = express.Router();

router.get("/resources", protect, getResources);
router.patch("/resources", protect, updateResources);

export default router;
