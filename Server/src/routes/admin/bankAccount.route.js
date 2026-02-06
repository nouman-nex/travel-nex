const express = require("express");
const {
  add,
  readAll,
  update,
  remove,
} = require("../../controllers/admin/bankAccount.controller");
const { protect } = require("../../middleware/auth.middleware");

const router = express.Router();

// Read routes - No authentication required
router.get("/", readAll);

// Write routes - Require authentication
router.post("/", protect, add);
router.put("/:id", protect, update);
router.delete("/:id", protect, remove);

module.exports = router;
