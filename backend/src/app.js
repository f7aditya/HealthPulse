import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import hospitalProfileRoutes from "./routes/hospitalProfileRoutes.js";
import hospitalResourceRoutes from "./routes/hospitalResourceRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/rebel", (req, res) => {
  res.send("HealthPulse is  Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/hospital", hospitalProfileRoutes);
app.use("/api/hospital", hospitalResourceRoutes);
app.use("/api/public", publicRoutes);
export default app;
