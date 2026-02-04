import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import c1 from "../../assets/home/c1.png";
import c2 from "../../assets/home/c2.png";
import c3 from "../../assets/home/c3.png";
import c4 from "../../assets/home/c4.png";

const categories = [
  {
    // img: "https://ex-coders.com/html/turmet/assets/img/destination/category1.jpg",
    img: c1,
    title: "Adventure",
    tours: "6 Tour",
  },
  {
    img: c2,
    title: "Adventure",
    tours: "6 Tour",
  },
  {
    img: c3,
    title: "Adventure",
    tours: "6 Tour",
  },
  {
    img: c4,
    title: "Adventure",
    tours: "6 Tour",
  },
  {
    img: "https://ex-coders.com/html/turmet/assets/img/destination/category5.jpg",
    title: "Adventure",
    tours: "6 Tour",
  },
];

export default function Destination() {
  return (
    <div>
      <section className="destination-category-section section-padding pt-0">
        <div className="plane-shape float-bob-y">
          <img
            src="https://ex-coders.com/html/turmet/assets/img/destination/shape.png"
            alt="img"
          />
        </div>
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-title wow fadeInUp">
              Wonderful Place For You
            </span>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">
              Browse By Destination Category
            </h2>
          </div>
        </div>
        <div className="container-fluid">
          <Swiper
            className="category-slider"
            spaceBetween={20}
            slidesPerView={3}
            loop={true}
            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
          >
            {categories.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="destination-category-item">
                  <div className="category-image">
                    <img height={400} src={item.img} alt="img" />
                    <div className="category-content">
                      <h5>
                        <a href="destination-details.html">{item.title}</a>
                      </h5>
                      <p>{item.tours}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-dot4 mt-5">
            <div className="dot"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
