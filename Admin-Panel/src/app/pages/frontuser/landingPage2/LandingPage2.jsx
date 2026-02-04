import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import Faqs from "@app/components/Faqs/Faqs";
import Footer from "@app/components/Footer/Footer";
import Header2 from "@app/components/Header2/Header2";
import ImageSlider from "@app/components/ImageSlider/ImageSlider";
import Navbar from "@app/components/Navbar/Navbar";
import BigWin from "@app/components/Offer/BigWin";
import Offer from "@app/components/Offer/Offer";
import React, { useEffect, useState } from "react";
import { postRequest } from "../../../../backendServices/ApiCalls";

function LandingPage2() {
  const [isLoading, setIsLoading] = useState(true);
  const [lotteryItems, setLotteryItems] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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

  return (
    <div className="w-full">
      <Navbar />
      <div className="max-w-[1440px] mx-auto md:px-2 px-4 mt-24">
        <div className="grid grid-cols-1 max-w-[1440px] mx-auto md:grid-cols-2 gap-6">
          {lotteryItems.map((item, index) => (
            <Header2 key={index} {...item} />
          ))}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-10 my-24 max-w-[1340px] px-2 mx-auto">
        <div className="md:w-[50%]">
          <p className=" font-nunito text-center md:text-left font-semibold text-3xl md:text-7xl text-[#1D1B1C]">
            Our aim is for everyone to own their dream watch
          </p>
          <p className=" font-bold font-sans text-center md:text-left text-3xl md:text-7xl mt-8 text-[#1D1B1C]">
            Win the watch of your dreams
          </p>
        </div>
        <p className="my-auto font-nunito md:w-[30%] text-center md:text-left font-extrabold text-md md:text-2xl text-[#7C7C7C]">
          For every ticket sold, a significant portion goes toward supporting
          charitable initiatives. It's not just about winning, also about
          giving.
        </p>
      </div>
      <div className=" min-h-screen px-2 py-10">
        <ImageSlider />
      </div>
      <div className="bg-gray-900">
        <Offer />
      </div>
      <BigWin />
      <Faqs />
      <div className="bg-[#1B1B1B]">
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage2;
