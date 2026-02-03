import React from "react";

const QuoteIcon = ({ color = "#FFA31A" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="45"
    height="45"
    viewBox="0 0 45 45"
    fill="none"
  >
    <path
      d="M21.5998 15.1662C21.4359 21.2706 20.2326 27.1028 17.1618 32.4687C15.0391 36.1766 11.8636 38.7708 8.31789 40.9881C8.09312 41.1284 7.80413 41.3886 7.55907 41.1588C7.2836 40.9002 7.52189 40.5673 7.66216 40.3087C8.9449 37.9646 10.3121 35.6645 11.4292 33.2309C12.6528 30.564 13.6212 27.811 14.2567 24.9396C14.4257 24.1774 14.255 24.0929 13.535 24.2484C7.64188 25.526 2.16112 21.8976 1.00852 15.9858C-0.0849304 10.38 3.84608 4.78603 9.51275 3.88694C15.9196 2.86954 21.5491 7.65063 21.5998 14.1522C21.6015 14.4902 21.5998 14.8282 21.5998 15.1662Z"
      fill={color}
    />
    <path
      d="M44.25 15.2202C44.0793 21.5916 42.7949 27.6571 39.3912 33.1581C37.3175 36.5077 34.3228 38.8501 31.0746 40.9288C30.816 41.0945 30.4729 41.4375 30.1856 41.1198C29.9253 40.8325 30.2346 40.4877 30.3884 40.1987C31.6559 37.8462 33.0401 35.5562 34.1403 33.1142C35.3351 30.4642 36.2917 27.7382 36.9153 24.8939C37.0775 24.1536 36.8967 24.0827 36.2224 24.2415C30.2836 25.6358 24.4277 21.6338 23.5556 15.4348C22.7985 10.0537 26.7751 4.68115 32.1359 3.89022C38.7118 2.92353 44.2162 7.65053 44.25 14.2923C44.25 14.6016 44.25 14.9109 44.25 15.2202Z"
      fill={color}
    />
  </svg>
);

const testimonials = [
  {
    id: 1,
    name: "Kristin Watson",
    role: "Web Designer",
    image:
      "https://ex-coders.com/html/turmet/assets/img/testimonial/client-1.png",
    rating: 4,
    quoteColor: "#FFA31A",
    cardStyle: "",
    text: "Praesent ut lacus a velit tincidunt aliquam a eget urna. Sed ullamcorper tristique nisl at pharetra turpis accumsan et etiam eu sollicitudin eros. In imperdiet accumsan.",
  },
  {
    id: 2,
    name: "Wade Warren",
    role: "President of Sales",
    image:
      "https://ex-coders.com/html/turmet/assets/img/testimonial/client-2.png",
    rating: 4,
    quoteColor: "#1CA8CB",
    cardStyle: "style-2",
    text: "Praesent ut lacus a velit tincidunt aliquam a eget urna. Sed ullamcorper tristique nisl at pharetra turpis accumsan et etiam eu sollicitudin eros. In imperdiet accumsan.",
  },
  {
    id: 3,
    name: "Brooklyn Simmons",
    role: "President of Sales",
    image:
      "https://ex-coders.com/html/turmet/assets/img/testimonial/client-3.png",
    rating: 4,
    quoteColor: "#FFA31A",
    cardStyle: "",
    text: "Praesent ut lacus a velit tincidunt aliquam a eget urna. Sed ullamcorper tristique nisl at pharetra turpis accumsan et etiam eu sollicitudin eros. In imperdiet accumsan.",
  },
];

function StarRating({ rating, total = 5 }) {
  return (
    <div className="star">
      {Array.from({ length: total }, (_, i) => (
        <i
          key={i}
          className={i < rating ? "fas fa-star" : "fa-regular fa-star"}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }) {
  const { name, role, image, rating, quoteColor, cardStyle, text } =
    testimonial;

  return (
    <div className={`swiper-slide`}>
      <div className={`testimonial-card-items ${cardStyle}`}>
        <StarRating rating={rating} />
        <p>{text}</p>
        <div className="client-info-items">
          <div className="client-info">
            <div className="client-image">
              <img src={image} alt={name} />
            </div>
            <div className="text">
              <h4>{name}</h4>
              <p>{role}</p>
            </div>
          </div>
          <div className="icon">
            <QuoteIcon color={quoteColor} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <div>
      <section className="testimonial-section section-padding fix bg-cover">
        <div className="bag-shape float-bob-x">
          <img
            src="https://ex-coders.com/html/turmet/assets/img/testimonial/bag-shape.png"
            alt="decorative bag shape"
          />
        </div>
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-title wow fadeInUp">Testimonial</span>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">
              Our Clients Feedback
            </h2>
          </div>
          <div className="testimonial-wrapper">
            <div className="swiper testimonial-slider">
              <div className="swiper-wrapper">
                {testimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                  />
                ))}
              </div>
              <div className="array-button">
                <button className="array-prevs">Previews</button>
                <button className="array-nexts">Next</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
