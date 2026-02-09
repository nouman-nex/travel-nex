import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./app/pages/home/home";
import BankAccounts from "./app/pages/bankAccount/bankAccounts";
import AboutUs from "./app/pages/aboutUs/AboutUs";
import ContactUs from "./app/pages/contactUs/contactUs";
import Navbar from "./app/components/home/Navbar";
import Footer from "./app/components/home/Footer";
import ScrollToTop from "./app/components/scroll/ScrollToTop";
import BeOurPartner from "./app/pages/BeOurPartner/BeOurPartner";
import NotFound from "./app/pages/404/404";

export default function App() {
  return (
    <Router>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bank-accounts" element={<BankAccounts />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/be-partner" element={<BeOurPartner />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}
