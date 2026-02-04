import React from "react";
import Navbar from "../../components/home/Navbar";
import Hero from "../../components/home/Hero";
import Feature from "../../components/home/Feature";
import Destination from "../../components/home/Destination";
import About from "../../components/home/About";
import CTA from "../../components/home/CTA";
import PopularDestination from "../../components/home/PopularDestination";
import DealsOffer from "../../components/home/DealsOffer";
import Testimonials from "../../components/home/Testimonials";
import TravelFeature from "../../components/home/TravelFeature";
import Footer from "../../components/home/Footer";
import SearchEngine from "../../components/search/SearchEngine";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <SearchEngine />
      <Feature />
      <CTA />
      <Destination />
      {/* <About />
      <PopularDestination />
      <DealsOffer /> */}
      <TravelFeature />
      <Testimonials />
      <Footer />
    </div>
  );
}
