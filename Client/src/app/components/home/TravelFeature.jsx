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
            className="m-auto mt-2"
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
                      Ready to start your career abroad?
                    </span>
                    <h2 className="wow fadeInUp wow" data-wow-delay=".2s">
                      Your Trusted Partner for Global Work Permits
                    </h2>
                  </div>
                  <p className="wow fadeInUp wow" data-wow-delay=".3s">
                    We provide authentic and fast work permit services for top
                    global destinations. Our team supports you at every
                    step—from documentation to final visa approval—so that your
                    career can grow at an international level.
                  </p>
                  <div className="feature-area">
                    <div className="line-shape">
                      <img
                        src="https://ex-coders.com/html/turmet/assets/img/line-shape.png"
                        alt="img"
                      />
                    </div>
                    {/* Feature 1: Work Permit */}
                    <div
                      className="feature-items wow fadeInUp wow"
                      data-wow-delay=".5s"
                    >
                      <div className="feature-icon-item">
                        <div className="icon">
                          <img
                            style={{ margin: "10px auto" }}
                            src="https://ex-coders.com/html/turmet/assets/img/icon/08.svg"
                            alt="img"
                          />
                        </div>
                        <div className="content">
                          <h5>
                            Professional <br />
                            Work Permits
                          </h5>
                        </div>
                      </div>
                      <ul className="circle-icon">
                        <li>
                          <i className="fa-solid fa-circle-check"></i>
                        </li>
                        <li>
                          <span>
                            Schengen, UK, Canada and Gulf <br /> legal work
                            permits.
                          </span>
                        </li>
                      </ul>
                    </div>
                    {/* Feature 2: Documentation */}
                    <div
                      className="feature-items wow fadeInUp wow"
                      data-wow-delay=".7s"
                    >
                      <div className="feature-icon-item">
                        <div className="icon">
                          <img
                            style={{ margin: "10px auto" }}
                            src="https://ex-coders.com/html/turmet/assets/img/icon/09.svg"
                            alt="img"
                          />
                        </div>
                        <div className="content">
                          <h5>
                            Fast Track <br />
                            Visa Processing
                          </h5>
                        </div>
                      </div>
                      <ul className="circle-icon">
                        <li>
                          <i className="fa-solid fa-circle-check"></i>
                        </li>
                        <li>
                          <span>
                            Hassle-free documentation and filing with
                            <br /> a 99% success rate.
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
                    Get Free Consultation
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
