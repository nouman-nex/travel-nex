import React from "react";
import logo from "../../assets/header/logo.png";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
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
                        style={{ height: "70px", margin: "0 auto" }}
                        src={logo}
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
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <a href="index.html">About Us</a>
                    </li>
                    <li>
                      <a href="news.html">Blog</a>
                    </li>
                    <li>
                      <Link to="/contact-us">Contact Us</Link>
                    </li>
                    <li>
                      <a href="tour-details.html">Services</a>
                    </li>
                    <li>
                      <Link to="/bank-accounts">Bank Account</Link>
                    </li>
                    <li>
                      <Link to="/be-partner">Be partner with us</Link>
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
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <a href="#" className="text-white cursor-not-allowed">
                        Gujrat
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <a href="#" className="text-white cursor-not-allowed">
                        Rawalpindi
                      </a>
                      <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                        <Clock size={12} />
                        Coming Soon
                      </span>
                    </li>

                    <li className="flex items-center gap-2">
                      <a
                        href="#"
                        className="text-white pointer-events-non cursor-not-allowed"
                      >
                        Qatar
                      </a>
                      <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                        <Clock size={12} />
                        Coming Soon
                      </span>
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
                          Head Office: Kotla Arab Ali <br /> Khan Road,
                          Langrial, Gujrat, Pakistan.
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
                          <a href="tel:+43537641351">+43 537 641351</a> <br />
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
                Copyright © <span>NexaGen Solutions,</span> All Rights Reserved.
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
