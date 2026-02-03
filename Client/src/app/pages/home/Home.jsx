import React from "react";
import Navbar from "../../components/home/Navbar";
import Hero from "../../components/home/Hero";
import Feature from "../../components/home/Feature";
import Destination from "../../components/home/Destination";
import About from "../../components/home/About";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Feature />
      <Destination />
      <About />
    </div>
  );
}
