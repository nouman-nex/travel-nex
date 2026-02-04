import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MEDIA_BASE_URL } from "../../../backendServices/ApiCalls";

const LotteryItemCard = ({ data }) => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState("");
  const [timeUnits, setTimeUnits] = useState({
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const startDate = new Date(data.startDateTime);
      const endDate = new Date(data.endDateTime);

      if (now < startDate) {
        setCurrentStatus("Start In");
        calculateTimeUnits(startDate);
      } else if (now >= startDate && now < endDate) {
        setCurrentStatus("End In");
        calculateTimeUnits(endDate);
      } else {
        setCurrentStatus("Ended");
        setTimeUnits({
          months: 0,
          weeks: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data.startDateTime, data.endDateTime]);

  const calculateTimeUnits = (futureDate) => {
    const now = new Date();
    const future = new Date(futureDate);
    let diffInSeconds = Math.floor((future - now) / 1000);

    if (diffInSeconds <= 0) {
      setTimeUnits({
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      return;
    }

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

    setTimeUnits({ months, weeks, days, hours, minutes, seconds });
  };

  const TimeUnit = ({ value, label, show = true }) => {
    if (!show || value === 0) return null;

    return (
      <div className="flex flex-col items-center mx-1 animate-fadeIn">
        <div className="relative">
          <div className="bg-gradient-to-br from-[#f8f1e0] to-[#e6d3aa] rounded-md px-2 py-1 text-[#6a4e2a] font-bold min-w-8 text-center shadow-sm border border-[#e0c790]">
            {value}
          </div>
        </div>
        <span className="text-xs text-[#9e7f52] mt-1 font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
    );
  };
  const total = data.numberOfTickets;
  const sold = total - data.availableTickets;
  const soldPercent = Math.round((sold / total) * 100);

  return (
    <div className="relative bg-white rounded-3xl shadow-md overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[60%] z-0">
        <div className="w-full h-full bg-[#FFF9EA] group-hover:bg-[#FEC92F] duration-300 delay-100 bottom-tilt"></div>
      </div>

      <div className="relative z-10">
        <div className="my-12 flex justify-center">
          <img
            src={`${MEDIA_BASE_URL}/${data?.featuredImage}`}
            alt="Gold Watch"
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2 px-4 mb-3">
          <div className="w-full h-2 bg-gray-200 rounded relative">
            <span
              className="absolute top-0 left-0 h-2 bg-blue-600 rounded transition-all duration-300"
              style={{ width: `${soldPercent}%` }}
            ></span>
          </div>
          <span className="text-gray-800 font-nunito text-sm min-w-16 font-bold">
            {soldPercent}% sold
          </span>
        </div>

        <div className="px-4 py-2 min-h-20">
          <h4
            className="text-xl group-hover:text-indigo-500 duration-300 delay-100 font-nunito font-extrabold text-[#000000] overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {data.title}
          </h4>
        </div>

        <div className="flex items-center gap-4 px-4 py-4 border-t border-b border-gray-200 justify-between">
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
                {currentStatus !== "Ended" && (
                  <div className="flex flex-wrap items-center justify-start mt-2 animate-slideUp gap-2">
                    <TimeUnit
                      value={timeUnits.months}
                      label="mo"
                      show={timeUnits.months > 0}
                    />
                    <TimeUnit
                      value={timeUnits.weeks}
                      label="w"
                      show={timeUnits.weeks > 0}
                    />
                    <TimeUnit
                      value={timeUnits.days}
                      label="d"
                      show={timeUnits.days > 0}
                    />
                    <TimeUnit value={timeUnits.hours} label="h" />
                    <TimeUnit value={timeUnits.minutes} label="m" />
                    <TimeUnit value={timeUnits.seconds} label="s" />
                  </div>
                )}
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
          {data.winnerId ? (
            <a
              href={data.instagramLiveDrawLink}
              target="_blank"
              className="bg-red-600 rounded-full px-6 h-12 flex items-center justify-center space-x-2 text-white font-medium text-sm cursor-default"
            >
              🎉 Live Draw
            </a>
          ) : (
            <button
              onClick={() => navigate(`/productdetail?id=${data._id}`)}
              className="bg-blue-600 rounded-full px-6 h-12 flex items-center justify-center space-x-2 transition-all duration-300"
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
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
              <span className="text-white text-sm font-medium">View</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LotteryItemCard;
