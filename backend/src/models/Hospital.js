import mongoose from "mongoose";

// Reusable structure for one bed category.
// Example: ICU has total beds and currently available beds.
const bedSchema = new mongoose.Schema(
  {
    total: {
      type: Number,
      default: 0,
      min: 0,
    },

    available: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false },
);

// Stores units for every blood group.
const bloodInventorySchema = new mongoose.Schema(
  {
    A_POSITIVE: { type: Number, default: 0, min: 0 },
    A_NEGATIVE: { type: Number, default: 0, min: 0 },
    B_POSITIVE: { type: Number, default: 0, min: 0 },
    B_NEGATIVE: { type: Number, default: 0, min: 0 },
    AB_POSITIVE: { type: Number, default: 0, min: 0 },
    AB_NEGATIVE: { type: Number, default: 0, min: 0 },
    O_POSITIVE: { type: Number, default: 0, min: 0 },
    O_NEGATIVE: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

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
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    // Used later for fast hospital search by city.
    city: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      index: true,
    },

    // Different kinds of beds.
    beds: {
      general: {
        type: bedSchema,
        default: () => ({}),
      },

      icu: {
        type: bedSchema,
        default: () => ({}),
      },

      ventilator: {
        type: bedSchema,
        default: () => ({}),
      },

      emergency: {
        type: bedSchema,
        default: () => ({}),
      },
    },

    bloodInventory: {
      type: bloodInventorySchema,
      default: () => ({}),
    },

    // Later, admin will verify hospitals before making them public.
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Tells users how fresh the resource data is.
    resourceUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Helps MongoDB quickly search verified hospitals in a city
// that have general beds available.
hospitalSchema.index({
  city: 1,
  isVerified: 1,
  "beds.general.available": 1,
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
