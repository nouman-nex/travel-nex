import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import Footer from "@app/components/Footer/Footer";
import Navbar from "@app/components/Navbar/Navbar";
import React, { useEffect, useState } from "react";
import { postRequest } from "../../../../backendServices/ApiCalls";
import AboutCompetitions from "@app/components/AboutCompetitions/AboutCompetitions";

function About() {
  const [isLoading, setIsLoading] = useState(true);
  const [lotteryItems, setLotteryItems] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
 useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? lotteryItems.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === lotteryItems.length - 1 ? 0 : prev + 1
    );
  };
  useEffect(() => {
    setIsLoading(true);
    postRequest(
      "/getCompetitions",
      {},
      (response) => {
        if (response.data && response.data.success) {
          const featuredItems = response.data.data
            .filter((item) => item.isFeatured === true)
            .slice(0, 2);
          setLotteryItems(featuredItems);
        } else {
          setError("Failed to fetch competitions data");
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching competitions:", error);
        setError("Error connecting to the server. Please try again later.");
        setIsLoading(false);
      }
    );
  }, []);

  if (isLoading) {
    return <div className="text-center text-white py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }
  return (
    <div className="w-full">
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 my-24 max-w-[1340px] px-2 mx-auto">
        <div className="md:w-[50%]">
          <p className=" font-nunito text-center md:text-left font-semibold text-3xl md:text-7xl text-[#1D1B1C]">
            WIN4LUX is a symbol of the care and commitment of our family-driven
            brand.
          </p>
        </div>
        <p className="my-auto font-nunito md:w-[30%] text-center md:text-left font-extrabold text-md md:text-2xl text-[#7C7C7C]">
          Born from a family legacy, WIN4LUX was founded to fulfill the dream of
          luxury watch ownership. With unwavering dedication, our expert team
          carefully selects the most exclusive timepieces for your collection.
        </p>
      </div>
      <img
        src={`${ASSET_IMAGES}/multiimages.png`}
        alt="left-arrow.png"
        className="w-full my-10 object-cover"
      />
      <div className="max-w-[1340px] mx-auto my-32 px-2">
        <p className="font-nunito text-center md:text-left font-bold text-3xl md:text-7xl text-[#1D1B1C]">
          A Global Leader in Delivering Superior{" "}
          <span className="text-primary"> Chances to Win </span>
        </p>
        <p className=" font-nunito my-4 text-center md:text-left font-extrabold text-md md:text-2xl text-[#7C7C7C]">
          We take immense pride in announcing that our website is globally
          recognized as the leading platform for the highest chances of winning.
          This achievement is the result of our carefully crafted limited-ticket
          strategy, designed to align with the number of participants—maximizing
          your opportunity to win. Our commitment remains strong in offering our
          valued users the most favorable odds for success, and we are honored
          to uphold our position as the industry’s premier destination.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 max-w-6xl my-20 mx-auto px-4">
        {lotteryItems.map((item, index) => (
          <AboutCompetitions key={index} {...item} />
        ))}
      </div>
      <div className="about-bg flex items-center justify-center">
        <p className="font-nunito text-center font-semibold text-3xl md:text-5xl text-primary">
          Winners are the ones who take part.
        </p>
      </div>

      <div className="bg-[#1B1B1B] my-20">
        <Footer />
      </div>
    </div>
  );
}

export default About;
