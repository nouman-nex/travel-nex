import Footer from "@app/components/Footer/Footer";
import Navbar from "@app/components/Navbar/Navbar";
import Steps from "@app/components/Steps/Steps";
import React, { useEffect } from "react";

function Howtoenter() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full">
      <Navbar />
      <div className="howtoenter-bg1 flex flex-col items-center my-20 py-32 gap-10 justify-center">
        <p className="font-nunito text-center font-semibold max-w-6xl text-3xl md:text-5xl text-primary">
          How to Join
        </p>
        <p className="font-nunito text-center font-bold max-w-6xl text-3xl md:text-5xl text-white">
          Entering WIN4LUX competitions is easy and straightforward.
        </p>
        <p className="font-nunito text-center font-bold text-xl max-w-6xl md:text-3xl text-primary">
          Secure your chance to win your dream watch in the next draw — every
          competition guarantees a winner, regardless of ticket sales. The draw
          date is fixed but may be brought forward if all tickets are sold
          early.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-10 my-24 max-w-[1340px] px-2 mx-auto">
        <div className="md:w-[50%]">
          <p className=" font-nunito text-center md:text-left font-semibold text-3xl md:text-7xl text-[#1D1B1C]">
            Our selection process utilizes the TPAL electronic, computerized
            random draw system.
          </p>
        </div>
        <p className="my-auto font-nunito md:w-[30%] text-center md:text-left font-extrabold text-md md:text-2xl text-[#7C7C7C]">
          Our partner, RandomDraws, uses an independent third-party random
          number generator to ensure a fair and secure winner selection process
        </p>
      </div>
      <div className="bg-[#F8F8F8]">
        <Steps />
      </div>

      <div className="bg-[#1B1B1B] mt-20">
        <Footer />
      </div>
    </div>
  );
}

export default Howtoenter;
