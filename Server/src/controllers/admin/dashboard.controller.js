const HeroCms = require("../../models/HeroCms");
const User = require("../../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      isActive: true,
      role: { $ne: "admin" },
    }).select("-password -__v");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
exports.getHeroImages = async (req, res) => {
  try {
    const config = await HeroCms.findOne();

    if (!config) {
      return res.status(200).json({ success: true, images: [] });
    }

    res.status(200).json({
      success: true,
      images: config.images,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.updateHeroImages = async (req, res) => {
  try {
    const { images } = req.body;

    if (!images || !Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of image URLs",
      });
    }

    const updatedConfig = await HeroCms.findOneAndUpdate(
      {},
      { images: images, sectionName: "Main Hero Slider" },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Hero images updated successfully",
      data: updatedConfig.images,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
