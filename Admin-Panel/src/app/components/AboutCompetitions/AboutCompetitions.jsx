import { useState, useEffect } from "react";
import { MEDIA_BASE_URL } from "../../../backendServices/ApiCalls";
import { useNavigate } from "react-router-dom";

export default function AboutCompetitions({
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
    <div className=" text-white overflow-hidden rounded-md shadow-2xl w-full flex flex-col md:flex-row">
      {/* Left: Image */}
      <div className="relative bg-zinc-900 group md:w-2/3 min-w-[250px] md:max-w-[60%]">
        {featuredImage && (
          <img
            src={`${MEDIA_BASE_URL}/${featuredImage}`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ minHeight: 300, maxHeight: 400 }}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h2 className="text-2xl font-bold font-nunito">{title}</h2>
        </div>
      </div>

      {/* Right: Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center border-b border-gray-800 px-6 py-4">
            <div>
              <div className="text-xl font-bold text-primary font-nunito">
                £{ticketValue}
              </div>
              <div className="text-xs text-zinc-900 font-medium font-nunito">
                Entry Price
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-zinc-900 font-bold font-nunito">
                {availableTickets}
              </div>
              <div className="text-xs text-zinc-900 font-medium">
                Max Tickets
              </div>
            </div>
          </div>
          <div className="border-b border-gray-800 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                {[
                  { label: "DAY", value: timeLeft.days },
                  { label: "HR", value: timeLeft.hours },
                  { label: "MIN", value: timeLeft.minutes },
                  { label: "SEC", value: timeLeft.seconds },
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl text-zinc-900 font-bold font-nunito">
                      {item.value}
                    </div>
                    <div className="text-xs font-medium text-zinc-900">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-lg font-medium font-arial text-gray-400">
                {isEnded ? "Ended" : "End In"}
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4">
          <button
            onClick={() => navigate(`/productdetail?id=${_id}`)}
            className="w-full mt-2 bg-primary hover:bg-hover text-white py-3 rounded-sm font-semibold font-nunito shadow-lg transition-all duration-300"
          >
            Get your ticket
          </button>
        </div>
      </div>
    </div>
  );
}
