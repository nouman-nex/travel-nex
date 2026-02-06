const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema(
  {
    agencyName: {
      type: String,
      required: true,
      trim: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    dtsLicense: {
      type: String,
      required: true,
    },
    businessLicense: {
      type: String,
      required: true,
    },
    primaryRegion: {
      type: String,
      lowercase: true,
    },
    monthlyVolume: {
      type: String, // String used to accommodate the "+" symbol
      default: "0",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Agency", agencySchema);
