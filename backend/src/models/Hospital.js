import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    location: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Hospital = mongoose.model("Hospital", hospitalSchema);
export default Hospital;
