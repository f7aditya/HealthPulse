import Hospital from "../models/Hospital.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerHospital = async (req, res) => {
  const { name, email, password, location } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required",
      success: false,
    });
  }

  try {
    const existingHospital = await Hospital.findOne({ email });

    if (existingHospital) {
      return res.status(409).json({
        message: "Hospital already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const hospital = await Hospital.create({
      name,
      email,
      password: hashedPassword,
      location: location || "",
    });

    return res.status(201).json({
      message: "Hospital registered successfully",
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
    console.error("Register hospital error:", error.message);

    return res.status(500).json({
      message: "Something went wrong while registering hospital",
      success: false,
    });
  }
};

const loginHospital = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
      success: false,
    });
  }

  try {
    const hospital = await Hospital.findOne({ email }).select("+password");

    if (!hospital) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, hospital.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const token = jwt.sign(
      {
        id: hospital._id,
        role: "hospital",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      hospital: {
        id: hospital._id,
        name: hospital.name,
        email: hospital.email,
        location: hospital.location,
      },
    });
  } catch (error) {
    console.error("Hospital login error:", error.message);

    return res.status(500).json({
      message: "Login failed",
      success: false,
    });
  }
};

export { registerHospital, loginHospital };
