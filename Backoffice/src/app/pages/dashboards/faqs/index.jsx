import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Box,
  useTheme,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { postRequest } from "../../../../backendServices/ApiCalls";

// const faqsData = [
//   {
//     question: "What payment methods do you accept?",
//     answer:
//       "We accept Visa, MasterCard, PayPal, and Apple Pay for your convenience.",
//   },
//   {
//     question: "Can I change or cancel my order?",
//     answer:
//       "Yes, you can change or cancel your order within 12 hours of placing it by contacting support.",
//   },
//   {
//     question: "Is my personal information secure?",
//     answer:
//       "Absolutely. We use industry-grade encryption and never store sensitive payment information.",
//   },
//   {
//     question: "Do you offer bulk discounts for businesses?",
//     answer:
//       "Yes, we offer tiered pricing and custom solutions for businesses. Contact sales for more info.",
//   },
// ];

const Faqs = () => {
  const [faqsData, setFaqsData] = useState([]);
  const theme = useTheme();
  const getFaqsData = () => {
    postRequest("/getfaqs", {}, (response) => {
      setFaqsData(response.data.faqs);
    });
  };
  useEffect(() => {
    getFaqsData();
  }, []);
  return (
    <Box
      sx={{
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          gutterBottom
          sx={{
            color: theme.palette.text.primary,
          }}
        >
          Frequently Asked Questions
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          sx={{ mb: 5 }}
        >
          Find answers to common queries about our services, products, and
          policies.
        </Typography>

        {faqsData.map((faq, index) => (
          <Accordion
            key={index}
            sx={{
              mb: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              borderRadius: 2,
              "&:before": { display: "none" },
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ color: theme.palette.primary.main }} />
              }
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography variant="h6" fontWeight={600}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
};

export default Faqs;
