import React from "react";

export default function Footer() {
  return (
    <div>
      {" "}
      <footer
        className="footer-section fix bg-cover"
        style={{
          backgroundImage:
            "url(https://ex-coders.com/html/turmet/assets/img/footer/footer-bg.jpg)",
        }}
      >
        <div className="container">
          <div className="footer-widget-wrapper-new">
            <div className="row">
              <div
                className="col-xl-4 col-lg-5 col-md-8 col-sm-6 wow fadeInUp wow"
                data-wow-delay=".2s"
              >
                <div className="single-widget-items text-center">
                  <div className="widget-head">
                    <a href="index.html">
                      <img
                        src="https://ex-coders.com/html/turmet/assets/img/logo/white-log.svg"
                        alt="img"
                      />
                    </a>
                  </div>
                  <div className="footer-content">
                    <h3>Subscribe Newsletter</h3>
                    <p>Get Our Latest Deals and Update</p>
                    <div className="footer-input">
                      <input
                        type="email"
                        id="email2"
                        placeholder="Your email address"
                      />
                      <button
                        className="newsletter-btn theme-btn"
                        type="submit"
                      >
                        Subscribe <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                    <div className="social-icon d-flex align-items-center justify-content-center">
                      <a href="#">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href="#">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href="#">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                      <a href="#">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-xl-2 col-lg-3 col-md-4 col-sm-6 ps-lg-5 wow fadeInUp wow"
                data-wow-delay=".4s"
              >
                <div className="single-widget-items">
                  <div className="widget-head">
                    <h4>Quick Links</h4>
                  </div>
                  <ul className="list-items">
                    <li>
                      <a href="index.html">Home</a>
                    </li>
                    <li>
                      <a href="index.html">About Us</a>
                    </li>
                    <li>
                      <a href="news.html">Blog</a>
                    </li>
                    <li>
                      <a href="tour-details.html">Services</a>
                    </li>
                    <li>
                      <a href="tour-details.html">Bank Account</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="col-xl-3 col-lg-4 col-md-6 col-sm-6 ps-lg-5 wow fadeInUp wow"
                data-wow-delay=".6s"
              >
                <div className="single-widget-items">
                  <div className="widget-head">
                    <h4>Branches</h4>
                  </div>
                  <ul className="list-items">
                    <li>
                      <a href="tour-details.html">Wanderlust Adventures</a>
                    </li>
                    <li>
                      <a href="tour-details.html">Globe Trotters Travel</a>
                    </li>
                    <li>
                      <a href="tour-details.html">Odyssey Travel Services</a>
                    </li>
                    <li>
                      <a href="tour-details.html">Jet Set Journeys</a>
                    </li>
                    <li>
                      <a href="tour-details.html">Dream Destinations Travel</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="col-xl-3 col-lg-4 col-md-6 col-sm-6 ps-xl-5 wow fadeInUp wow"
                data-wow-delay=".6s"
              >
                <div className="single-widget-items">
                  <div className="widget-head">
                    <h4>Contact Us</h4>
                  </div>
                  <div className="contact-info">
                    <div className="contact-items">
                      <div className="icon">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div className="content">
                        <h6>
                          9550 Bolsa Ave #126, <br />
                          United States
                        </h6>
                      </div>
                    </div>
                    <div className="contact-items">
                      <div className="icon">
                        <i className="fa-regular fa-envelope"></i>
                      </div>
                      <div className="content">
                        <h6>
                          <a href="mailto:info@cfdtravels.com">
                            info@cfdtravels.com
                          </a>
                        </h6>
                      </div>
                    </div>
                    <div className="contact-items">
                      <div className="icon">
                        <i className="fa-solid fa-phone"></i>
                      </div>
                      <div className="content">
                        <h6>
                          <a href="tel:+923453866681">+92 345 3866681</a>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-wrapper">
              <p className="wow fadeInUp" data-wow-delay=".3s">
                Copyright © <span>CFD Travels,</span> All Rights Reserved.
              </p>
              <ul className="bottom-list wow fadeInUp" data-wow-delay=".5s">
                <li>Terms of use</li>
                <li>Privacy Environmental Policy</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
