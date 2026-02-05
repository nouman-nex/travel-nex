import React, { useState } from "react";

import d1 from "../../assets/home/d1.png";
import d2 from "../../assets/home/d2.png";

const destinations = [
  {
    id: 1,
    image: "https://ex-coders.com/html/turmet/assets/img/destination/01.jpg",
    location: "Indonesia",
    rating: 4.7,
    title: "Brooklyn Beach Resort Tour",
    duration: "10 Days",
    travelers: "50+",
    price: 59.0,
  },
  {
    id: 2,
    image: "https://ex-coders.com/html/turmet/assets/img/destination/02.jpg",
    location: "Indonesia",
    rating: 4.7,
    title: "Pak Chumphon Town Tour",
    duration: "10 Days",
    travelers: "50+",
    price: 59.0,
  },
  {
    id: 3,
    image: d1,
    location: "Pakistan",
    rating: 4.7,
    title: "Hunza valley",
    duration: "10 Days",
    travelers: "50+",
    price: 59.0,
  },
  {
    id: 4,
    image: d2,
    location: "Pakistan",
    rating: 4.7,
    title: "Swat",
    duration: "10 Days",
    travelers: "50+",
    price: 59.0,
  },
  // {
  //   id: 5,
  //   image: "https://ex-coders.com/html/turmet/assets/img/destination/05.jpg",
  //   location: "Indonesia",
  //   rating: 4.7,
  //   title: "Brooklyn Beach Resort Tour",
  //   duration: "10 Days",
  //   travelers: "heavy:50+",
  //   price: 59.0,
  // },
  // {
  //   id: 6,
  //   image: "https://ex-coders.com/html/turmet/assets/img/destination/06.jpg",
  //   location: "Indonesia",
  //   rating: 4.7,
  //   title: "Pak Chumphon Town Tour",
  //   duration: "10 Days",
  //   travelers: "50+",
  //   price: 59.0,
  // },
  // {
  //   id: 7,
  //   image: "https://ex-coders.com/html/turmet/assets/img/destination/07.jpg",
  //   location: "Indonesia",
  //   rating: 4.7,
  //   title: "Brooklyn Beach Resort Tour",
  //   duration: "10 Days",
  //   travelers: "50+",
  //   price: 59.0,
  // },
  // {
  //   id: 8,
  //   image: "https://ex-coders.com/html/turmet/assets/img/destination/08.jpg",
  //   location: "Indonesia",
  //   rating: 4.7,
  //   title: "Java & Bali One Life Adventure",
  //   duration: "10 Days",
  //   travelers: "50+",
  //   price: 59.0,
  // },
];

function DestinationCard({ destination, isLiked, onToggleLike }) {
  return (
    <div className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp">
      <div className="destination-card-items">
        <div className="destination-image">
          <img src={destination.image} alt={destination.title} />
          <div
            className="heart-icon"
            onClick={onToggleLike}
            style={{ cursor: "pointer" }}
          >
            <i className={`${isLiked ? "fa-solid" : "fa-regular"} fa-heart`} />
          </div>
        </div>
        <div className="destination-content">
          <ul className="meta">
            <li>
              <i className="fa-solid fa-location-dot" /> {destination.location}
            </li>
            <li className="rating">
              <div className="star">
                <i className="fa-solid fa-star" />
              </div>
              <p>{destination.rating}</p>
            </li>
          </ul>
          <h5>
            <a href="tour-details.html">{destination.title}</a>
          </h5>
          <ul className="info">
            <li>
              <i className="fa-regular fa-clock" />
              {destination.duration}
            </li>
            <li>
              <i className="fa-solid fa-users" /> {destination.travelers}
            </li>
          </ul>
          <div className="price">
            <h6>
              ${destination.price.toFixed(2)}
              <span>/Per day</span>
            </h6>
            <a href="tour-details.html" className="theme-btn style-2">
              Book Now <i className="fa-solid fa-arrow-right" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PopularDestination() {
  const [likedSet, setLikedSet] = useState(new Set());

  const toggleLike = (id) => {
    setLikedSet((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="mt-4">
      <section className="popular-destination-section section-padding pt-0">
        <div className="car-shape float-bob-x">
          <img
            src="https://ex-coders.com/html/turmet/assets/img/destination/car.png"
            alt="car decoration"
          />
        </div>
        <div className="container">
          <div className="section-title-area justify-content-between">
            <div className="section-title">
              <span className="sub-title wow fadeInUp">
                Best Recommended Places for International and Domestic Tours
              </span>
              <h2 className="wow fadeInUp" data-wow-delay=".3s">
                Visit Visa Destination we offer for all
              </h2>
            </div>
            <a
              href="tour-details.html"
              className="theme-btn wow fadeInUp"
              data-wow-delay=".5s"
            >
              View All Tour <i className="fa-solid fa-arrow-right" />
            </a>
          </div>
          <div className="row">
            {destinations.map((dest, index) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                isLiked={likedSet.has(dest.id)}
                onToggleLike={() => toggleLike(dest.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
