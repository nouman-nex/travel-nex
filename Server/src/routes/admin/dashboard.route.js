const express = require("express");
const { protect, authorize } = require("../../middleware/auth.middleware");
const {
  getAllUsers,
  updateHeroImages,
  getHeroImages,
} = require("../../controllers/admin/dashboard.controller");

const router = express.Router();

router.get("/users", protect, authorize("admin"), getAllUsers);
router.put("/editHero", protect, authorize("admin"), updateHeroImages);
router.get("/hero", getHeroImages);

module.exports = router;
