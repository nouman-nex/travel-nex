import React from "react";

export default function CTA() {
  const ctaData = [
    {
      discount: "35% OFF",
      title: <>Umrah </>,
      link: "tour-details.html",
      img: "https://ex-coders.com/html/turmet/assets/img/bag-shape.png",
      delay: ".3s",
      styleClass: "",
    },
    {
      discount: "35% OFF",
      title: <>Hajj</>,
      link: "tour-details.html",
      img: "https://ex-coders.com/html/turmet/assets/img/plane-shape.png",
      delay: ".5s",
      styleClass: "style-2",
    },
    {
      discount: "20% OFF",
      title: <>Zayarat</>,
      link: "tour-details.html",
      img: "https://ex-coders.com/html/turmet/assets/img/bag-shape.png",
      delay: ".7s",
      styleClass: "",
    },
  ];

  return (
    <div>
      <section className="cta-section section-padding">
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-title wow fadeInUp">
              Wonderful Place For You
            </span>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">
              Spiritual Journey
            </h2>
          </div>
        </div>
        <div className="mobile-shape">
          <img
            src="https://ex-coders.com/html/turmet/assets/img/mobile.png"
            alt="img"
          />
        </div>
        <div className="container">
          <div className="row g-4 justify-content-center">
            {ctaData.map((item, index) => (
              <div
                key={index}
                className="col-lg-6 col-md-6 wow fadeInUp"
                data-wow-delay={item.delay}
              >
                <div className={`cta-items ${item.styleClass}`}>
                  <div className="cta-text">
                    {/* Yahan swapping ki gayi hai */}
                    <h2>{item.title}</h2>
                    <p>{item.discount}</p>
                  </div>
                  <a href={item.link} className="theme-btn">
                    BOOK NOW <i className="fa-solid fa-arrow-right"></i>
                  </a>
                  <div className="cta-image mb-2">
                    <img src={item.img} alt="img" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
