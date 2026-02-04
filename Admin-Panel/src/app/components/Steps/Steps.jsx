import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import React from "react";

function Steps() {
  return (
    <div className="max-w-[1440px] py-10  mx-auto px-4 bg-[#F8F8F8]">
      <div className="flex flex-col md:flex-row justify-around mt-10">
        <div>
          <img
            src={`${ASSET_IMAGES}/frontweb/1st.png`}
            className="w-[50%] mx-auto"
            alt="heading1"
          />
          <p className="font-bold text-[#000000] mt-4 text-center font-arial text-xl">
            Pick your tickets
          </p>
          <p className="font-normal text-[#4e4e4e] mb-4 text-center font-nunito text-lg">
            Choose up to 50 tickets each – and get even closer to winning the grand watch
          </p>
        </div>
        <img
          src={`${ASSET_IMAGES}/frontweb/step-dot.webp`}
          className="h-3 my-auto hidden md:block"
          alt="heading1"
        />
        <div>
          <img
            src={`${ASSET_IMAGES}/frontweb/2nd.png`}
            className="w-[50%] mx-auto"
            alt="heading1"
          />
          <p className="font-bold text-[#000000] mt-4 text-center font-arial text-xl">
            Test your knowledge
          </p>
          <p className="font-normal text-[#4e4e4e] mb-4 text-center font-nunito text-lg">
            Prove your watch skills in this digital quiz – designed to tell the
            experts from the fakers.
          </p>
        </div>
        <img
          src={`${ASSET_IMAGES}/frontweb/step-dot.webp`}
          className="h-3 my-auto hidden md:block"
          alt="heading1"
        />
        <div>
          <img
            src={`${ASSET_IMAGES}/frontweb/3rd.png`}
            className="w-[50%] mx-auto"
            alt="heading1"
          />
          <p className="font-bold text-[#000000] mt-4 text-center font-arial text-xl">
            Win a luxury watch
          </p>
          <p className="font-normal text-[#4e4e4e] mb-4 text-center font-nunito text-lg">
            That’s all! You might leave with a fresh £10,000 watch – starting
            from just £9.99.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Steps;
