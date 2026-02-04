import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const targetDateTime = "2025-04-30T22:00:00";
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDateTime) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateTime]);
  return (
    <div className="max-w-[1440px] mx-auto px-4 bg-[#FFF9EA] relative">
      <div className="flex flex-col h-auto md:flex-row pb-20 pt-32">
        <div className=" md:w-[60%]">
          <h4 className="text-[#000000] font-arial text-lg lg:text-xl font-semibold">
            Glamour in Every Draw
          </h4>
          <span className="font-nunito text-[#000000] font-extrabold text-3xl lg:text-5xl xl:text-7xl">
            Your Ticket{" "}
            <span className="inline-block text-center">
              <svg
                height="60"
                viewBox="0 0 110 84"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[50px] sm:w-[90px] md:w-[60px] lg:w-[100px] ml-auto mb-[-10px]"
              >
                <path
                  d="M18.8164 1.26562L20.5612 45.1542"
                  stroke="#FF650E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M33.7734 29.8076L33.0918 48.769"
                  stroke="#FF650E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M60.1542 22.0535L40.3501 53.6177M61.7669 52.0143L45.975 59.9903M100.399 60.0482L50.4313 68.0613"
                  stroke="#FF650E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="uppercase text-[#FF650E] font-extrabold block">
                TWO
              </span>
            </span>
            <svg
              width="200"
              height="6"
              viewBox="0 0 141 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-[40%] xl:ml-[50%] -mt-2 w-[80px] sm:w-[90px] md:w-[70px] lg:w-[200px]"
            >
              <path
                d="M1 5C22.8731 2.55684 81.2954 -1.30336 140 2.80115"
                stroke="#FF650E"
              />
            </svg>
            {/* WHEEL EUPHORIA! */}
            <span className="uppercase font-nunito mt-4 text-[#000000] font-extrabold block">
              Wheel Euphoria!
            </span>
          </span>

          <p
            className="text-[#5D5C5B] font-nunito md:text-lg lg:text-2xl text-[20px] mt-4 max-w-[520px] mb-5 lg:mb-8 xl:mb-10"
            data-aos="fade-down-right"
            data-aos-duration="1500"
          >
            Join the excitement. Get your ticket now, ride toward winning your
            dream bike!
          </p>
          <div className="flex cursor-pointer flex-row">
            <span className=" bg-[#FEC92F]  text-[#000000] px-4 py-2 rounded-3xl font-semibold">
              Participate Now
            </span>
            <span className="mr-1 bg-[#FEC92F] px-1 rounded-full">
              <img
                src={`${ASSET_IMAGES}/frontweb/participatenow.png`}
                className="w-8 mt-1.5 h-7 my-auto"
                alt="Participate Now"
              />
            </span>
            <Link
              to="/"
              className="text-neutral-800 font-bold hover:text-[#FEC92F] ml-4 border-b-2 border-black my-auto transition duration-300"
              data-aos="zoom-in-left"
              data-aos-duration="800"
            >
              How It Works
            </Link>
          </div>
          <div className="flex flex-wrap  items-center mt-8 gap-4 sm:gap-8 xl:gap-10 pt-0">
            <div className="text-center">
              <div className="flex items-center justify-center md:text-3xl lg:text-5xl font-bold text-[#000000]">
                100<span className="ml-1">k+</span>
              </div>
              <p className="text-[#4E4E4E] font-nunito text-xl mt-2">
                Customers
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center md:text-3xl lg:text-5xl font-bold text-[#000000]">
                82<span className="ml-1">k+</span>
              </div>
              <p className="text-[#4E4E4E] font-nunito text-xl mt-2">Artwork</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center md:text-3xl lg:text-5xl font-bold text-[#000000]">
                12<span className="ml-1">k+</span>
              </div>
              <p className="text-[#4E4E4E] font-nunito text-xl mt-2">Owner</p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-row">
            <img
              src={`${ASSET_IMAGES}/frontweb/heading1.png`}
              className="w-[90%] md:w-[60%] h-[80%]"
              alt="heading1"
            />
            <p className="font-nunito hidden sm:block flex flex-wrap max-w-48 my-auto text-[20px] text-[#5D5C5B] ">
              Embark on a journey into the realm of NFT glory and digital
              triumphs!
            </p>
          </div>
          <div className="flex flex-row mt-[-15%]">
            <div className="grid justify-center mx-auto sm:mx-0 pt-0">
              <ul className="flex list-none justify-center mt-[40%] items-center">
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
              <span className="flex items-center justify-center gap-2 font-bold uppercase text-[#000000]">
                Excellent{" "}
                <span className="text-xl font-bold text-[#ff650e]">7,000+</span>{" "}
                Reviews
              </span>
            </div>
            <img
               src={`${ASSET_IMAGES}/frontweb/heading2.png`}
              className="w-[100%] h-[100%] hidden sm:block"
              alt="heading2"
            />
          </div>
        </div>
      </div>
      <div className="header-bg bottom-[-15%] md:bottom-[-25%] w-[100%] absolute flex flex-col md:flex-row">
        <img
          src="https://softivuslab.com/wp/lottovibe/wp-content/uploads/2025/02/Frame-1000002335-1.webp"
          alt="Gold Watch with Blue Face"
          className="w-[35%] hidden md:block"
        />
        <img
           src={`${ASSET_IMAGES}/frontweb/header2.png`}
          alt="Gold Watch with Blue Face"
          className="w-[35%] md:w-[20%] md:h-[30%] md:my-auto "
        />
        <div className="mx-auto my-auto">
          <p className="font-extrabold mt-10 text-[#000000] text-center font-arial text-4xl">
            Next Draw
          </p>
          <div className="flex flex-row mt-6 gap-4">
            <div>
              <p className="font-extrabold text-[#000000] font-nunito text-4xl">
                {timeLeft.days}
              </p>
              <p className="font-normal text-[#000000] text-center font-nunito text-lg">
                Days
              </p>
            </div>
            <p className="font-extrabold text-[#000000] font-nunito text-4xl">
              :
            </p>
            <div>
              <p className="font-extrabold text-[#000000] font-nunito text-4xl">
                {timeLeft.hours}
              </p>
              <p className="font-normal text-[#000000] text-center font-nunito text-lg">
                Hours
              </p>
            </div>
            <p className="font-extrabold text-[#000000] font-nunito text-4xl">
              :
            </p>
            <div>
              <p className="font-extrabold text-[#000000] font-nunito text-4xl">
                {timeLeft.minutes}
              </p>
              <p className="font-normal text-[#000000] text-center font-nunito text-lg">
                Minutes
              </p>
            </div>
            <p className="font-extrabold text-[#000000] font-nunito text-4xl">
              :
            </p>
            <div>
              <p className="font-extrabold text-[#000000] font-nunito text-4xl">
                {timeLeft.seconds}
              </p>
              <p className="font-normal text-[#000000] text-center font-nunito text-lg">
                Seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
