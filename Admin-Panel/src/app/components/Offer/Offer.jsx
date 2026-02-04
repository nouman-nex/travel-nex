import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import React from "react";
import { Link } from "react-router-dom";

function Offer() {
  return (
    <div className="max-w-[1440px] mx-auto px-4">
      <div className="bg-gray-900 pb-10 pt-24">
        <div className="flex gap-1 flex-row">
          {/* <img
            src={`${ASSET_IMAGES}/frontweb/global-picon-1.webp`}
            className="md:w-[2%] md:h-[2%]"
            alt="heading1"
          /> */}
          <p className="font-sans font-bold text-[18px] text-primary ">
            Bicycle Bliss Awaits
          </p>
        </div>
        <div className="flex flex-col md:flex-row ">
          <div className="md:w-[50%] mt-4">
            <p className="text-white font-bold font-nunito text-3xl md:text-5xl">
              Countdown to Two-
            </p>
            <p className="text-white font-bold font-nunito text-3xl md:text-5xl">
              Wheel{" "}
              <span className="font-bold font-nunito text-3xl md:text-5xl text-primary">
                {" "}
                Triumph!{" "}
              </span>
            </p>
          </div>
          <div className="md:w-[40%]">
            <p className="text-white text-xl mt-4 md:mt-0 font-nunito font-normal">
              The anticipation is building, and the thrill is about to hit its
              peak! We are excited to announce the kickoff of our exclusive Bike
              Lottery,
            </p>
            <Link to="/dashboard/activecompetitions">
              <div className="flex flex-row mt-4">
                <p className=" bg-primary font-nunito text-[#ffffff]  px-5 py-3 rounded-3xl font-bold">
                  Explore Our Offer
                </p>
                <div className="mr-1 bg-primary px-1 rounded-full">
                  <img
                    src={`${ASSET_IMAGES}/frontweb/participatenow.png`}
                    className="w-9 mt-2 h-8 my-auto"
                    alt="Participate Now"
                  />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Offer;
