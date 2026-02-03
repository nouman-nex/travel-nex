import React from "react";

export default function TravelFeature() {
  return (
    <div>
      <section
        className="travel-feature-section section-padding fix"
        style={{
          backgroundImage: `url('https://ex-coders.com/html/turmet/assets/img/travel-bg.jpg')`,
        }}
      >
        <div className="shape-1 float-bob-y">
          <img
            src="https://ex-coders.com/html/turmet/assets/img/plane-shape1.png"
            alt="img"
          />
        </div>
        <div className="shape-2 float-bob-x">
          <img
            src="https://ex-coders.com/html/turmet/assets/img/plane-shape2.png"
            alt="img"
          />
        </div>
        <div className="container">
          <div className="feature-wrapper">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="feature-content">
                  <div className="section-title">
                    <span className="sub-title wow fadeInUp">
                      Are you ready to travel?
                    </span>
                    <h2 className="wow fadeInUp wow" data-wow-delay=".2s">
                      World Leading Online Tour Booking Platform
                    </h2>
                  </div>
                  <p className="wow fadeInUp wow" data-wow-delay=".3s">
                    There are many variations of passages of Lorem Ipsum
                    available, but the majority have suffered alteration in some
                    form, by injected humour, or randomised words which don't
                    look even slightly believable.
                  </p>
                  <div className="feature-area">
                    <div className="line-shape">
                      <img
                        src="https://ex-coders.com/html/turmet/assets/img/line-shape.png"
                        alt="img"
                      />
                    </div>
                    <div
                      className="feature-items wow fadeInUp wow"
                      data-wow-delay=".5s"
                    >
                      <div className="feature-icon-item">
                        <div className="icon">
                          <img
                            src="https://ex-coders.com/html/turmet/assets/img/icon/08.svg"
                            alt="img"
                          />
                        </div>
                        <div className="content">
                          <h5>
                            Most Adventure <br />
                            Tour Ever
                          </h5>
                        </div>
                      </div>
                      <ul className="circle-icon">
                        <li>
                          <i className="fa-solid fa-circle-check"></i>
                        </li>
                        <li>
                          <span>
                            There are many variations of <br />
                            passages of available,
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div
                      className="feature-items wow fadeInUp wow"
                      data-wow-delay=".7s"
                    >
                      <div className="feature-icon-item">
                        <div className="icon">
                          <img
                            src="https://ex-coders.com/html/turmet/assets/img/icon/09.svg"
                            alt="img"
                          />
                        </div>
                        <div className="content">
                          <h5>
                            Real Tour Starts <br />
                            from Here
                          </h5>
                        </div>
                      </div>
                      <ul className="circle-icon">
                        <li>
                          <i className="fa-solid fa-circle-check"></i>
                        </li>
                        <li>
                          <span>
                            There are many variations of <br />
                            passages of available,
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <a
                    href="contact.html"
                    className="theme-btn wow fadeInUp wow"
                    data-wow-delay=".9s"
                  >
                    Contact US
                    <i className="fa-solid fa-arrow-right"></i>
                  </a>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="feature-image wow img-custom-anim-left">
                  <img
                    src="https://ex-coders.com/html/turmet/assets/img/man-image.png"
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
