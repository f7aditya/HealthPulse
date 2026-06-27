import Hospital from "../models/Hospital.js";
import { BED_TYPES, BLOOD_GROUPS } from "../constants/resourceConstants.js";
const getHospitals = async (req, res) => {
  try {
    const { city, bedType, bloodGroup } = req.query;

    const query = {
      isVerified: true,
    };
    if (city) {
      query.city = city;
    }

    if (bedType && !BED_TYPES.includes(bedType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bed type",
      });
    }

    if (bedType) {
      query[`beds.${bedType}.available`] = { $gt: 0 }; // $gt means greater than 0
    }

    if (bloodGroup && !BLOOD_GROUPS.includes(bloodGroup)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blood group",
      });
    }

    if (bloodGroup) {
      query[`bloodInventory.${bloodGroup}`] = {
        $gt: 0,
      };
    }

    const hospitals = await Hospital.find(query).select(
      "name city location beds bloodInventory resourceUpdated",
    ); // MongoDB Projection

    return res.status(200).json({
      success: true,
      count: hospitals.length,
      hospitals,
    });
  } catch (error) {
    console.error("Get Hospitals Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hospitals",
    });
  }
};

export { getHospitals };
