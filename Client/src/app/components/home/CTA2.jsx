import React from "react";

export default function CTA2() {
  return (
    <div>
      {" "}
      <section
        className="cta-bg-section fix bg-cover"
        style={{
          backgroundImage: `url('https://ex-coders.com/html/turmet/assets/img/cta-bg.jpg')`,
        }}
      >
        <div className="container">
          <div className="row">
            <div className="cta-wrapper">
              <div className="section-title text-center">
                <span className="sub-title text-white wow fadeInUp">
                  Watch Our Story
                </span>
                <h2
                  className="text-white wow fadeInUp wow"
                  data-wow-delay=".3s"
                >
                  We Provide the Best Tour <br />
                  Facilities
                </h2>
              </div>
              <div className="cta-btn wow fadeInUp wow" data-wow-delay=".5s">
                <a href="tour-details.html" className="theme-btn">
                  Find Out More
                  <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
