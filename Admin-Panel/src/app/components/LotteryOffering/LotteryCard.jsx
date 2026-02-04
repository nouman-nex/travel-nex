import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LotteryItemCard = ({ data }) => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const startDate = new Date(data.startDateTime);
      const endDate = new Date(data.endDateTime);

      if (now < startDate) {
        setCurrentStatus("Start In");
        setTimeRemaining(formatTimeDifference(startDate));
      } else if (now >= startDate && now < endDate) {
        setCurrentStatus("End In");
        setTimeRemaining(formatTimeDifference(endDate));
      } else {
        setCurrentStatus("Ended");
        setTimeRemaining("");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data.startDateTime, data.endDateTime]);

  const formatTimeDifference = (futureDate) => {
    const now = new Date();
    const future = new Date(futureDate);
    let diffInSeconds = Math.floor((future - now) / 1000);

    if (diffInSeconds <= 0) return "0s";

    const months = Math.floor(diffInSeconds / (30 * 24 * 60 * 60));
    diffInSeconds %= 30 * 24 * 60 * 60;

    const weeks = Math.floor(diffInSeconds / (7 * 24 * 60 * 60));
    diffInSeconds %= 7 * 24 * 60 * 60;

    const days = Math.floor(diffInSeconds / (24 * 60 * 60));
    diffInSeconds %= 24 * 60 * 60;

    const hours = Math.floor(diffInSeconds / 3600);
    diffInSeconds %= 3600;

    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;

    return [
      months ? `${months}mo` : "",
      weeks ? `${weeks}w` : "",
      days ? `${days}d` : "",
      hours ? `${hours}h` : "",
      minutes ? `${minutes}m` : "",
      seconds ? `${seconds}s` : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <div className="relative bg-white rounded-3xl shadow-md overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[60%] z-0">
        <div className="w-full h-full bg-[#FFF9EA] group-hover:bg-[#FEC92F] duration-300 delay-100 bottom-tilt"></div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-start pt-5 pl-5 mb-4">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="21" r="1"></circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
            </svg>
          </button>
        </div>

        <div className="my-12 flex justify-center">
          <img src={data.media.url} alt="Gold Watch" className="w-full" />
        </div>

        <div className="flex items-center gap-2 px-4 mb-3">
          <div className="w-full h-2 bg-gray-200 rounded relative">
            <span
              className="absolute top-0 left-0 h-2 bg-blue-600 rounded transition-all duration-300"
              style={{ width: `${data.sold}%` }}
            ></span>
          </div>
          <span className="text-gray-800 font-nunito text-sm min-w-16 font-bold">
            {data?.sold}% Sold
          </span>
        </div>

        <div className="px-4 py-4">
          <h4 className="text-xl group-hover:text-indigo-500 duration-300 delay-100 font-nunito font-extrabold text-[#000000]">
            {data.title}
          </h4>
        </div>

        <div className="flex items-center gap-4 px-4 py-4 border-t border-b border-gray-200">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#000000]"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-black font-nunito">{currentStatus}</span>
          </div>
          {currentStatus !== "Ended" && (
            <>
              <div className="border-l h-6 border-gray-300"></div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#000000]"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12" y2="16"></line>
                </svg>
                <span className="text-[#000000] font-nunito">
                  {timeRemaining}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-6">
          <div>
            <span className="text-3xl duration-300 delay-100 group-hover:text-indigo-500 font-bold text-[#000000]">
              ${data.ticketValue}
            </span>
            <span className="text-lg font-bold ml-2 uppercase">PER ENTRY</span>
          </div>
          <button
            className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center"
            onClick={() => navigate("/productdetail")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LotteryItemCard;
