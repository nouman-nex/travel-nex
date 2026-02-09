const Agency = require("../../models/Partner");

exports.getAllPartners = async (req, res) => {
  try {
    const partners = await Agency.find().sort({ createdAt: -1 }).select("-__v");

    res.status(200).json({
      success: true,
      count: partners.length,
      data: partners,
    });
  } catch (error) {
    console.error("Error fetching partners:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching partners",
      error: error.message,
    });
  }
};
