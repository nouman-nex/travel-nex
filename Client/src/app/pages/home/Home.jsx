import React from "react";
import Hero from "../../components/home/Hero";
import Feature from "../../components/home/Feature";
import Destination from "../../components/home/Destination";
import About from "../../components/home/About";
import CTA from "../../components/home/CTA";
import PopularDestination from "../../components/home/PopularDestination";
import DealsOffer from "../../components/home/DealsOffer";
import Testimonials from "../../components/home/Testimonials";
import TravelFeature from "../../components/home/TravelFeature";
import SearchEngine from "../../components/search/SearchEngine";
import CTA2 from "../../components/home/CTA2";
import Blogs from "../../components/home/Blogs";
import CountriesCarousel from "../../components/home/CountriesCarousel";

export default function Home() {
  return (
    <div>
      <Hero />
      <SearchEngine />
      {/* <Feature /> */}
      <CTA />
      <Destination />
      {/* <About /> */}
      <PopularDestination />
      {/* <DealsOffer /> */}
      <TravelFeature />
      <CountriesCarousel />
      <CTA2 />
      {/* <Blogs /> */}
      <Testimonials />
    </div>
  );
}
