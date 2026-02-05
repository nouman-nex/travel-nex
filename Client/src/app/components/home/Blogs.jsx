import React from "react";

export default function Blogs() {
  const blogData = [
    {
      type: "image",
      img: "https://ex-coders.com/html/turmet/assets/img/news/01.jpg",
      delay: ".3s",
    },
    {
      type: "content",
      date: "December 02, 2024",
      category: "New York City",
      title: "Including Animation In Your Design System",
      link: "news-details.html",
      delay: ".5s",
    },
    {
      type: "image",
      img: "https://ex-coders.com/html/turmet/assets/img/news/02.jpg",
      delay: ".7s",
    },
    {
      type: "content",
      date: "December 02, 2024",
      category: "New York City",
      title: "Including Animation In Your Design System",
      link: "news-details.html",
      delay: ".3s",
    },
    {
      type: "image",
      img: "https://ex-coders.com/html/turmet/assets/img/news/02.jpg",
      delay: ".5s",
    },
    {
      type: "content",
      date: "December 02, 2024",
      category: "New York City",
      title: "Including Animation In Your Design System",
      link: "news-details.html",
      delay: ".7s",
    },
  ];

  return (
    <section className="news-section section-padding fix">
      <div className="container">
        <div className="section-title text-center">
          <span className="sub-title wow fadeInUp">News & Updates</span>
          <h2 className="wow fadeInUp" data-wow-delay=".2s">
            Our Latest News & Articles
          </h2>
        </div>

        <div className="row g-4">
          {blogData.map((item, index) => (
            <div
              key={index}
              className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
              data-wow-delay={item.delay}
            >
              <div className="news-card-items">
                {item.type === "image" ? (
                  <div className="news-image">
                    <img src={item.img} alt="blog-thumb" />
                  </div>
                ) : (
                  <div className="news-content">
                    <ul className="post-meta">
                      <li>
                        <i className="fa-regular fa-calendar-days"></i>
                        {item.date}
                      </li>
                      <li>
                        <i className="fa-solid fa-tag"></i>
                        {item.category}
                      </li>
                    </ul>
                    <h3>
                      <a href={item.link}>{item.title}</a>
                    </h3>
                    <a href={item.link} className="link-btn">
                      Read More <i className="fa-solid fa-arrow-right"></i>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
