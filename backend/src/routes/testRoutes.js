import express from "express";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, (req, res) => {
  res.json({
    message: "Welcome",
    user: req.user,
  });
});

export default router;
