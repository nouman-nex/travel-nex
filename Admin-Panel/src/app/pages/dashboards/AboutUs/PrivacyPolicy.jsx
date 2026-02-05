import React from "react";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

export default function PrivacyPolicy() {
  const headingStyle = {
    color: "#8B6A34", // Gold
    fontWeight: 600,
    marginTop: "2rem",
  };

  const sectionTextStyle = {
    color: "#4b2e2e", // Brown
    lineHeight: 1.7,
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ color: "#8B6A34", fontWeight: "bold", mb: 3 }}
      >
        Privacy Policy
      </Typography>

      <Typography variant="body1" sx={sectionTextStyle}>
        At GoldenBridge Inc., we are committed to protecting your personal
        information and your right to privacy. This Privacy Policy explains how
        we collect, use, and safeguard your data when you visit our website or
        use our services.
      </Typography>

      <Typography variant="h6" sx={headingStyle}>
        1. Information We Collect
      </Typography>
      <List dense>
        {[
          "Personal Data (name, email address, phone number)",
          "Usage Data (browsing activity, pages visited)",
          "Cookies and Tracking Technologies",
        ].map((item, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={item}
              primaryTypographyProps={{ sx: sectionTextStyle }}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" sx={headingStyle}>
        2. How We Use Your Information
      </Typography>
      <List dense>
        {[
          "Provide and maintain our services",
          "Improve user experience",
          "Send updates and promotional materials",
          "Comply with legal obligations",
        ].map((item, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={item}
              primaryTypographyProps={{ sx: sectionTextStyle }}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" sx={headingStyle}>
        3. Sharing of Information
      </Typography>
      <Typography variant="body1" sx={sectionTextStyle}>
        We do not sell or rent your personal information to third parties. We
        may share data with trusted vendors who assist in operating our
        services, provided they agree to keep this information confidential.
      </Typography>

      <Typography variant="h6" sx={headingStyle}>
        4. Data Security
      </Typography>
      <Typography variant="body1" sx={sectionTextStyle}>
        We implement industry-standard security measures to protect your data.
        However, please note that no method of transmission over the internet is
        completely secure.
      </Typography>

      <Typography variant="h6" sx={headingStyle}>
        5. Your Rights
      </Typography>
      <Typography variant="body1" sx={sectionTextStyle}>
        You have the right to access, correct, or delete your personal data. You
        may also object to certain data uses or withdraw your consent at any
        time.
      </Typography>

      <Typography variant="h6" sx={headingStyle}>
        6. Contact Us
      </Typography>
      <Typography variant="body1" sx={sectionTextStyle}>
        If you have any questions or concerns about this Privacy Policy, feel
        free to contact us at:
        <Box component="div" sx={{ mt: 1, ml: 2 }}>
          <div>
            <strong>Email:</strong> support@goldenbridge.com
          </div>
          <div>
            <strong>Phone:</strong> +1-800-123-4567
          </div>
        </Box>
      </Typography>

      <Divider sx={{ mt: 5, borderColor: "#8B6A34" }} />
    </Container>
  );
}
