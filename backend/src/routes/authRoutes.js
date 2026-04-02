import express from "express";
import {
  registerHospital,
  loginhospital,
} from "../controllers/authController.js";
const router = express.Router();
router.post("/register", registerHospital);
router.post("/login", loginhospital);

export default router;
