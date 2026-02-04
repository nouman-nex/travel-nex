import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { postRequest } from "../../../backendServices/ApiCalls";
import useNotify from "@app/_components/Notification/useNotify";

const BlogCard = ({ image, date, title, description }) => {
  const navigate = useNavigate();
  function convertToReadableDate(isoString) {
    const date = new Date(isoString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }
  const readableDate = convertToReadableDate(date);

  return (
    <div className="flex flex-col">
      <div className="rounded-3xl overflow-hidden mb-4">
        <img src={image} alt={title} className="w-full h-64 object-cover" />
      </div>
      <p className="text-[#4e4e4e] font-semibold text-base font-nunito mb-2">
        {readableDate}
      </p>
      <h3 className="text-2xl font-extrabold mb-4 text-[#000000] font-nunito">
        {title}
      </h3>
      <div
        className="flex items-center border-t border-[#dee2e6] mt-auto pt-4"
        onClick={() =>
          navigate(`/blogdetails`, {
            state: { image, date: readableDate, title, description },
          })
        }
      >
        <button className="flex items-center text-xl font-nunito font-bold text-[#000000]">
          Read More
          <span className="ml-4 p-3 border rounded-xl">
            <ArrowUpRight size={20} />
          </span>
        </button>
      </div>
    </div>
  );
};

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const notify = useNotify();

  useEffect(() => {
    const fetchBlogs = async () => {
      postRequest("/getallBlogs", {}, (response) => {
        if (response.data.success) {
          setBlogPosts(response.data.data);
        } else {
          notify(response.data.message || "Failed to fetch FAQs", "error");
        }
      });
    };

    fetchBlogs();
  }, []);
  // const blogPosts = [
  //   {
  //     id: 1,
  //     image: "/images/blog1.png",
  //     date: "September 30, 2024",
  //     title: "Your Guide to Car Lottery Adventures",
  //   },
  //   {
  //     id: 2,
  //     image: "/images/blog2.png",
  //     date: "September 30, 2024",
  //     title: "Driving Car Lottery Success Stories",
  //   },
  //   {
  //     id: 3,
  //     image: "/images/blog3.png",
  //     date: "September 30, 2024",
  //     title: "Unveiling the Car Lottery Chronicles",
  //   },
  //   {
  //     id: 4,
  //     image: "/images/blog4.png",
  //     date: "September 30, 2024",
  //     title: "Stories Behind the Car Revolutions",
  //   },
  //   {
  //     id: 5,
  //     image: "/images/blog5.png",
  //     date: "September 30, 2024",
  //     title: "Unearthing Wins in Our Lottery Hub",
  //   },
  //   {
  //     id: 6,
  //     image: "/images/blog6.png",
  //     date: "September 30, 2024",
  //     title: "Exploring Wins in Our Car Lottery Blog",
  //   },
  // ];

  return (
    <div className="container mx-auto max-w-[1440px] py-20 px-4">
      <p className="text-4xl md:text-5xl font-bold mt-2 mb-8 font-nunito text-[#000000]">
        Latest Blog Posts
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <BlogCard
            key={post.id}
            image={post.media.url}
            date={post.createdAt}
            title={post.title}
            description={post.description}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
