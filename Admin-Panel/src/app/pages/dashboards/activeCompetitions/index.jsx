import React, { useState, useEffect } from "react";
import LotteryItemCard from "../../competitions/card";
import Star from "@assets/star.png";
import { Spinner } from "@app/_shared";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../../../../backendServices/ApiCalls";

function ActiveCompetitions() {
  const { User } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run logic if User is defined (i.e. data has loaded)
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      const isAdmin = roles.includes("Admin");

      if (isAdmin) {
        navigate("/dashboard");
      }
    }
  }, [User, navigate]);
  const [lotteryItems, setLotteryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    postRequest(
      "/getCompetitions",
      {},
      (response) => {
        if (response.data && response.data.success) {
          const currentTime = new Date();
          const filteredData = response.data.data.filter(
            (item) => new Date(item.endDateTime) > currentTime
          );
          setLotteryItems(filteredData);
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
    return (
      <div className="max-w-[1340px] mx-auto px-4 py-20 text-center">
        <p className="text-xl">
          <Spinner />
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1340px] mx-auto px-4 py-20 text-center">
        <p className="text-xl text-red-500">Error: {error}</p>
        <button
          className="mt-4 bg-[#554AFF] text-white px-4 py-2 rounded"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  const sortedFilteredItems = lotteryItems
    .filter((item) => item.isPublished === true)
    .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

  return (
    <div className="max-w-[1340px] mx-auto px-4">
      <div className="flex gap-1 flex-row">
        {/* <img src={Star} className="md:w-[2%] md:h-[2%]" alt="heading1" /> */}
      </div>
      <p className="text-4xl md:text-6xl font-bold mt-2 font-nunito text-[#000000]">
        Active Competitions
      </p>
      <p className="text-4xl md:text-6xl font-bold font-nunito mb-16 text-[#000000]"></p>
      <div className="grid max-w-[1280px] mx-auto  md:grid-cols-3 gap-10">
        {sortedFilteredItems.map((item, index) => (
          <LotteryItemCard key={index} data={item} />
        ))}
      </div>
    </div>
  );
}

export default ActiveCompetitions;
