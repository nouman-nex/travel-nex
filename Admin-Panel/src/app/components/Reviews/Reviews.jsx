import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";

const testimonials = [
  {
    id: 1,
    title: "Quick & easy",
    text: "From the moment I purchased my ticket to claiming my prize, journey. The transparency and excitement are unmatched. Highly recommend!",
    author: "Masud Rana",
    position: "Andrew Russel",
  },
  {
    id: 2,
    title: "Excellent Service",
    text: "I was skeptical at first, but the whole process was seamless. Customer support was responsive and helpful throughout my journey.",
    author: "Amir Khan",
    position: "Business Owner",
  },
  {
    id: 3,
    title: "Life Changing",
    text: "Never thought I would win, but here I am! The team made sure everything was handled professionally from start to finish.",
    author: "Sara Ahmed",
    position: "Teacher",
  },
  {
    id: 4,
    title: "Trustworthy Platform",
    text: "I've participated in many draws before, but this one stands out for its transparency and fairness. Will definitely participate again!",
    author: "Hassan Ali",
    position: "Software Engineer",
  },
];
function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");

  const goToPrevious = () => {
    setDirection("left");
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setDirection("right");
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const variants = {
    enter: (direction) => ({
      x: direction === "right" ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction === "right" ? -300 : 300,
      opacity: 0,
    }),
  };
  return (
    <div className="max-w-[1440px] py-20  mx-auto px-4 bg-[#ffffff] ">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-[60%]">
          <div className="flex gap-1 flex-row">
            <img
            src={`${ASSET_IMAGES}/frontweb/section-icon.png`}
              className="md:w-[3%] md:h-[2%]"
              alt="heading1"
            />
            <p className="font-sans font-bold text-[18px] text-[#554AFF] ">
              Watch Lottery Triumphs
            </p>
          </div>
          <p className="text-4xl md:text-6xl font-bold mt-2 font-nunito text-[#000000]">
            Watch Lottery{" "}
            <span className="text-4xl md:text-6xl font-bold font-nunito text-[#FF650E] underline">
              Success!
            </span>
          </p>
          <div className="flex flex-row">
            <ul className="flex list-none mt-[-6%] justify-center items-center">
              <li className="ml-0">
                <a
                  href="/"
                  className="bg-white flex items-center justify-center rounded-full overflow-hidden w-14 h-14 border-2 border-white"
                >
                  <img
                    src="https://softivuspro.com/wp/lottovibe/wp-content/uploads/2024/12/customer3.webp"
                    alt="Customer 3"
                    className="object-cover w-full h-full"
                  />
                </a>
              </li>
              <li className="-ml-4">
                <a
                  href="/"
                  className="bg-white flex items-center justify-center rounded-full overflow-hidden w-14 h-14 border-2 border-white"
                >
                  <img
                    src="https://softivuspro.com/wp/lottovibe/wp-content/uploads/2024/12/customer2.webp"
                    alt="Customer 2"
                    className="object-cover w-full h-full"
                  />
                </a>
              </li>
              <li className="-ml-4">
                <a
                  href="/"
                  className="bg-white flex items-center justify-center rounded-full overflow-hidden w-14 h-14 border-2 border-white"
                >
                  <img
                    src="https://softivuspro.com/wp/lottovibe/wp-content/uploads/2024/12/customer1.webp"
                    alt="Customer 1"
                    className="object-cover w-full h-full"
                  />
                </a>
              </li>
              <li className="-ml-4">
                <a
                  href="/"
                  className="bg-white flex items-center justify-center rounded-full w-14 h-14 border-2 border-white"
                >
                  <span className="grid text-sm font-semibold text-black text-center p-2 bg-[#aefe3a] rounded-full w-full h-full place-content-center">
                    10K+
                  </span>
                </a>
              </li>
            </ul>
            <p className="text-4xl md:text-6xl font-bold mt-4 font-nunito mb-16 text-[#000000]">
              Reviews!
            </p>
          </div>
        </div>
        <div className="my-auto">
          <p className=" font-bold text-[#000000] font-nunito text-base">
            Trustpilot
          </p>
          <img
          src={`${ASSET_IMAGES}/frontweb/stars.png`}
            className="w-[50%] my-2"
            alt="heading1"
          />
          <p className=" font-bold text-[#000000] font-arial text-xl">
            4.5- (25,750Reviews)
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row ">
        <img
        src={`${ASSET_IMAGES}/frontweb/persons.png`}
          className=" md:w-[40%] "
          alt="heading1"
        />
        <div className="max-w-3xl mx-auto md:p-6 font-sans">
          <div className="relative overflow-hidden bg-white rounded-lg">
            <div className="p-8">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="text-left"
                >
                  <div className="mb-4">
                    <h2 className="text-3xl font-bold text-[#000000] font-arial">
                      {testimonials[currentIndex].title}
                    </h2>
                  </div>

                  <p className="text-[#4e4e4e] mb-6 text-lg font-nunito font-normal">
                    "{testimonials[currentIndex].text}"
                  </p>

                  <div className="mt-8">
                    <p className="font-bold text-xl text-[#1a1a1a] font-nunito">
                      {testimonials[currentIndex].author}
                    </p>
                    <p className="font-semibold font-nunito text-base text-[#1a1a1a]">
                      {testimonials[currentIndex].position}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center px-6 py-4">
              <div className="text-4xl font-nunito text-[#1a1a1a] font-extrabold">
                {currentIndex + 1} / {testimonials.length}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={goToPrevious}
                  className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  onClick={goToNext}
                  className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reviews;
