import React from "react";

import darkLogo from "../../assets/header/black-logo.svg";
import whiteLogo from "../../assets/header/white-log.svg";
import logo from "../../assets/header/logo.png";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <div>
      <div className="fix-area">
        <div className="offcanvas__info">
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <Link to="/">
                    <img
                      style={{ height: "60px" }}
                      src={logo}
                      alt="logo-img"
                      className="h-10 w-auto"
                    />
                  </Link>
                </div>
                <div className="offcanvas__close">
                  <button>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <div className="mobile-menu fix mb-3"></div>
              <div className="offcanvas__contact">
                <h4>Contact Info</h4>
                <ul>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <a target="_blank" href="#">
                        Head Office: Kotla Arab Ali Khan Road, Langrial, Gujrat,
                        Pakistan.
                      </a>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <a href="mailto:info@cfdtravels.com">
                        <span>info@cfdtravels.com</span>
                      </a>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <a target="_blank" href="#">
                        Mon-friday, 09am -05pm
                      </a>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <a href="tel:+923453866681">+92 345 3866681</a>
                    </div>
                  </li>
                </ul>
                <div className="header-button mt-4">
                  <a href="contact.html" className="theme-btn">
                    {" "}
                    Start Here <i className="fa-solid fa-arrow-right"></i>
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
                  <a href="mailto:info@cfdtravels.com">info@cfdtravels.com</a>
                </li>
                <li>
                  <i className="fa-regular fa-clock"></i>
                  Mon to Friday: 8.00 am - 7.00 pm, Gujrat
                </li>
                <li>
                  <i className="fa-solid fa-phone"></i>
                  <a href="tel:+923453866681">+92 345 3866681</a>
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
                  <Link to="/" className="header-logo">
                    <img
                      src={logo}
                      style={{ height: "60px" }}
                      alt="logo-img"
                      className="h-10 w-auto md:h-16 lg:h-20 mb-2.5"
                    />
                  </Link>

                  {/* If you are using the logo-2 div for a secondary header style: */}
                  <div className="logo-2">
                    <Link to="/">
                      <img
                        style={{ height: "60px" }}
                        src={logo}
                        alt="logo-img"
                        className="h-12 w-auto md:h-24"
                      />
                    </Link>
                  </div>
                </div>
                <div className="header-right d-flex justify-content-end align-items-center">
                  <div className="mean__menu-wrapper">
                    <div className="main-menu">
                      <nav id="mobile-menu">
                        <ul>
                          <li className="has-dropdown active menu-thumb">
                            <Link to="/">Home</Link>
                          </li>
                          <li>
                            <a href="about.html">About Us</a>
                          </li>
                          <li>
                            <a href="destination-details.html">
                              Services
                              <i className="fa-solid fa-chevron-down"></i>
                            </a>
                            <ul className="submenu">
                              <li>
                                <a href="destination.html">Travel Insurance</a>
                              </li>
                              <li>
                                <a href="destination-details.html">Ticketing</a>
                              </li>
                              <li>
                                <a href="destination-details.html">
                                  Hotel Booking
                                </a>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <a href="tour-details.html">
                              Spiritual Journey
                              <i className="fa-solid fa-chevron-down"></i>
                            </a>
                            <ul className="submenu">
                              <li>
                                <a href="tour.html">Umrah</a>
                              </li>
                              <li>
                                <a href="tour-details.html">Hajj</a>
                              </li>
                              <li>
                                <a href="tour-details.html">Ziyarat</a>
                              </li>
                            </ul>
                          </li>
                          <li className="has-dropdown">
                            <a href="news.html">
                              Visas
                              <i className="fa-solid fa-chevron-down"></i>
                            </a>
                            <ul className="submenu">
                              <li>
                                <a href="activities.html">Visit Visa</a>
                              </li>
                              <li>
                                <a href="activities-details.html">Study Visa</a>
                              </li>
                              <li>
                                <a href="team.html">Work Visa</a>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <a href="news-details.html">Blog</a>
                          </li>
                          <li>
                            <Link to="/bank-accounts">Bank Accounts</Link>
                          </li>
                          <li className="has-dropdown">
                            <a href="contact.html">
                              Attestation
                              <i className="fa-solid fa-chevron-down"></i>
                            </a>
                            <ul className="submenu">
                              <li>
                                <a href="activities.html">MOFA</a>
                              </li>
                              <li>
                                <a href="activities-details.html">Apostille</a>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                  <a href="contact.html" className="theme-btn">
                    {" "}
                    Start Here <i className="fa-solid fa-arrow-right"></i>
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
