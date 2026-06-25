import express from "express";
import protect from "../middlewares/authMiddleware.js";
import Hospital from "../models/Hospital.js";

const router = express.Router();

router.get("/dashboard", protect, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.id);

    if (!hospital) {
      return res.status(404).json({
        message: "Hospital not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Hospital dashboard loaded",
      success: true,
      hospital: {
        id: hospital._id,
        name: hospital.name,
        email: hospital.email,
        location: hospital.location,
        createdAt: hospital.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Could not load hospital dashboard",
      success: false,
    });
  }
});

export default router;
