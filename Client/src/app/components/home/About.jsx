import React from "react";

const aboutItems = [
  {
    icon: "https://ex-coders.com/html/turmet/assets/img/icon/05.svg",
    title: "Exclusive Trip",
    description:
      "There are many variations of passages of available, but the majority",
  },
  {
    icon: "https://ex-coders.com/html/turmet/assets/img/icon/06.svg",
    title: "Safety first always",
    description:
      "There are many variations of passages of available, but the majority",
  },
  {
    icon: "https://ex-coders.com/html/turmet/assets/img/icon/07.svg",
    title: "Professional Guide",
    description:
      "There are many variations of passages of available, but the majority",
  },
];

export default function About() {
  return (
    <div>
      <section
        className="about-section section-padding fix bg-cover"
        style={{
          backgroundImage: `url(https://ex-coders.com/html/turmet/assets/img/about/about-bg.jpg)`,
        }}
      >
        <div className="right-shape float-bob-x">
          <img
            src="https://ex-coders.com/html/turmet/assets/img/about/right-shape.png"
            alt="img"
          />
        </div>
        <div className="container">
          <div className="about-wrapper">
            <div className="row g-4">
              {/* Left Side - Images */}
              <div className="col-lg-6">
                <div className="about-image">
                  <img
                    src="https://ex-coders.com/html/turmet/assets/img/about/01.png"
                    alt="img"
                    className="wow img-custom-anim-left"
                  />
                  <div className="border-image">
                    <img
                      src="https://ex-coders.com/html/turmet/assets/img/about/border.png"
                      alt=""
                    />
                  </div>

                  {/* Fixed Video Button */}
                  <div className="vdeo-item">
                    <a
                      href="https://www.youtube.com/watch?v=Cn4G2lZ_g2I"
                      className="video-btn video-popup"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="fa-solid fa-play"></i>
                    </a>
                    <h5>WATCH VIDEO</h5>
                  </div>

                  <div className="about-image-2">
                    <img
                      src="https://ex-coders.com/html/turmet/assets/img/about/02.png"
                      alt="img"
                      className="wow img-custom-anim-top"
                      data-wow-duration="1.5s"
                      data-wow-delay="0.3s"
                    />
                    <div className="plane-shape float-bob-y">
                      <img
                        src="https://ex-coders.com/html/turmet/assets/img/about/plane-shape.png"
                        alt=""
                      />
                    </div>
                    <div className="about-tour">
                      <div className="icon">
                        <img
                          src="https://ex-coders.com/html/turmet/assets/img/icon/10.svg"
                          alt="img"
                        />
                      </div>
                      <div className="content">
                        <h4>Luxury Tour</h4>
                        <span>25 years of Experience</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="col-lg-6">
                <div className="about-content">
                  <div className="section-title">
                    <span className="sub-title wow fadeInUp">
                      Let's Go Together
                    </span>
                    <h2 className="wow fadeInUp" data-wow-delay=".2s">
                      Great opportunity for <br />
                      adventure & travels
                    </h2>
                  </div>

                  {/* Fixed Aligned About Items */}
                  <div className="about-area mt-4 mt-md-0">
                    <div className="line-image">
                      <img
                        src="https://ex-coders.com/html/turmet/assets/img/about/Line-image.png"
                        alt="img"
                      />
                    </div>
                    {aboutItems.map((item, index) => (
                      <div
                        key={index}
                        className="about-items wow fadeInUp"
                        data-wow-delay={`.${3 + index * 2}s`}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "16px",
                          marginBottom: "20px",
                        }}
                      >
                        <div
                          className="icon"
                          style={{ flexShrink: 0, width: "60px" }}
                        >
                          <img
                            src={item.icon}
                            alt="img"
                            style={{
                              width: "70%",
                              paddingTop: "10px",
                              height: "auto",
                              margin: "0 auto",
                            }}
                          />
                        </div>
                        <div className="content">
                          <h5>{item.title}</h5>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    ))}
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
