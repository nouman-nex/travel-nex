const transporter = require("../../utils/mail");
const { validateEmail } = require("../../services/emailValidation.service");
const Partner = require("../../models/Partner");
const cleanReqData = require("../../helpers/cleanReqdata.helper");
const templates = require("../../templates/emailTemplates");

// Helper for sending 2-way emails
const sendTwoWayEmail = async (adminOptions, userOptions) => {
  return Promise.all([
    transporter.sendMail(adminOptions),
    transporter.sendMail(userOptions),
  ]);
};

exports.sendEmail = async (req, res) => {
  try {
    const { email, name, message } = req.body;

    // 1. Validation
    if (!email || !name || !message)
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required" });

    if (!validateEmail(email))
      return res
        .status(400)
        .json({ status: "error", message: "Invalid email format" });

    const trimmedName = name.trim();
    const trimmedMsg = message.trim();

    if (trimmedName.length < 2 || trimmedMsg.length < 10)
      return res
        .status(400)
        .json({ status: "error", message: "Input too short" });

    // 2. Send 2-Way Emails
    await sendTwoWayEmail(
      {
        from: `"${trimmedName}" <${email}>`,
        to: process.env.GMAIL_USER,
        subject: "New Contact Form Inquiry",
        html: templates.contactAdminTemplate(trimmedName, email, trimmedMsg),
      },
      {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "We've received your message!",
        html: templates.contactUserTemplate(trimmedName),
      },
    );

    res
      .status(200)
      .json({ status: "success", message: "Messages sent successfully" });
  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

exports.bePartner = async (req, res) => {
  try {
    // 1. Clean and Collect data
    const allowed = [
      "name",
      "email",
      "phone",
      "company",
      "address",
      "dtsLicense",
      "businessLicense",
      "primaryRegion",
      "monthlyVolume",
    ];
    const data = cleanReqData(req.body, allowed);

    // 2. Simple Validation
    const requiredFields = [
      "name",
      "email",
      "phone",
      "company",
      "dtsLicense",
      "businessLicense",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return res
          .status(400)
          .json({ status: "error", message: `${field} is required` });
      }
    }

    // 3. Save to Database (Mapping frontend names to Model names)
    const partnerRequest = await Partner.create({
      agencyName: data.company,
      contactPerson: data.name,
      emailAddress: data.email,
      phoneNumber: data.phone,
      address: data.address,
      dtsLicense: data.dtsLicense,
      businessLicense: data.businessLicense,
      primaryRegion: data.primaryRegion,
      monthlyVolume: data.monthlyVolume || "0",
    });

    // 4. Send Emails (Using the templates we made earlier)
    await sendTwoWayEmail(
      {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: `Partner App: ${data.company}`,
        html: templates.partnerAdminTemplate(data), // Pass the clean data object
      },
      {
        from: process.env.GMAIL_USER,
        to: data.email,
        subject: "Partnership Request Received",
        html: templates.contactUserTemplate(data.name),
      },
    );

    res
      .status(201)
      .json({ status: "success", message: "Application submitted!" });
  } catch (error) {
    console.error("Partner error:", error);
    if (error.code === 11000)
      return res.status(409).json({ message: "Email already exists" });
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
