import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/rebel", (req, res) => {
  res.send("HealthPulse Running");
});

export default app;
