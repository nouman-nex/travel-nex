const express = require("express");
const {
  register,
  login,
  getMe,
  updateProfile,
} = require("../../controllers/user/authController.controller");
const { protect } = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/updateProfile", protect, updateProfile);

module.exports = router;
