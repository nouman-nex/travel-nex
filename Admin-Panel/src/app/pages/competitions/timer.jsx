import React, { useState, useEffect } from "react";

const RoyalGoldTimer = ({ endDateTime }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endTime = new Date(endDateTime).getTime();
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDateTime]);

  // Leading zero formatting
  const formatNumber = (num) => {
    return num.toString().padStart(2, "0");
  };

  if (isExpired) {
    return (
      <div className="flex justify-center items-center py-3 px-4 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg shadow-lg">
        <span className="text-white font-bold text-xl">Expired</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 rounded-lg blur-sm"></div>
      <div className="relative flex flex-col justify-center items-center py-3 px-6 bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 rounded-lg border border-amber-300 shadow-xl overflow-hidden">
        {/* Timer shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/50 to-transparent -translate-x-full animate-shimmer"></div>

        {/* Title */}
        <div className="text-amber-800 font-semibold text-sm mb-1">
          Time Remaining
        </div>

        {/* Timer display */}
        <div className="flex justify-center items-center space-x-2 md:space-x-3">
          <TimeUnit value={timeLeft.days} label="Days" />
          <TimerSeparator />
          <TimeUnit value={formatNumber(timeLeft.hours)} label="Hours" />
          <TimerSeparator />
          <TimeUnit value={formatNumber(timeLeft.minutes)} label="Mins" />
          <TimerSeparator />
          <TimeUnit value={formatNumber(timeLeft.seconds)} label="Secs" />
        </div>
      </div>
    </div>
  );
};

// Individual time unit component
const TimeUnit = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="bg-gradient-to-b from-amber-500 to-yellow-600 text-white font-bold rounded-md px-2 py-1 min-w-[40px] text-center">
      {value}
    </div>
    <div className="text-amber-800 text-xs mt-1">{label}</div>
  </div>
);

// Separator between time units
const TimerSeparator = () => (
  <div className="text-amber-600 font-bold text-xl">:</div>
);

export default RoyalGoldTimer;
