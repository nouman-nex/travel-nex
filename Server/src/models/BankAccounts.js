const mongoose = require("mongoose");

const BankAccountSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
      required: [true, "Bank name is required"],
      trim: true,
    },
    accountTitle: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    iban: {
      type: String,
      trim: true,
      uppercase: true,
    },
    branchCode: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: String,
      trim: true,
    },
    accountType: {
      type: String,
      enum: ["company", "personal"],
      default: "company",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("BankAccount", BankAccountSchema);
