import express from "express";
import { createEmergencyRequest } from "../controllers/emergencyRequestController.js";

const router = express.Router();

router.post("/", createEmergencyRequest);

export default router;
