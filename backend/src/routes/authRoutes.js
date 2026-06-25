import express from "express";
import {
  registerHospital,
  loginHospital,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerHospital);
router.post("/login", loginHospital);

export default router;
