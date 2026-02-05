import React from "react";

export default function CTA() {
  const ctaData = [
    {
      title: "Umrah",
      link: "tour-details.html",
      img: "https://ex-coders.com/html/turmet/assets/img/bag-shape.png",
      delay: ".3s",
      styleClass: "", // Usually your CSS handles the green gradient here
    },
    {
      title: "Hajj",
      link: "tour-details.html",
      img: "https://ex-coders.com/html/turmet/assets/img/plane-shape.png",
      delay: ".5s",
      styleClass: "style-2", // Usually handles the blue/purple gradient
    },
    {
      title: "Zayarat",
      link: "tour-details.html",
      img: "https://ex-coders.com/html/turmet/assets/img/bag-shape.png",
      delay: ".7s",
      styleClass: "",
    },
  ];

  return (
    <section className="cta-section section-padding">
      <div className="container">
        <div className="section-title text-center mb-5">
          <span className="sub-title wow fadeInUp">
            Wonderful Place For You
          </span>
          <h2 className="wow fadeInUp" data-wow-delay=".2s">
            Spiritual Journey
          </h2>
        </div>

        <div className="row g-4 justify-content-center">
          {ctaData.map((item, index) => (
            <div
              key={index}
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay={item.delay}
            >
              {/* Added relative positioning via style or your existing cta-items class */}
              <div
                className={`cta-items ${item.styleClass} position-relative overflow-hidden`}
                style={{
                  borderRadius: "15px",
                  minHeight: "250px",
                  display: "flex",
                  alignItems: "center",
                  padding: "30px",
                }}
              >
                <div
                  className="cta-content"
                  style={{ zIndex: 2, position: "relative", width: "60%" }}
                >
                  <div className="cta-text mb-4">
                    <h2
                      className="text-white m-0"
                      style={{ fontSize: "2.5rem", fontWeight: "bold" }}
                    >
                      {item.title}
                    </h2>
                  </div>
                  <a
                    href={item.link}
                    className="theme-btn"
                    style={{
                      borderRadius: "30px",
                      padding: "10px 25px",
                      backgroundColor: "#fff",
                      color: "#00c3ff",
                      fontWeight: "bold",
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    BOOK NOW <i className="fa-solid fa-arrow-right ms-2"></i>
                  </a>
                </div>

                {/* Background Image/Shape positioning */}
                <div
                  className="cta-image"
                  style={{
                    position: "absolute",
                    right: "0",
                    bottom: "0",
                    width: "60%",
                    zIndex: 1,
                  }}
                >
                  <img
                    src={item.img}
                    alt="shape"
                    style={{ width: "100%", objectFit: "contain" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
