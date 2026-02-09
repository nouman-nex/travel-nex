const express = require("express");
const {
  getAllPartners,
} = require("../../controllers/admin/partner.controller");
const { protect } = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/getAllPartners", protect, getAllPartners);

module.exports = router;
