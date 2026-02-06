const express = require("express");
const {
  sendEmail,
  bePartner,
} = require("../../controllers/user/mail.controller");
const router = express.Router();

router.post("/sendMail", sendEmail);
router.post("/bePartner", bePartner);

module.exports = router;
