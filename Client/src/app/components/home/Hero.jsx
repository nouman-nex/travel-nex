import React, { useState, useEffect, useRef } from "react";

const slides = [
  {
    id: 1,
    image: "https://ex-coders.com/html/turmet/assets/img/hero/01.jpg",
    subtitle: "Discover the Unknown",
    title: "Escape into the\nWild Beauty of Nature",
    description:
      "Embark on a journey beyond the ordinary. Our curated travel experiences are designed to fill your soul with wonder and your heart with unforgettable memories.",
  },
  {
    id: 2,
    image:
      "https://images.wallpapersden.com/image/download/australia_am5saWqUmZqaraWkpJRobWllrWdma2U.jpg",
    subtitle: "Get unforgettable pleasure with us",
    title: "Find Your Perfect\nTraveling Destination",
    description:
      "From sun-kissed coastlines to misty mountain peaks, we craft adventures tailored to your dreams. Let us take you somewhere extraordinary.",
  },
  {
    id: 3,
    image:
      "https://wallpapers.com/images/hd/royal-clock-towers-makkah-hd-xhhgdnh20hk9u158.jpg",
    subtitle: "Travel With Us",
    title: "Get unforgettable pleasure with us",
    description:
      "Trusted by thousands across the globe, we turn wanderlust into reality. Experience luxury, culture, and adventure — all in one seamless journey.",
  },
];

export default function HeroCopy() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [sliding, setSliding] = useState(false);
  const [direction, setDirection] = useState("next"); // "next" = from right, "prev" = from left
  const [contentKey, setContentKey] = useState(0);
  const timeoutRef = useRef(null);

  // Auto-play every 5s
  useEffect(() => {
    timeoutRef.current = setTimeout(() => goTo("next"), 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [current, sliding]);

  const goTo = (dir) => {
    if (sliding) return;
    setSliding(true);
    setDirection(dir);

    const next =
      dir === "next"
        ? (current + 1) % slides.length
        : (current - 1 + slides.length) % slides.length;

    setPrev(current);
    setCurrent(next);
    setContentKey((k) => k + 1);

    // Reset after animation duration
    setTimeout(() => {
      setPrev(null);
      setSliding(false);
    }, 900);
  };

  const getSlideStyle = (index) => {
    const base = {
      ...styles.slide,
      backgroundImage: `url("${slides[index].image}")`,
      transition: "transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)",
    };

    // Current slide: slides IN
    if (index === current) {
      if (prev === null) {
        // Initial load — no animation needed
        return { ...base, zIndex: 2, transform: "translateX(0)" };
      }
      // Animate in from right (next) or left (prev)
      return {
        ...base,
        zIndex: 2,
        transform: "translateX(0)",
      };
    }

    // Outgoing slide: slides OUT
    if (index === prev && sliding) {
      return {
        ...base,
        zIndex: 1,
        transform:
          direction === "next" ? "translateX(-100%)" : "translateX(100%)",
      };
    }

    // Hidden slides
    return {
      ...base,
      zIndex: 0,
      transform:
        direction === "next" ? "translateX(100%)" : "translateX(-100%)",
    };
  };

  // Mount incoming slide off-screen BEFORE transition starts
  useEffect(() => {
    if (prev !== null) {
      // Force the new slide to start off-screen, then on next frame trigger the slide
      const el = document.getElementById(`slide-${current}`);
      if (el) {
        el.style.transition = "none";
        el.style.transform =
          direction === "next" ? "translateX(100%)" : "translateX(-100%)";
        // Trigger reflow
        void el.offsetHeight;
        el.style.transition = "transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)";
        el.style.transform = "translateX(0)";
      }
    }
  }, [current]);

  return (
    <section style={styles.section}>
      {/* Slide Images */}
      {slides.map((slide, i) => (
        <div key={slide.id} id={`slide-${i}`} style={getSlideStyle(i)}>
          <div style={styles.overlay} />
        </div>
      ))}

      {/* Content */}
      <div style={styles.contentWrapper}>
        <div
          key={contentKey}
          style={styles.content}
          className="hero-content-animate"
        >
          <span style={styles.subtitle}>{slides[current].subtitle}</span>
          <h1 style={styles.title}>
            {slides[current].title.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < slides[current].title.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p style={styles.description}>{slides[current].description}</p>
          <div style={styles.buttonRow}>
            <button
              style={styles.contactBtn}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              Contact Us
            </button>
            <button
              style={styles.exploreBtn}
              onMouseEnter={(e) => {
                e.currentTarget.querySelector("svg").style.transform =
                  "translate(4px, -4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.querySelector("svg").style.transform =
                  "translate(0, 0)";
              }}
            >
              Explore Tours
              <svg
                style={{ transition: "transform 0.3s ease" }}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          {[
            { value: "20.5k", label: "Happy Travelers" },
            { value: "150+", label: "Destinations" },
            { value: "98%", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label} style={styles.statItem}>
              <h3 style={styles.statValue}>{stat.value}</h3>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prev Arrow */}
      <button
        onClick={() => goTo("prev")}
        style={{ ...styles.arrowBtn, left: "28px" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
        }
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Next Arrow */}
      <button
        onClick={() => goTo("next")}
        style={{ ...styles.arrowBtn, right: "28px" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
        }
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </button>

      {/* Dots */}
      <div style={styles.dots}>
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => {
              if (i === current || sliding) return;
              setSliding(true);
              setDirection(i > current ? "next" : "prev");
              setPrev(current);
              setCurrent(i);
              setContentKey((k) => k + 1);
              setTimeout(() => {
                setPrev(null);
                setSliding(false);
              }, 900);
            }}
            style={{
              ...styles.dot,
              width: i === current ? "36px" : "10px",
              background: i === current ? "#fff" : "rgba(255,255,255,0.45)",
              transition: "all 0.4s ease",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500&display=swap');
        .hero-content-animate {
          animation: heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes heroFadeUp {
          0% { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

/* ─── Styles ─── */
const styles = {
  section: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
  },
  slide: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    willChange: "transform",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to right, rgba(15,20,40,0.88) 0%, rgba(15,20,40,0.55) 50%, rgba(15,20,40,0.3) 100%)",
  },
  contentWrapper: {
    position: "relative",
    zIndex: 10,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0 100px",
    maxWidth: "720px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  subtitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "3.5px",
    textTransform: "uppercase",
    color: "#e8a838",
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(38px, 5.5vw, 68px)",
    fontWeight: 300,
    color: "#fff",
    lineHeight: 1.1,
    margin: 0,
  },
  description: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "15px",
    fontWeight: 300,
    color: "rgba(255,255,255,0.72)",
    lineHeight: 1.75,
    maxWidth: "480px",
    margin: 0,
  },
  buttonRow: {
    display: "flex",
    gap: "16px",
    marginTop: "8px",
    alignItems: "center",
  },
  contactBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "transparent",
    border: "1.5px solid rgba(255,255,255,0.5)",
    color: "#fff",
    padding: "14px 28px",
    borderRadius: "50px",
    fontSize: "14px",
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "0.8px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  exploreBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "transparent",
    border: "none",
    borderBottom: "1.5px solid rgba(255,255,255,0.5)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "0.8px",
    cursor: "pointer",
    transition: "color 0.3s, background 0.3s",
    padding: "14px 4px",
  },
  statsRow: {
    display: "flex",
    gap: "48px",
    marginTop: "64px",
    paddingTop: "32px",
    borderTop: "1px solid rgba(255,255,255,0.15)",
  },
  statItem: { textAlign: "left" },
  statValue: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "28px",
    fontWeight: 600,
    color: "#fff",
    margin: 0,
  },
  statLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "12px",
    fontWeight: 400,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    margin: "4px 0 0",
  },
  arrowBtn: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s ease",
    backdropFilter: "blur(4px)",
  },
  dots: {
    position: "absolute",
    bottom: "40px",
    left: "60px",
    zIndex: 10,
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  dot: {
    height: "10px",
    borderRadius: "5px",
  },
};
