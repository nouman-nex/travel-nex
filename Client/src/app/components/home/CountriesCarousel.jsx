import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Swiper styles import karna zaroori hai
import "swiper/css";

const countries = [
  {
    name: "Saudi Arabia",
    flag: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg",
  },
  {
    name: "Qatar",
    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Qatar.svg/1280px-Flag_of_Qatar.svg.png",
  },
  {
    name: "Dubai (UAE)",
    flag: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_United_Arab_Emirates.svg",
  },
  {
    name: "Bahrain",
    flag: "https://cdn.britannica.com/67/5767-050-CF112244/Flag-Bahrain.jpg",
  },
  {
    name: "Russia",
    flag: "https://cdn.britannica.com/42/3842-050-68EEE2C4/Flag-Russia.jpg",
  },
  {
    name: "Turkey",
    flag: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg",
  },
  {
    name: "Greece",
    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Greece.svg/1280px-Flag_of_Greece.svg.png",
  },
  {
    name: "Romania",
    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Romania.svg/1280px-Flag_of_Romania.svg.png",
  },
  {
    name: "Azerbaijan",
    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Flag_of_Azerbaijan.svg/330px-Flag_of_Azerbaijan.svg.png",
  },
  {
    name: "Kyrgyzstan",
    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Flag_of_Kyrgyzstan.svg/1280px-Flag_of_Kyrgyzstan.svg.png",
  },
];

export default function CountriesCarousel() {
  return (
    <div className="brand-section section-padding pt-0 overflow-hidden mt-2">
      <div className="container mx-auto px-4">
        <div className="brand-wrapper p-10">
          <h4 className="brand-title wow fadeInUp" data-wow-delay=".3s">
            Countries we cover
          </h4>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={2}
            loop={true}
            speed={3000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            className="brand-slider"
          >
            {countries.map((country, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col justify-center items-center gap-2 py-4 hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <img
                    style={{ height: "50px" }}
                    src={country.flag}
                    alt={country.name}
                  />
                  <p className="text-sm font-medium text-gray-700 text-center">
                    {country.name}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
