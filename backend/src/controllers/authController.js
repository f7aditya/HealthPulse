import Hospital from "../models/Hospital.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerHospital = async (req, res) => {
  // get data
  const { name, email, password, location } = req.body || {};

  // validation
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    //   check existing or not
    const existing = await Hospital.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "Hospital already exists",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    //   store in db
    const hospital = Hospital.create({
      name,
      email,
      password: hashedPass,
      location,
    });

    return res.status(201).json({
      message: "Hospital registered successfully",
      hospital,
      success: true,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Something went wrong",
      error,
      success: true,
    });
  }
};

const loginhospital = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  try {
    const hospital = await Hospital.findOne({ email }).select("+password");
    if (!hospital) {
      return res.status(400).json({
        message: "Hospital doesn't exist",
      });
    }

    const isMatch = await bcrypt.compare(password, hospital.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: hospital._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

export { registerHospital, loginhospital };
