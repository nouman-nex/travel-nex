import React, { useState } from "react";
import PageHeader from "../../components/pageHeader/Pageheader";
import { api } from "../../api/api";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "Residential",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await api.post("v3/mail/sendMail", formData);

      if (res.status === 200 || res.data?.success) {
        setMessage({
          type: "success",
          text: "Message sent successfully! We will get back to you soon.",
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          country: "Residential",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send message. Please try again.";
      setMessage({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        image={
          "https://ex-coders.com/html/turmet/assets/img/breadcrumb/breadcrumb.jpg"
        }
        title={"Contact Us"}
        breadcrumb={"Contact Us"}
      />
      <section className="contact-us-section fix section-padding">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-6 col-md-6">
              <div className="contact-us-main">
                <div className="contact-box-items">
                  <div className="icon">
                    <img
                      src="https://ex-coders.com/html/turmet/assets/img/icon/18.svg"
                      alt="img"
                    />
                  </div>
                  <div className="content">
                    <h3>Our Address</h3>
                    <p>
                      Head Office: Kotla Arab Ali Khan Road, Langrial, Gujrat,
                      Pakistan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6">
              <div className="contact-us-main style-2">
                <div className="contact-box-items">
                  <div className="icon">
                    <img
                      src="https://ex-coders.com/html/turmet/assets/img/icon/19.svg"
                      alt="img"
                    />
                  </div>
                  <div className="content">
                    <h3>
                      <a href="mailto:info@cfdtravels.com">
                        info@cfdtravels.com
                      </a>
                    </h3>
                    <p>
                      Email us anytime for anykind <br /> ofquety.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6">
              <div className="contact-us-main">
                <div className="contact-box-items">
                  <div className="icon">
                    <img
                      src="https://ex-coders.com/html/turmet/assets/img/icon/20.svg"
                      alt="img"
                    />
                  </div>
                  <div className="content">
                    <h3>
                      <a href="tel:+923453866681">+92 345 3866681</a>
                    </h3>
                    <p>Call us any kind suppor,we will wait for it.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-us-section-2 section-bg-2 fix">
        <div className="container">
          <div className="contact-us-wrapper">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="contact-us-contact">
                  <div className="section-title">
                    <span className="sub-title text-white wow fadeInUp">
                      Contact us
                    </span>
                    <h2
                      className=" text-white wow fadeInUp wow"
                      data-wow-delay=".2s"
                    >
                      Send Message Anytime
                    </h2>
                  </div>
                  <div className="comment-form-wrap">
                    <form
                      onSubmit={handleSubmit}
                      id="contact-form"
                      method="POST"
                    >
                      {/* Success/Error Message */}
                      {message.text && (
                        <div
                          style={{
                            padding: "15px 20px",
                            borderRadius: "5px",
                            marginBottom: "20px",
                            fontSize: "14px",
                            fontWeight: "500",
                            backgroundColor:
                              message.type === "success"
                                ? "#d4edda"
                                : "#f8d7da",
                            color:
                              message.type === "success"
                                ? "#155724"
                                : "#721c24",
                            border:
                              message.type === "success"
                                ? "1px solid #c3e6cb"
                                : "1px solid #f5c6cb",
                          }}
                        >
                          {message.text}
                        </div>
                      )}

                      <div className="row g-4">
                        <div className="col-lg-6">
                          <div className="form-clt">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              placeholder="Your Name"
                              value={formData.name}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-clt">
                            <input
                              type="text"
                              name="email"
                              id="email4"
                              placeholder="Your Email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-clt">
                            <select
                              name="country"
                              className="country-select"
                              style={{ display: "none" }}
                              value={formData.country}
                              onChange={handleChange}
                            >
                              <option value="Residential">Real Estate</option>
                              <option value="01">01</option>
                              <option value="02">02</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-clt">
                            <textarea
                              name="message"
                              id="message"
                              placeholder="Your Message"
                              value={formData.message}
                              onChange={handleChange}
                            ></textarea>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <button
                            type="submit"
                            className="theme-btn"
                            disabled={loading}
                            style={{
                              opacity: loading ? 0.7 : 1,
                              cursor: loading ? "not-allowed" : "pointer",
                            }}
                          >
                            {loading ? "Sending..." : "Submit Massage"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="map-area">
                  <div className="google-map">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6678.7619084840835!2d144.9618311901502!3d-37.81450084255415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642b4758afc1d%3A0x3119cc820fdfc62e!2sEnvato!5e0!3m2!1sen!2sbd!4v1641984054261!5m2!1sen!2sbd"
                      // style="border:0;"
                      allowfullscreen=""
                      loading="lazy"
                    ></iframe>
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
