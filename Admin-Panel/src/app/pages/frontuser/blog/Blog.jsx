import React from "react";
import Navbar from "../../../components/Navbar/Navbar";
import BlogSection from "../../../components/BlogSection/BlogSection";
import Footer from "../../../components/Footer/Footer";

function Blog() {
  window.scrollTo(0, 0);
  return (
    <div className="w-full bg-white">
      <Navbar />
      <BlogSection />
      <div className="bg-[#1B1B1B]">
        <Footer/>
      </div>
    </div>
  );
}

export default Blog;
