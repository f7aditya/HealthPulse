import mongoose from "mongoose";
import {
  BED_TYPES,
  BLOOD_GROUPS,
  REQUEST_STATUSES,
  RESOURCE_TYPES,
} from "../constants/resourceConstants.js";

const emergencyRequestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    resourceType: {
      type: String,
      required: true,
      enum: RESOURCE_TYPES,
    },

    bedType: {
      type: String,
      enum: BED_TYPES,
      required: function () {
        return this.resourceType === "bed"; // conditional validation
      },
    },

    bloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
      required: function () {
        return this.resourceType === "blood"; // conditional validation
      },
    },

    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      default: null,
    },

    status: {
      type: String,
      enum: REQUEST_STATUSES,
      default: "pending",
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

const EmergencyRequest = mongoose.model(
  "EmergencyRequest",
  emergencyRequestSchema,
);

export default EmergencyRequest;
