import Hospital from "../models/Hospital.js";
import { BED_TYPES } from "../constants/resourceConstants.js";
import { BLOOD_GROUPS } from "../constants/resourceConstants.js";

const getResources = async (req, res) => {
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
      resources: {
        beds: hospital.beds,
        bloodInventory: hospital.bloodInventory,
        resourceUpdatedAt: hospital.resourceUpdatedAt,
      },
    });
  } catch (error) {
    console.error("Get Resources Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resources",
    });
  }
};

const updateResources = async (req, res) => {
  try {
    const { beds, bloodInventory } = req.body;

    const hasBeds = beds && Object.keys(beds).length > 0;

    const hasBloodInventory =
      bloodInventory && Object.keys(bloodInventory).length > 0;

    if (!hasBeds && !hasBloodInventory) {
      return res.status(400).json({
        success: false,
        message: "No resources provided to update",
      });
    }

    if (hasBeds) {
      const invalidBedTypes = Object.keys(beds).filter(
        (bedType) => !BED_TYPES.includes(bedType),
      );

      if (invalidBedTypes.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid bed type(s): ${invalidBedTypes.join(", ")}`,
        });
      }
    }

    if (hasBloodInventory) {
      const invalidBloodGroups = Object.keys(bloodInventory).filter(
        (group) => !BLOOD_GROUPS.includes(group),
      );

      if (invalidBloodGroups.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid blood group(s): ${invalidBloodGroups.join(", ")}`,
        });
      }
    }

    const hospital = await Hospital.findById(req.user.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    // ===========================
    // Update Beds
    // ===========================

    if (hasBeds) {
      for (const bedType of BED_TYPES) {
        const incomingBed = beds?.[bedType];

        if (!incomingBed) continue;

        if (incomingBed.total !== undefined) {
          hospital.beds[bedType].total = incomingBed.total;
        }

        if (incomingBed.available !== undefined) {
          hospital.beds[bedType].available = incomingBed.available;
        }

        const currentBed = hospital.beds[bedType];

        if (currentBed.total < 0 || currentBed.available < 0) {
          return res.status(400).json({
            success: false,
            message: `${bedType} bed values cannot be negative`,
          });
        }

        if (currentBed.available > currentBed.total) {
          return res.status(400).json({
            success: false,
            message: `${bedType} available beds cannot exceed total beds`,
          });
        }
      }
    }

    // Blood inventory logic will be added later.

    if (hasBloodInventory) {
      for (const bloodGroup of BLOOD_GROUPS) {
        const incomingUnits = bloodInventory?.[bloodGroup];

        if (incomingUnits === undefined) continue; //correct choice for partial updates.

        hospital.bloodInventory[bloodGroup] = incomingUnits;

        if (hospital.bloodInventory[bloodGroup] < 0) {
          return res.status(400).json({
            success: false,
            message: `${bloodGroup} blood units cannot be negative`,
          });
        }
      }
    }

    hospital.resourceUpdatedAt = new Date();

    await hospital.save();

    return res.status(200).json({
      success: true,
      message: "Resources updated successfully",
      resources: {
        beds: hospital.beds,
        bloodInventory: hospital.bloodInventory,
        resourceUpdatedAt: hospital.resourceUpdatedAt,
      },
    });
  } catch (error) {
    console.error("Update Resources Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update resources",
    });
  }
};

export { getResources, updateResources };
