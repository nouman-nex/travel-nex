import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

function BlogDetail() {
  window.scrollTo(0, 0);
  const location = useLocation();

  const { image, date, title, description } = location.state || {};

  return (
    <div className="w-full bg-white">
      <Navbar />
      <article className="container mx-auto max-w-[1000px] py-20 px-4">
        <Link
          to="/blog"
          className="flex items-center gap-2 mb-8 text-lg font-nunito font-semibold hover:text-[#FF650E] transition duration-300"
        >
          <ArrowLeft size={20} />
          Back to Blogs
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 font-nunito text-[#000000]">
          {title}
        </h1>

        <p className="text-[#4e4e4e] font-semibold text-lg font-nunito mb-8">
          {date}
        </p>

        <div className="rounded-3xl overflow-hidden mb-10">
          <img src={image} alt={title} className="w-full h-96 object-cover" />
        </div>

        <div
          className="blog-content font-nunito text-lg space-y-6"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </article>
      <div className="bg-[#1B1B1B]">
        <Footer />
      </div>
    </div>
  );
}

export default BlogDetail;
