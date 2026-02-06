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

export default function TermsAndCondition() {
  const headingStyle = {
    color: "#8B6A34", // Gold
    fontWeight: 600,
    marginTop: "2rem",
  };

  const textStyle = {
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
        Terms & Conditions
      </Typography>

      <Typography variant="body1" sx={textStyle}>
        By accessing and using our services, you agree to comply with and be
        bound by the following Terms and Conditions. Please read them carefully.
        If you do not agree, please do not use our services.
      </Typography>

      <Typography variant="h6" sx={headingStyle}>
        1. Use of Service
      </Typography>
      <Typography variant="body1" sx={textStyle}>
        You agree to use the service only for lawful purposes. You are
        responsible for all your activity in connection with the service and for
        ensuring that all use complies with applicable laws and regulations.
      </Typography>

      <Typography variant="h6" sx={headingStyle}>
        2. User Accounts
      </Typography>
      <Typography variant="body1" sx={textStyle}>
        You may be required to create an account to access certain features. You
        are responsible for maintaining the confidentiality of your credentials
        and for all activities that occur under your account.
      </Typography>

      <Typography variant="h6" sx={headingStyle}>
        3. Prohibited Activities
      </Typography>
      <List dense>
        {[
          "Using the service for illegal or harmful purposes",
          "Impersonating any person or entity",
          "Attempting to gain unauthorized access to our systems",
          "Disrupting or interfering with the security of the service",
        ].map((item, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={item}
              primaryTypographyProps={{ sx: textStyle }}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" sx={headingStyle}>
        4. Intellectual Property
      </Typography>
      <Typography variant="body1" sx={textStyle}>
        All content provided by GoldenBridge Inc. is protected by intellectual
        property laws. You may not use, reproduce, or distribute our content
        without written permission.
      </Typography>

      <Typography variant="h6" sx={headingStyle}>
        5. Limitation of Liability
      </Typography>
      <Typography variant="body1" sx={textStyle}>
        We shall not be liable for any direct, indirect, incidental, or
        consequential damages arising from your use of the service.
      </Typography>

      <Typography variant="h6" sx={headingStyle}>
        6. Changes to Terms
      </Typography>
      <Typography variant="body1" sx={textStyle}>
        We reserve the right to modify these terms at any time. Continued use of
        the service constitutes acceptance of the revised terms.
      </Typography>

      <Typography variant="h6" sx={headingStyle}>
        7. Contact Information
      </Typography>
      <Typography variant="body1" sx={textStyle}>
        If you have any questions regarding these Terms & Conditions, contact us
        at:
        <Box sx={{ mt: 1, ml: 2 }}>
          <div>
            <strong>Email:</strong> legal@goldenbridge.com
          </div>
          <div>
            <strong>Phone:</strong> +1-800-321-6543
          </div>
        </Box>
      </Typography>

      <Divider sx={{ mt: 5, borderColor: "#8B6A34" }} />
    </Container>
  );
}
