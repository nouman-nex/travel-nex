import React from "react";

export default function CTA() {
  return (
    <div>
      <section className="cta-section section-padding">
        <div className="mobile-shape">
          <img
            src="https://ex-coders.com/html/turmet/assets/img/mobile.png"
            alt="img"
          />
        </div>
        <div className="container">
          <div className="row g-4">
            <div
              className="col-lg-6 col-md-6 wow fadeInUp wow"
              data-wow-delay=".3s"
            >
              <div className="cta-items">
                <div className="cta-text">
                  <h2>35% OFF</h2>
                  <p>
                    Explore The World tour <br />
                    Hotel Booking.
                  </p>
                </div>
                <a href="tour-details.html" className="theme-btn">
                  BOOK NOW <i className="fa-solid fa-arrow-right"></i>
                </a>
                <div className="cta-image">
                  <img
                    src="https://ex-coders.com/html/turmet/assets/img/bag-shape.png"
                    alt="img"
                  />
                </div>
              </div>
            </div>
            <div
              className="col-lg-6 col-md-6 wow fadeInUp wow"
              data-wow-delay=".5s"
            >
              <div className="cta-items style-2">
                <div className="cta-text">
                  <h2>35% OFF</h2>
                  <p>
                    On Flight Ticket Grab <br />
                    This Now.
                  </p>
                </div>
                <a href="tour-details.html" className="theme-btn">
                  BOOK NOW <i className="fa-solid fa-arrow-right"></i>
                </a>
                <div className="cta-image">
                  <img
                    src="https://ex-coders.com/html/turmet/assets/img/plane-shape.png"
                    alt="img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
