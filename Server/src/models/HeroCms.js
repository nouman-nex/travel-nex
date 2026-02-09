const mongoose = require("mongoose");

const HeroCmsSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      default: "Main Hero Slider",
    },
    images: {
      type: [String],
      required: [true, "Please add at least one background image"],
      validate: [arrayLimit, "{PATH} exceeds the limit of 4 images"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Helper to keep the slider manageable
function arrayLimit(val) {
  return val.length <= 4;
}

module.exports = mongoose.model("HeroCms", HeroCmsSchema);
