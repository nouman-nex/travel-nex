const transporter = require("../../utils/mail");
const { validateEmail } = require("../../services/emailValidation.service");
const Partner = require("../../models/Partner");
const cleanReqData = require("../../helpers/cleanReqdata.helper");

exports.sendEmail = async (req, res) => {
  try {
    const { email, name, message } = req.body;

    // Basic validation
    if (!email || !name || !message) {
      return res.status(400).json({
        status: "error",
        message: "Email, name and message are required",
      });
    }

    // Email format validation
    if (!validateEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Please provide a valid email address",
      });
    }

    // Name validation
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      return res.status(400).json({
        status: "error",
        message: "Name must be at least 2 characters long",
      });
    }

    // Trim and validate message length
    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 10) {
      return res.status(400).json({
        status: "error",
        message: "Message must be at least 10 characters long",
      });
    }

    const mailOptions = {
      from: `"${trimmedName}" ${email}`,
      to: process.env.GMAIL_USER,
      subject: "New Message from Contact Form",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6">
          <h2>New Message</h2>
          <p><strong>Name:</strong> ${trimmedName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${trimmedMessage}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: "success",
      message:
        "Email sent successfully. Please check your inbox for confirmation.",
    });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send email",
    });
  }
};

exports.bePartner = async (req, res) => {
  try {
    const allowedFields = ["name", "email", "phone", "company", "message"];
    const cleanedData = cleanReqData(req.body, allowedFields);

    const { name, email, phone, company, message } = cleanedData;

    // 1. Validate required fields
    if (!name || !email || !phone || !company || !message) {
      return res.status(400).json({
        status: "error",
        message:
          "All fields (name, email, phone, company, message) are required",
      });
    }

    // 2. Email validation
    if (!validateEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Please provide a valid email address",
      });
    }

    // 3. String length validations
    if (name.trim().length < 2) {
      return res.status(400).json({
        status: "error",
        message: "Name must be at least 2 characters long",
      });
    }

    if (phone.trim().length < 10) {
      return res.status(400).json({
        status: "error",
        message: "Please provide a valid phone number",
      });
    }

    if (message.trim().length < 20) {
      return res.status(400).json({
        status: "error",
        message: "Please provide complete partner details",
      });
    }

    // 4. Parse message to extract individual fields
    const messageLines = message.split("\n").filter((line) => line.trim());
    const extractField = (fieldName) => {
      const line = messageLines.find((l) => l.includes(`${fieldName}:`));
      return line ? line.split(":").slice(1).join(":").trim() : "";
    };

    const address = extractField("Address");
    const dtsLicense = extractField("DTS License");
    const businessLicense = extractField("Business License");
    const primaryRegion = extractField("Primary Region");
    const monthlyVolume = extractField("Monthly Volume");

    // 5. Validate extracted fields
    if (!address || !dtsLicense || !businessLicense) {
      return res.status(400).json({
        status: "error",
        message:
          "Missing required fields: address, DTS license, or business license",
      });
    }

    // 6. Save to database with proper schema mapping
    const partnerRequest = new Partner({
      agencyName: company,
      contactPerson: name,
      emailAddress: email,
      phoneNumber: phone,
      address,
      dtsLicense,
      businessLicense,
      primaryRegion: primaryRegion || "",
      monthlyVolume: monthlyVolume || "0",
    });

    await partnerRequest.save();

    // 7. Email to admin
    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `New Partner Request from ${company}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2c3e50;">New Partner Request</h2>
          <p><strong>Agency Name:</strong> ${company}</p>
          <p><strong>Contact Person:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <h3 style="color: #2c3e50;">Business Details</h3>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>DTS License:</strong> ${dtsLicense}</p>
          <p><strong>Business License:</strong> ${businessLicense}</p>
          <p><strong>Primary Region:</strong> ${primaryRegion || "Not specified"}</p>
          <p><strong>Monthly Volume:</strong> ${monthlyVolume || "Not specified"}</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><small style="color: #999;">Request ID: ${partnerRequest._id}</small></p>
        </div>
      `,
    };

    // 8. Email to requester
    const userMailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Partnership Request Received - The Travel Agency",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2c3e50;">Hello ${name},</h2>
          <p>Thank you for reaching out to partner with <strong>The Travel Agency</strong>.</p>
          <p>We have received your partnership request for <strong>${company}</strong>. Our team will review the following information:</p>
          <ul style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
            <li>DTS License: ${dtsLicense}</li>
            <li>Business License: ${businessLicense}</li>
            <li>Primary Region: ${primaryRegion || "Not specified"}</li>
            <li>Monthly Volume: ${monthlyVolume || "Not specified"}</li>
          </ul>
          <p>We will get back to you within 2-3 business days.</p>
          <p>Best regards,<br/><strong>The Travel Agency Team</strong></p>
        </div>
      `,
    };

    // 9. Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    res.status(201).json({
      status: "success",
      message: "Partnership request submitted successfully.",
      data: {
        id: partnerRequest._id,
        agencyName: partnerRequest.agencyName,
        contactPerson: partnerRequest.contactPerson,
        emailAddress: partnerRequest.emailAddress,
      },
    });
  } catch (error) {
    console.error("Partner request error:", error);

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(409).json({
        status: "error",
        message: "An agency with this email address already exists.",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }

    res.status(500).json({
      status: "error",
      message: "An internal error occurred. Please try again later.",
    });
  }
};
