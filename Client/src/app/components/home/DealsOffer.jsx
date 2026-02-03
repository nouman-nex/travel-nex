import React from "react";

export default function DealsOffer() {
  return (
    <div>
      <section
        className="deals-offer-section section-padding fix bg-cover"
        style={{
          backgroundImage: `url(https://ex-coders.com/html/turmet/assets/img/offer/bg.jpg)`,
        }}
      >
        <div className="deals-offer-wrapper">
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="price-items">
                <div
                  className="price-image wow fadeInUp wow"
                  data-wow-delay=".2s"
                >
                  <img
                    src="https://ex-coders.com/html/turmet/assets/img/offer/price.png"
                    alt="img"
                  />
                </div>
                <div className="coming-soon-timer">
                  <div
                    className="timer-content wow fadeInUp"
                    data-wow-delay=".2s"
                  >
                    <h2 id="day">00</h2>
                    <p>Days</p>
                  </div>
                  <div
                    className="timer-content wow fadeInUp"
                    data-wow-delay=".4s"
                  >
                    <h2 id="hour">00</h2>
                    <p>Hours</p>
                  </div>
                  <div
                    className="timer-content wow fadeInUp"
                    data-wow-delay=".6s"
                  >
                    <h2 id="min">00</h2>
                    <p>Minutes</p>
                  </div>
                  <div
                    className="timer-content wow fadeInUp"
                    data-wow-delay=".8s"
                  >
                    <h2 id="sec">00</h2>
                    <p>Secound</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="section-title-area">
                <div className="section-title">
                  <span className="sub-title text-white wow fadeInUp">
                    Deals & Offers
                  </span>
                  <h2
                    className="text-white wow fadeInUp wow"
                    data-wow-delay=".3s"
                  >
                    Incredible Last-Minute Offers
                  </h2>
                </div>
                <div
                  className="array-button justify-content-center wow fadeInUp wow"
                  data-wow-delay=".5s"
                >
                  <button className="array-prev">
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                  <button className="array-next">
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
              <div className="offer-slide-items">
                <div className="swiper offer-slider">
                  <div className="swiper-wrapper">
                    <div className="swiper-slide">
                      <div className="offer-items">
                        <div className="offer-image">
                          <img
                            src="https://ex-coders.com/html/turmet/assets/img/offer/01.jpg"
                            alt="img"
                          />
                          <div className="offer-content">
                            <ul className="offer-btn">
                              <li>-50% Off</li>
                              <li className="bg-color">Featured</li>
                            </ul>
                            <div className="content">
                              <h3>
                                <a href="tour-details.html">Nepal City</a>
                              </h3>
                              <span>$160</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="swiper-slide">
                      <div className="offer-items">
                        <div className="offer-image">
                          <img
                            src="https://ex-coders.com/html/turmet/assets/img/offer/02.jpg"
                            alt="img"
                          />
                          <div className="offer-content">
                            <ul className="offer-btn">
                              <li>-50% Off</li>
                            </ul>
                            <div className="content">
                              <h3>
                                <a href="tour-details.html">Mishor</a>
                              </h3>
                              <span>$160</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="swiper-slide">
                      <div className="offer-items">
                        <div className="offer-image">
                          <img
                            src="https://ex-coders.com/html/turmet/assets/img/offer/03.jpg"
                            alt="img"
                          />
                          <div className="offer-content">
                            <ul className="offer-btn">
                              <li>-50% Off</li>
                              <li className="bg-color">Featured</li>
                            </ul>
                            <div className="content">
                              <h3>
                                <a href="tour-details.html">China City</a>
                              </h3>
                              <span>$160</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="swiper-slide">
                      <div className="offer-items">
                        <div className="offer-image">
                          <img
                            src="https://ex-coders.com/html/turmet/assets/img/offer/04.jpg"
                            alt="img"
                          />
                          <div className="offer-content">
                            <ul className="offer-btn">
                              <li>-50% Off</li>
                            </ul>
                            <div className="content">
                              <h3>
                                <a href="tour-details.html">New York City</a>
                              </h3>
                              <span>$160</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
