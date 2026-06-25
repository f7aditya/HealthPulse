import dotenv from "dotenv";

import app from "./src/app.js";

dotenv.config();

import connectDB from "./src/utils/db.js";
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server runnig on port ${PORT}`);
});
