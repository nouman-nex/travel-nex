import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import React, { useRef } from "react";
import { Link } from "react-router-dom";

const winners = [
  {
    src: `${ASSET_IMAGES}/frontweb/w1.png`,
    name: "Jonathan Kayat",
    prize: "PATEK PHILIPPE 5167A",
    value: "£50k",
  },
  {
    src: `${ASSET_IMAGES}/frontweb/w2.png`,
    name: "John Doe",
    prize: "ROLEX GOLD",
    value: "£35k",
  },
  {
    src: `${ASSET_IMAGES}/frontweb/w3.png`,
    name: "Alex Smith",
    prize: "AUDEMARS PIGUET",
    value: "£40k",
  },
  {
    src: `${ASSET_IMAGES}/frontweb/w4.png`,
    name: "Mark Lee",
    prize: "OMEGA SEAMASTER",
    value: "£20k",
  },
  {
    src: `${ASSET_IMAGES}/frontweb/w5.png`,
    name: "Mark Lee",
    prize: "OMEGA SEAMASTER",
    value: "£20k",
  },
  {
    src: `${ASSET_IMAGES}/frontweb/w6.png`,
    name: "Mark Lee",
    prize: "OMEGA SEAMASTER",
    value: "£20k",
  },
  {
    src: `${ASSET_IMAGES}/frontweb/w7.png`,
    name: "Mark Lee",
    prize: "OMEGA SEAMASTER",
    value: "£20k",
  },
];

const ImageSlider = () => {
  const containerRef = useRef();

  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: -364, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: 364, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto py-10 relative px-0">
      <div className="absolute -top-5 right-0 flex space-x-2 z-10 pr-2">
        <button
          onClick={scrollLeft}
          className="bg-primary border p-4 rounded-full font-bold shadow hover:bg-hover"
        >
          <img
            src={`${ASSET_IMAGES}/frontweb/left-arrow.png`}
            alt="left-arrow.png"
            className="w-6 object-cover"
          />
        </button>
        <button
          onClick={scrollRight}
          className="bg-primary border p-4 rounded-full shadow hover:bg-hover"
        >
          <img
            src={`${ASSET_IMAGES}/frontweb/right-arrow.png`}
            alt="left-arrow.png"
            className="w-6 object-cover"
          />
        </button>
      </div>

      {/* Slider */}
      <div
        ref={containerRef}
        className="flex gap-[16px] overflow-x-auto scroll-smooth scrollbar-hide px-0 mt-5"
      >
        {winners.map((winner, idx) => (
          <div
            key={idx}
            className="w-[348px] flex-shrink-0 bg-white rounded-2xl shadow-md overflow-hidden"
          >
            <div className="w-full aspect-[5/5] overflow-hidden bg-gray-100">
              <img
                src={winner.src}
                alt={winner.name}
                className="w-full h-full object-cover object-center transition-all duration-300 ease-in-out"
              />
            </div>

            <div className="bg-primary h-[18%] text-white p-4">
              <p className="font-bold text-lg font-nunito">
                Winner of {winner.prize}
              </p>
              <div className="flex justify-between mt-2">
                <p className="text-sm font-semibold font-nunito">
                  {winner.name}
                </p>
                <p className="text-xs font-bold font-nunito">
                  <span className="font-extrabold text-sm">
                    {winner.value}{" "}
                  </span>{" "}
                  Value
                </p>
              </div>
            </div>
            <Link to="/dashboard/activecompetitions">
              <button className=" bg-[#1D1B1C] text-primary h-10 text-md font-extrabold font-nunito w-full  hover:bg-gray-900">
                Join the next competition
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* View all button */}
      <div className="mt-6 text-center">
        <button className="bg-[#1D1B1C] text-white px-6 py-2 rounded hover:bg-gray-800 transition">
          View all winners
        </button>
      </div>
    </div>
  );
};

export default ImageSlider;
