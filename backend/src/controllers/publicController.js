import Hospital from "../models/Hospital.js";
import { BED_TYPES, BLOOD_GROUPS } from "../constants/resourceConstants.js";

const getHospitals = async (req, res) => {
  try {
    const {
      city,
      bedType,
      bloodGroup,
      sort = "updated",
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    if (
      Number.isNaN(pageNumber) ||
      Number.isNaN(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be positive numbers",
      });
    }

    if (limitNumber > 50) {
      return res.status(400).json({
        success: false,
        message: "Maximum limit is 50",
      });
    }
    const skip = (pageNumber - 1) * limitNumber;

    const query = {
      isVerified: true,
    };

    // Filter by city
    if (city) {
      query.city = city;
    }

    // Validate bed type
    if (bedType && !BED_TYPES.includes(bedType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bed type",
      });
    }

    // Filter by available beds
    if (bedType) {
      query[`beds.${bedType}.available`] = {
        $gt: 0,
      };
    }

    // Validate blood group
    if (bloodGroup && !BLOOD_GROUPS.includes(bloodGroup)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blood group",
      });
    }

    // Filter by blood units
    if (bloodGroup) {
      query[`bloodInventory.${bloodGroup}`] = {
        $gt: 0,
      };
    }

    let sortOption = {};
    if (sort === "updated") {
      sortOption = {
        resourceUpdatedAt: -1,
      };
    } else if (sort === "name") {
      sortOption = {
        name: 1,
      };
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid sort option",
      });
    }

    // Count hospitals AFTER query is complete
    const totalHospitals = await Hospital.countDocuments(query);

    // Fetch hospitals
    const hospitals = await Hospital.find(query)
      .select("name city location beds bloodInventory resourceUpdatedAt")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const totalPages = Math.ceil(totalHospitals / limitNumber);

    return res.status(200).json({
      success: true,
      currentPage: pageNumber,
      totalPages,
      totalHospitals,
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
