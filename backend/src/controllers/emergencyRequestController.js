import EmergencyRequest from "../models/EmergencyRequest.js";

const createEmergencyRequest = async (req, res) => {
  try {
    const {
      patientName,
      phone,
      city,
      resourceType,
      bedType,
      bloodGroup,
      message,
    } = req.body;

    const emergencyRequest = await EmergencyRequest.create({
      patientName,
      phone,
      city,
      resourceType,
      bedType,
      bloodGroup,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Emergency request created successfully",
      emergencyRequest,
    });
  } catch (error) {
    console.log("Create Emergency Request Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create Emergency Request",
    });
  }
};

export { createEmergencyRequest };
