import { useState, useEffect } from "react";
import { MEDIA_BASE_URL } from "../../../backendServices/ApiCalls";
import { useNavigate } from "react-router-dom";

export default function Header2({
  _id,
  pictures = [],
  title,
  ticketValue,
  availableTickets,
  endDateTime,
  featuredImage,
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isEnded, setIsEnded] = useState(false);
  const navigate = useNavigate();

  const lastImage = pictures.length > 0 ? pictures[pictures.length - 1] : null;

  useEffect(() => {
    const end = new Date(endDateTime).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = end - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
        setIsEnded(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsEnded(true);
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, [endDateTime]);

  return (
    <div className="bg-black text-white overflow-hidden rounded-2xl shadow-xl w-full">
      <div className="relative group">
        {featuredImage && (
          <img
            src={`${MEDIA_BASE_URL}/${featuredImage}`}
            alt={title}
            className="w-full h-auto object-cover transform scale-105 transition-transform duration-500 ease-in-out group-hover:scale-100"
            style={{ height: "450px", objectFit: "cover" }}
          />
        )}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold font-nunito">{title}</h2>
          </div>
        </div>
      </div>

      <div className=" border-t border-gray-700">
        <div className=" p-4 ml-10">
          <div className="text-left">
            <div className="text-primary font-nunito font-bold text-2xl">
              £{ticketValue}
            </div>
            <div className="text-sm font-nunito text-gray-400">Entry Price</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border-t border-gray-700">
        <div className="text-center w-1/4">
          <span className="block text-3xl font-bold font-nunito text-white">
            {availableTickets}
          </span>
          <span className="text-xs font-medium font-arial text-gray-400">
            MAXIMUM TICKETS
          </span>
        </div>

        <button
          className="bg-primary hover:bg-hover text-white py-3 px-5 rounded-3xl flex items-center text-md shadow-md hover:shadow-lg transition-all duration-300 ease-in-out group"
          onClick={() => navigate(`/productdetail?id=${_id}`)}
        >
          <span className="mr-2 group-hover:translate-x-2 transition-transform duration-300">
            Get your ticket
          </span>
          {/* Arrow icon */}
        </button>
      </div>

      <div className="border-t border-gray-700">
        <div className="flex justify-center items-center p-4 space-x-6">
          <div className="bg-transparent p-4 rounded-lg shadow-md w-full mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {[
                  { label: "DAY", value: timeLeft.days },
                  { label: "HR", value: timeLeft.hours },
                  { label: "MIN", value: timeLeft.minutes },
                  { label: "SEC", value: timeLeft.seconds },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`w-16 h-12 flex flex-col items-center justify-center text-white border-white ${
                      index === 3 ? "" : "border-r"
                    } `}
                  >
                    <span className="text-2xl font-bold font-nunito">
                      {item.value}
                    </span>
                    <span className="text-xs font-medium font-arial text-gray-400">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-lg font-medium font-arial text-gray-400">
                {isEnded ? "Ended" : "End In"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
