import Hospital from "../models/Hospital.js";
import bcrypt from "bcryptjs";

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

export { registerHospital };
