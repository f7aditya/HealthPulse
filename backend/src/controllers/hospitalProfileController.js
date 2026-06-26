import Hospital from "../models/Hospital.js";

const getProfile = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }
    return res.status(200).json({
      success: true,
      hospital: {
        id: hospital._id,
        name: hospital.name,
        email: hospital.email,
        location: hospital.location,
        city: hospital.city,
        isVerified: hospital.isVerified,
        resourceUpdatedAt: hospital.resourceUpdatedAt,
        createdAt: hospital.createdAt,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, city, location } = req.body;
    const hospital = await Hospital.findById(req.user.id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }
      hospital.name = name;
    }

    if (city !== undefined) {
      if (!city.trim()) {
        return res.status(400).json({
          success: false,
          message: "City cannot be empty",
        });
      }
      hospital.city = city;
    }

    if (location !== undefined) {
      if (!location.trim()) {
        return res.status(400).json({
          success: false,
          message: "Location cannot be empty",
        });
      }
      hospital.location = location;
    }

    await hospital.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      hospital: {
        id: hospital._id,
        name: hospital.name,
        email: hospital.email,
        city: hospital.city,
        location: hospital.location,
        isVerified: hospital.isVerified,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export { getProfile, updateProfile };
