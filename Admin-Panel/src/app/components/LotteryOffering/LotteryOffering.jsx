import React, { useEffect, useState } from "react";
import LotteryItemCard from "./LotteryCard";
import axios from "axios";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
function LotteryOffering() {
  const [lotteryItems , setLotteryItems] = useState([])
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await axios.post(
          "https://mobicrypto-backend.threearrowstech.com/user/api/getCompetitions"
        );
        setLotteryItems(response.data.data)
      } catch (err) {
        console.log("🚀 ~ fetchCompetitions ~ err:", err);
      }
    };

    fetchCompetitions();
  }, []);
  // const lotteryItems = [
  //   {
  //     name: "Seiko Prospex",
  //     sold: 10,
  //     days: 5,
  //     remaining: 350,
  //     price: "$10",
  //     image:
  //       "https://softivuslab.com/wp/lottovibe/wp-content/uploads/2025/02/Frame-1000002335-1.webp",
  //   },
  //   {
  //     name: "Patek Philippe Nautilus ",
  //     sold: 80,
  //     days: 2,
  //     remaining: 120,
  //     price: "$5",
  //     image:
  //       "https://softivuslab.com/wp/lottovibe/wp-content/uploads/2025/02/Frame-1000002337.webp",
  //   },
  //   {
  //     name: "Audemars Piguet Royal Oak ",
  //     sold: 40,
  //     days: 7,
  //     remaining: 300,
  //     price: "$20",
  //     image:
  //       "https://softivuslab.com/wp/lottovibe/wp-content/uploads/2025/02/Frame-1000002340.webp",
  //   },
  //   {
  //     name: "Tag Heuer Carrera ",
  //     sold: 90,
  //     days: 7,
  //     remaining: 300,
  //     price: "$20",
  //     image:
  //       "https://softivuslab.com/wp/lottovibe/wp-content/uploads/2025/02/Frame-1000002339.webp",
  //   },
  //   {
  //     name: "Omega Speedmaster ",
  //     sold: 70,
  //     days: 7,
  //     remaining: 300,
  //     price: "$20",
  //     image:
  //       "https://softivuslab.com/wp/lottovibe/wp-content/uploads/2025/02/Frame-1000002338.webp",
  //   },
  //   {
  //     name: "Rolex Submariner ",
  //     sold: 60,
  //     days: 7,
  //     remaining: 300,
  //     price: "$20",
  //     image:
  //       "https://softivuslab.com/wp/lottovibe/wp-content/uploads/2025/02/Frame-1000002336.webp",
  //   },
  // ]; // Example array, replace with your data

  return (
    <div className="max-w-[1340px] my-16 mt-64  mx-auto px-4">
      <div className="flex gap-1 flex-row">
        <img
          src={`${ASSET_IMAGES}/frontweb/section-icon.png`}
          className="md:w-[2%] md:h-[2%]"
          alt="heading1"
        />
        <p className="font-sans font-bold text-[18px] text-[#554AFF] ">
          Try your chance at winning
        </p>
      </div>
      <p className="text-4xl md:text-6xl font-bold mt-2 font-nunito text-[#000000]">
        Current{" "}
        <span className="text-4xl md:text-6xl font-bold font-nunito text-[#FF650E] underline">
          Lottery
        </span>
      </p>
      <p className="text-4xl md:text-6xl font-bold font-nunito mb-16 text-[#000000]">
        Offering
      </p>
      <div className="grid max-w-[1280px] mx-auto  md:grid-cols-3 gap-10">
        {lotteryItems.map((item, index) => (
          <LotteryItemCard key={index} data={item} />
        ))}
      </div>
    </div>
  );
}

export default LotteryOffering;
