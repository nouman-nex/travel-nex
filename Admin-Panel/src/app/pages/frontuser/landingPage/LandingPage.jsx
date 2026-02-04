import Faqs from "@app/components/Faqs/Faqs";
import Footer from "@app/components/Footer/Footer";
import Header from "@app/components/Header/Header";
// import LotteryOffering from "@app/components/LotteryOffering/LotteryOffering";
import Navbar from "@app/components/Navbar/Navbar";
import BigWin from "@app/components/Offer/BigWin";
import Offer from "@app/components/Offer/Offer";
import Reviews from "@app/components/Reviews/Reviews";
import Steps from "@app/components/Steps/Steps";
import React from "react";

function LandingPage() {
  window.scrollTo(0, 0);
  return (
    <div className="w-full">
      <Navbar />
      <div className="bg-[#FFF9EA] mb-40 md:mb-0">
        <Header />
      </div>
      {/* <LotteryOffering /> */}
      <div className="bg-gray-900">
        <Offer />
      </div>
      <BigWin />
      <div className="bg-[#F8F8F8]">
        <Steps />
      </div>
      <div className="bg-[#ffffff]">
        <Reviews />
      </div>
      <Faqs />
      <div className="bg-[#1B1B1B]">
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;
