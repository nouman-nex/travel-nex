import React, { useState, useEffect, useRef } from "react";

const slides = [
  {
    id: 1,
    image: "https://ex-coders.com/html/turmet/assets/img/hero/01.jpg",
    subtitle: "Discover the Unknown",
    title: "Escape into the\nWild Beauty of Nature",
    description:
      "Embark on a journey beyond the ordinary. Our curated travel experiences are designed to fill your soul with wonder.",
  },
  {
    id: 2,
    image:
      "https://images.wallpapersden.com/image/download/australia_am5saWqUmZqaraWkpJRobWllrWdma2U.jpg",
    subtitle: "Get unforgettable pleasure with us",
    title: "Find Your Perfect\nTraveling Destination",
    description:
      "From sun-kissed coastlines to misty mountain peaks, we craft adventures tailored to your dreams.",
  },
  {
    id: 3,
    image:
      "https://wallpapers.com/images/hd/royal-clock-towers-makkah-hd-xhhgdnh20hk9u158.jpg",
    subtitle: "Travel With Us",
    title: "Get unforgettable pleasure with us",
    description:
      "Experience luxury, culture, and adventure — all in one seamless journey.",
  },
];

export default function HeroCopy() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [sliding, setSliding] = useState(false);
  const [direction, setDirection] = useState("next");
  const [contentKey, setContentKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef(null);

  // Handle Responsiveness via JS
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    if (index === current)
      return { ...base, zIndex: 2, transform: "translateX(0)" };
    if (index === prev && sliding) {
      return {
        ...base,
        zIndex: 1,
        transform:
          direction === "next" ? "translateX(-100%)" : "translateX(100%)",
      };
    }
    return {
      ...base,
      zIndex: 0,
      transform:
        direction === "next" ? "translateX(100%)" : "translateX(-100%)",
    };
  };

  return (
    <section style={styles.section}>
      {slides.map((slide, i) => (
        <div key={slide.id} id={`slide-${i}`} style={getSlideStyle(i)}>
          <div style={styles.overlay} />
        </div>
      ))}

      <div
        style={{
          ...styles.contentWrapper,
          padding: isMobile ? "0 24px" : "0 100px",
          textAlign: isMobile ? "center" : "left",
          alignItems: isMobile ? "center" : "flex-start",
        }}
      >
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
                {i < 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p
            style={{ ...styles.description, margin: isMobile ? "0 auto" : "0" }}
          >
            {slides[current].description}
          </p>

          <div
            style={{
              ...styles.buttonRow,
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            <button style={styles.contactBtn}>Contact Us</button>
            {!isMobile && (
              <button style={styles.exploreBtn}>Explore Tours</button>
            )}
          </div>
        </div>

        <div
          style={{
            ...styles.statsRow,
            gap: isMobile ? "20px" : "48px",
            flexWrap: isMobile ? "wrap" : "nowrap",
            justifyContent: isMobile ? "center" : "flex-start",
          }}
        >
          {[
            { value: "20.5k", label: "Travelers" },
            { value: "150+", label: "Places" },
            { value: "98%", label: "Happy" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                ...styles.statItem,
                textAlign: isMobile ? "center" : "left",
              }}
            >
              <h3 style={styles.statValue}>{stat.value}</h3>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hide arrows on small mobile for cleaner UI */}
      {!isMobile && (
        <>
          <button
            onClick={() => goTo("prev")}
            style={{ ...styles.arrowBtn, left: "28px" }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={() => goTo("next")}
            style={{ ...styles.arrowBtn, right: "28px" }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </>
      )}

      <div
        style={{
          ...styles.dots,
          left: isMobile ? "50%" : "60px",
          transform: isMobile ? "translateX(-50%)" : "none",
        }}
      >
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() =>
              !sliding &&
              i !== current &&
              (setDirection(i > current ? "next" : "prev"),
              setPrev(current),
              setCurrent(i),
              setSliding(true),
              setContentKey((k) => k + 1),
              setTimeout(() => setSliding(false), 900))
            }
            style={{
              ...styles.dot,
              width: i === current ? "36px" : "10px",
              background: i === current ? "#fff" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>

      <style>{`
        .hero-content-animate { animation: heroFadeUp 0.9s ease forwards; }
        @keyframes heroFadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

const styles = {
  section: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    background: "#000",
  },
  slide: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.3))",
  },
  contentWrapper: {
    position: "relative",
    zIndex: 10,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: "800px",
  },
  content: { display: "flex", flexDirection: "column", gap: "12px" },
  subtitle: {
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "#e8a838",
  },
  title: {
    fontFamily: "serif",
    fontSize: "clamp(32px, 8vw, 64px)",
    color: "#fff",
    lineHeight: 1.1,
    margin: 0,
  },
  description: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.7)",
    lineHeight: 1.6,
    maxWidth: "450px",
  },
  buttonRow: { display: "flex", gap: "16px", marginTop: "20px" },
  contactBtn: {
    padding: "12px 24px",
    borderRadius: "50px",
    border: "1px solid white",
    background: "none",
    color: "white",
    cursor: "pointer",
  },
  exploreBtn: {
    color: "white",
    borderBottom: "1px solid white",
    background: "none",
    cursor: "pointer",
    padding: "8px 0",
  },
  statsRow: {
    marginTop: "40px",
    paddingTop: "24px",
    borderTop: "1px solid rgba(255,255,255,0.2)",
    display: "flex",
  },
  statValue: { fontSize: "24px", color: "#fff", margin: 0 },
  statLabel: {
    fontSize: "10px",
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
  },
  arrowBtn: {
    position: "absolute",
    top: "50%",
    zIndex: 20,
    background: "rgba(255,255,255,0.1)",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    color: "#fff",
    cursor: "pointer",
  },
  dots: {
    position: "absolute",
    bottom: "30px",
    zIndex: 20,
    display: "flex",
    gap: "8px",
  },
  dot: { height: "8px", borderRadius: "4px", transition: "all 0.3s" },
};
