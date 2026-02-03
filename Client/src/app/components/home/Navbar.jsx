import React from "react";

import darkLogo from "../../assets/header/black-logo.svg";
import whiteLogo from "../../assets/header/white-log.svg";
export default function Navbar() {
  return (
    <div>
      <div className="fix-area">
        <div className="offcanvas__info">
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <a href="index.html">
                    <img src={darkLogo} alt="logo-img" />
                  </a>
                </div>
                <div className="offcanvas__close">
                  <button>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <p className="text d-none d-xl-block">
                Nullam dignissim, ante scelerisque the is euismod fermentum odio
                sem semper the is erat, a feugiat leo urna eget eros. Duis
                Aenean a imperdiet risus.
              </p>
              <div className="mobile-menu fix mb-3"></div>
              <div className="offcanvas__contact">
                <h4>Contact Info</h4>
                <ul>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon">
                      <i className="fal fa-map-marker-alt"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <a target="_blank" href="#">
                        Main Street, Melbourne, Australia
                      </a>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fal fa-envelope"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <a href="mailto:info@example.com">
                        <span className="mailto:info@example.com">
                          info@example.com
                        </span>
                      </a>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fal fa-clock"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <a target="_blank" href="#">
                        Mod-friday, 09am -05pm
                      </a>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="far fa-phone"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <a href="tel:+11002345909">+11002345909</a>
                    </div>
                  </li>
                </ul>
                <div className="header-button mt-4">
                  <a href="contact.html" className="theme-btn">
                    {" "}
                    Request A Quote{" "}
                    <i className="fa-sharp fa-regular fa-arrow-right"></i>
                  </a>
                </div>
                <div className="social-icon d-flex align-items-center">
                  <a href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="offcanvas__overlay"></div>

      <header className="header-section-10">
        <div className="header-top-section-new">
          <div className="container-fluid">
            <div className="header-top-wrapper-new">
              <div className="social-icon d-flex align-items-center">
                <span>Follow Us</span>
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
              <ul className="top-right">
                <li>
                  <i className="fa-regular fa-envelope"></i>
                  <a href="mailto:info@touron.com">info@touron.com</a>
                </li>
                <li>
                  <i className="fa-regular fa-clock"></i>
                  Sun to Friday: 8.00 am - 7.00 pm, Austria
                </li>
                <li>
                  <i className="fa-solid fa-phone"></i>
                  <a href="tel:+256214203215">+256 214 203 215</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id="header-sticky" className="header-11">
          <div className="container-fluid">
            <div className="mega-menu-wrapper">
              <div className="header-main">
                <div className="logo">
                  <a href="index.html" className="header-logo">
                    <img src={whiteLogo} alt="logo-img" />
                  </a>
                  <div className="logo-2">
                    <a href="index.html">
                      <img src={darkLogo} alt="" />
                    </a>
                  </div>
                </div>
                <div className="header-right d-flex justify-content-end align-items-center">
                  <div className="mean__menu-wrapper">
                    <div className="main-menu">
                      <nav id="mobile-menu">
                        <ul>
                          <li className="has-dropdown active menu-thumb">
                            <a href="index.html">
                              Home
                              <i className="fa-solid fa-chevron-down"></i>
                            </a>
                            <ul className="submenu has-homemenu">
                              <li>
                                <div className="homemenu-items">
                                  <div className="homemenu">
                                    <div className="homemenu-thumb">
                                      <img
                                        src="https://ex-coders.com/html/turmet/assets/img/header/home-1.jpg"
                                        alt="img"
                                      />
                                      <div className="demo-button">
                                        <a
                                          href="index.html"
                                          className="theme-btn"
                                        >
                                          Multi Page
                                        </a>
                                        <a
                                          href="index-one-page.html"
                                          className="theme-btn"
                                        >
                                          One Page
                                        </a>
                                      </div>
                                    </div>
                                    <div className="homemenu-content text-center">
                                      <h4 className="homemenu-title">
                                        Tour Booking
                                      </h4>
                                    </div>
                                  </div>
                                  <div className="homemenu">
                                    <div className="homemenu-thumb mb-15">
                                      <img
                                        src="https://ex-coders.com/html/turmet/assets/img/header/home-2.jpg"
                                        alt="img"
                                      />
                                      <div className="demo-button">
                                        <a
                                          href="index-2.html"
                                          className="theme-btn"
                                        >
                                          Multi Page
                                        </a>
                                        <a
                                          href="index-two-page.html"
                                          className="theme-btn"
                                        >
                                          One Page
                                        </a>
                                      </div>
                                    </div>
                                    <div className="homemenu-content text-center">
                                      <h4 className="homemenu-title">
                                        Travel Booking
                                      </h4>
                                    </div>
                                  </div>
                                  <div className="homemenu">
                                    <div className="homemenu-thumb mb-15">
                                      <img
                                        src="https://ex-coders.com/html/turmet/assets/img/header/home-3.jpg"
                                        alt="img"
                                      />
                                      <div className="demo-button">
                                        <a
                                          href="index-3.html"
                                          className="theme-btn"
                                        >
                                          Multi Page
                                        </a>
                                        <a
                                          href="index-three-page.html"
                                          className="theme-btn"
                                        >
                                          One Page
                                        </a>
                                      </div>
                                    </div>
                                    <div className="homemenu-content text-center">
                                      <h4 className="homemenu-title">
                                        Flight Booking
                                      </h4>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </li>
                          <li className="has-dropdown active d-xl-none">
                            <a href="team.html" className="border-none">
                              Home
                            </a>
                            <ul className="submenu">
                              <li>
                                <a href="index.html">Home 01</a>
                              </li>
                              <li>
                                <a href="index-2.html">Home 02</a>
                              </li>
                              <li>
                                <a href="index-3.html">Home 03</a>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <a href="about.html">About Us</a>
                          </li>
                          <li>
                            <a href="destination-details.html">
                              Destinations
                              <i className="fa-solid fa-chevron-down"></i>
                            </a>
                            <ul className="submenu">
                              <li>
                                <a href="destination.html">our Destination</a>
                              </li>
                              <li>
                                <a href="destination-details.html">
                                  Destination Details
                                </a>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <a href="tour-details.html">
                              Tour
                              <i className="fa-solid fa-chevron-down"></i>
                            </a>
                            <ul className="submenu">
                              <li>
                                <a href="tour.html">Our Tour</a>
                              </li>
                              <li>
                                <a href="tour-details.html">Tour Details</a>
                              </li>
                            </ul>
                          </li>
                          <li className="has-dropdown">
                            <a href="news.html">
                              Pages
                              <i className="fa-solid fa-chevron-down"></i>
                            </a>
                            <ul className="submenu">
                              <li>
                                <a href="activities.html">Activities</a>
                              </li>
                              <li>
                                <a href="activities-details.html">
                                  Activities Details
                                </a>
                              </li>
                              <li>
                                <a href="team.html">Our Team</a>
                              </li>
                              <li>
                                <a href="team-details.html">Team Details</a>
                              </li>
                              <li>
                                <a href="faq.html">Our Faq</a>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <a href="news-details.html">
                              Blog
                              <i className="fa-solid fa-chevron-down"></i>
                            </a>
                            <ul className="submenu">
                              <li>
                                <a href="news.html">Blog Grid</a>
                              </li>
                              <li>
                                <a href="news-classic.html">Blog Classic</a>
                              </li>
                              <li>
                                <a href="news-details.html">Blog Details</a>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <a href="contact.html">Contact Us</a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                  <a href="#0" className="search-trigger search-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </a>
                  <a href="contact.html" className="theme-btn">
                    {" "}
                    Request A Quote <i className="fa-solid fa-arrow-right"></i>
                  </a>
                  <div className="header__hamburger d-xl-none my-auto">
                    <div className="sidebar__toggle">
                      <i className="fas fa-bars"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
