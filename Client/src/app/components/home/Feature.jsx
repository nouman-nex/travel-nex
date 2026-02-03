import React from "react";

const features = [
  {
    icon: "https://ex-coders.com/html/turmet/assets/img/icon/01.svg",
    title: "A Lot of Discount",
    bgColor: "#D2EEF5",
  },
  {
    icon: "https://ex-coders.com/html/turmet/assets/img/icon/02.svg",
    title: "Best Guide",
    bgColor: "#FEE8E8",
  },
  {
    icon: "https://ex-coders.com/html/turmet/assets/img/icon/03.svg",
    title: "24/7 Support",
    bgColor: "#D2EEF5",
  },
  {
    icon: "https://ex-coders.com/html/turmet/assets/img/icon/04.svg",
    title: "Travel Management",
    bgColor: "#D2EEF5",
  },
];

export default function Feature() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Icon Circle */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: item.bgColor }}
              >
                <img
                  src={item.icon}
                  alt="icon"
                  className="w-10 h-10 object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
