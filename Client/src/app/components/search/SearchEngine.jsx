import { useState, useRef, useEffect } from "react";

/* ─── icons (inline SVGs to keep it self-contained) ─── */
const Icon = ({ d, size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={d} />
  </svg>
);
const PlaneIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);
const CalendarIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const PhoneIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const SearchIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const ChevronDownIcon = ({ size = 14, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const UsersIcon = ({ size = 14, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const PlusIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/* ─── swap arrows (the blue circle swap icon in reference) ─── */
const SwapIcon = () => (
  <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="15"
      fill="white"
      stroke="#ddd"
      strokeWidth={1.5}
    />
    <path
      d="M11 13h7M15 10l3 3-3 3"
      stroke="#1d6dc8"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 19h-7M17 22l-3-3 3-3"
      stroke="#1d6dc8"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─── Passenger counter row ─── */
const PassengerRow = ({ label, sub, value, onDec, onInc }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
    }}
  >
    <div>
      <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a" }}>
        {label}
      </div>
      <div style={{ fontSize: 12, color: "#999" }}>{sub}</div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button
        onClick={onDec}
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          border: "1.5px solid #1d6dc8",
          background: "transparent",
          color: "#1d6dc8",
          fontSize: 18,
          lineHeight: 1,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        −
      </button>
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          width: 16,
          textAlign: "center",
        }}
      >
        {value}
      </span>
      <button
        onClick={onInc}
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          border: "none",
          background: "#1d6dc8",
          color: "#fff",
          fontSize: 18,
          lineHeight: 1,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        +
      </button>
    </div>
  </div>
);

/* ─── Main component ─── */
export default function SearchEngine() {
  const [tripType, setTripType] = useState("Multi-City");
  const [cabinClass, setCabinClass] = useState("Economy");
  const [passengers, setPassengers] = useState({
    adult: 2,
    child: 1,
    infant: 1,
  });
  const [stops, setStops] = useState("Stop's");
  const [currency, setCurrency] = useState({ code: "PKR", flag: "🇵🇰" });
  const [activeTab, setActiveTab] = useState("Flights");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [flights, setFlights] = useState([
    { id: 1, from: "", to: "", date: "2026-02-12" },
    {
      id: 2,
      from: "JED - King Abdulaziz Intl Airport, Saudi Arabia",
      to: "",
      date: "2026-02-19",
    },
  ]);

  const containerRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const totalTravellers =
    passengers.adult + passengers.child + passengers.infant;

  const addFlight = () => {
    setFlights((prev) => [
      ...prev,
      { id: Date.now(), from: "", to: "", date: "" },
    ]);
  };
  const removeFlight = (id) => {
    setFlights((prev) => prev.filter((f) => f.id !== id));
  };
  const updateFlight = (id, field, val) => {
    setFlights((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: val } : f)),
    );
  };
  const swapFlight = (id) => {
    setFlights((prev) =>
      prev.map((f) => (f.id === id ? { ...f, from: f.to, to: f.from } : f)),
    );
  };

  const formatDate = (val) => {
    if (!val) return "";
    const d = new Date(val + "T00:00:00");
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /* ─── tab definitions ─── */
  const tabs = [
    {
      label: "Flights",
      color: "#1d6dc8",
      icon: <PlaneIcon size={15} className="text-white" />,
    },
    {
      label: "Umrah",
      color: "#c8232e",
      icon: <span style={{ fontSize: 15 }}>🕌</span>,
    },
    {
      label: "Visa",
      color: "#1a8a3c",
      icon: <span style={{ fontSize: 15 }}>📄</span>,
    },
    {
      label: "Hotel",
      color: "#e67e22",
      icon: <span style={{ fontSize: 15 }}>🏨</span>,
    },
    {
      label: "eSIM",
      color: "#6c3483",
      icon: <span style={{ fontSize: 15 }}>📱</span>,
    },
  ];

  /* ─── styles ─── */
  const s = {
    wrap: {
      width: "100%",
      maxWidth: 1280,
      margin: "0 auto",
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      overflow: "hidden",
      fontFamily: "'Segoe UI', sans-serif",
    },
    tabBar: {
      display: "flex",
      gap: 3,
      padding: "8px 12px",
      background: "linear-gradient(135deg,#e8f4fd 0%,#cce5f5 100%)",
    },
    tab: (active, color) => ({
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 22px",
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
      fontSize: 14,
      fontWeight: 600,
      background: active ? color : "transparent",
      color: active ? "#fff" : "#555",
      transition: "all .2s",
    }),
    filterRow: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: 10,
      padding: "14px 20px",
      borderBottom: "1px solid #eee",
    },
    tripGroup: {
      display: "flex",
      gap: 2,
    },
    tripBtn: (active) => ({
      padding: "5px 14px",
      border: active ? "1.5px solid #1d6dc8" : "1.5px solid #ccc",
      borderRadius: 20,
      background: active ? "#fff" : "#fff",
      color: active ? "#1d6dc8" : "#666",
      fontWeight: active ? 600 : 400,
      fontSize: 13,
      cursor: "pointer",
      transition: "all .15s",
    }),
    pill: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "5px 12px",
      border: "1.5px solid #ccc",
      borderRadius: 20,
      background: "#fff",
      fontSize: 13,
      color: "#444",
      cursor: "pointer",
    },
    flightsArea: {
      padding: "16px 20px 20px",
    },
    flightRow: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 14,
    },
    label: {
      fontSize: 12,
      fontWeight: 700,
      color: "#999",
      minWidth: 58,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    inputBox: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      border: "1.5px solid #ddd",
      borderRadius: 8,
      padding: "10px 12px",
      gap: 8,
      background: "#fafafa",
      transition: "border-color .2s, background .2s",
      minHeight: 44,
    },
    input: {
      border: "none",
      outline: "none",
      background: "transparent",
      fontSize: 14,
      color: "#333",
      flex: 1,
      minWidth: 0,
    },
    dateBox: {
      display: "flex",
      alignItems: "center",
      border: "1.5px solid #ddd",
      borderRadius: 8,
      padding: "10px 12px",
      gap: 8,
      background: "#fafafa",
      minWidth: 150,
      minHeight: 44,
      position: "relative",
      cursor: "pointer",
    },
    dateInput: {
      border: "none",
      outline: "none",
      background: "transparent",
      fontSize: 14,
      color: "#333",
      flex: 1,
      cursor: "pointer",
      minWidth: 0,
    },
    contactBox: {
      display: "flex",
      alignItems: "center",
      border: "1.5px solid #ddd",
      borderRadius: 8,
      padding: "10px 12px",
      gap: 8,
      background: "#fafafa",
      minWidth: 170,
      minHeight: 44,
    },
    searchBtn: {
      background: "#1d6dc8",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      padding: "10px 22px",
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      minHeight: 44,
      whiteSpace: "nowrap",
      boxShadow: "0 2px 8px rgba(29,109,200,0.3)",
      transition: "background .15s",
    },
    addBtn: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      border: "none",
      background: "transparent",
      color: "#1d6dc8",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
    },
    xBtn: {
      border: "none",
      background: "transparent",
      color: "#d93025",
      fontSize: 16,
      fontWeight: 700,
      cursor: "pointer",
      lineHeight: 1,
      padding: "0 2px",
    },
    dropdown: {
      position: "absolute",
      top: "calc(100% + 6px)",
      left: 0,
      zIndex: 100,
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: 10,
      boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
      minWidth: 160,
      padding: "6px 0",
    },
    dropdownItem: {
      display: "block",
      width: "100%",
      padding: "8px 16px",
      border: "none",
      background: "transparent",
      textAlign: "left",
      fontSize: 13,
      color: "#333",
      cursor: "pointer",
    },
  };

  return (
    <div style={s.wrap} ref={containerRef}>
      {/* ── Tab Bar ── */}
      <div style={s.tabBar}>
        {tabs.map((t) => (
          <button
            key={t.label}
            onClick={() => setActiveTab(t.label)}
            style={s.tab(activeTab === t.label, t.color)}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Filter Pills ── */}
      <div style={s.filterRow}>
        {/* Trip type pills */}
        <div style={s.tripGroup}>
          {["Round Trip", "One Way", "Multi-City"].map((t) => (
            <button
              key={t}
              onClick={() => setTripType(t)}
              style={s.tripBtn(tripType === t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Economy pill */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() =>
              setActiveDropdown(activeDropdown === "class" ? null : "class")
            }
            style={s.pill}
          >
            <PlaneIcon size={14} className="" style={{ color: "#1d6dc8" }} />
            {cabinClass}
            <ChevronDownIcon size={13} />
          </button>
          {activeDropdown === "class" && (
            <div style={s.dropdown}>
              {[
                "Economy",
                "Premium Economy",
                "Business Class",
                "First Class",
              ].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCabinClass(c);
                    setActiveDropdown(null);
                  }}
                  style={s.dropdownItem}
                  onMouseEnter={(e) => (e.target.style.background = "#eef5fc")}
                  onMouseLeave={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Travellers pill */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() =>
              setActiveDropdown(activeDropdown === "trav" ? null : "trav")
            }
            style={s.pill}
          >
            <UsersIcon size={14} style={{ color: "#1d6dc8" }} />
            {totalTravellers} Traveller
            <ChevronDownIcon size={13} />
          </button>
          {activeDropdown === "trav" && (
            <div style={{ ...s.dropdown, minWidth: 240, padding: 18 }}>
              <PassengerRow
                label="Adult"
                sub="Over 12 years"
                value={passengers.adult}
                onDec={() =>
                  setPassengers((p) => ({
                    ...p,
                    adult: Math.max(1, p.adult - 1),
                  }))
                }
                onInc={() =>
                  setPassengers((p) => ({ ...p, adult: p.adult + 1 }))
                }
              />
              <PassengerRow
                label="Child"
                sub="2–11 years"
                value={passengers.child}
                onDec={() =>
                  setPassengers((p) => ({
                    ...p,
                    child: Math.max(0, p.child - 1),
                  }))
                }
                onInc={() =>
                  setPassengers((p) => ({ ...p, child: p.child + 1 }))
                }
              />
              <PassengerRow
                label="Infant"
                sub="Under 2 years"
                value={passengers.infant}
                onDec={() =>
                  setPassengers((p) => ({
                    ...p,
                    infant: Math.max(0, p.infant - 1),
                  }))
                }
                onInc={() =>
                  setPassengers((p) => ({ ...p, infant: p.infant + 1 }))
                }
              />
              <button
                onClick={() => setActiveDropdown(null)}
                style={{
                  width: "100%",
                  marginTop: 10,
                  padding: "8px 0",
                  border: "none",
                  borderRadius: 8,
                  background: "#1d6dc8",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Stops pill */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() =>
              setActiveDropdown(activeDropdown === "stops" ? null : "stops")
            }
            style={s.pill}
          >
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                background: "#1d6dc8",
                borderRadius: 3,
              }}
            ></span>
            {stops}
            <ChevronDownIcon size={13} />
          </button>
          {activeDropdown === "stops" && (
            <div style={s.dropdown}>
              {["Direct", "1 Stop", "2+ Stops", "All"].map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setStops(st);
                    setActiveDropdown(null);
                  }}
                  style={s.dropdownItem}
                  onMouseEnter={(e) => (e.target.style.background = "#eef5fc")}
                  onMouseLeave={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  {st}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Currency pill — pushed right */}
        <div style={{ position: "relative", marginLeft: "auto" }}>
          <button
            onClick={() =>
              setActiveDropdown(activeDropdown === "curr" ? null : "curr")
            }
            style={{ ...s.pill, fontWeight: 700 }}
          >
            {currency.flag} {currency.code}
            <ChevronDownIcon size={13} />
          </button>
          {activeDropdown === "curr" && (
            <div style={{ ...s.dropdown, left: "auto", right: 0 }}>
              {[
                { code: "PKR", flag: "🇵🇰" },
                { code: "USD", flag: "🇺🇸" },
                { code: "SAR", flag: "🇸🇦" },
              ].map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c);
                    setActiveDropdown(null);
                  }}
                  style={{
                    ...s.dropdownItem,
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#eef5fc")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {c.flag} {c.code}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Flight Rows ── */}
      <div style={s.flightsArea}>
        {flights.map((flight, idx) => (
          <div key={flight.id} style={s.flightRow}>
            {/* Label */}
            <div style={s.label}>Flight {idx + 1}</div>

            {/* From */}
            <div style={s.inputBox}>
              <PlaneIcon
                size={17}
                style={{ color: "#1d6dc8", flexShrink: 0 }}
              />
              <input
                type="text"
                placeholder="From Where"
                value={flight.from}
                onChange={(e) =>
                  updateFlight(flight.id, "from", e.target.value)
                }
                style={s.input}
              />
              {flight.from && idx > 0 && (
                <button
                  onClick={() => updateFlight(flight.id, "from", "")}
                  style={s.xBtn}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Swap circle — overlapping visually */}
            <div
              style={{
                flexShrink: 0,
                margin: "0 -6px",
                zIndex: 2,
                cursor: "pointer",
              }}
              onClick={() => swapFlight(flight.id)}
            >
              <SwapIcon />
            </div>

            {/* To */}
            <div style={{ ...s.inputBox, flex: 1.2 }}>
              <PlaneIcon
                size={17}
                style={{ color: "#1d6dc8", flexShrink: 0 }}
              />
              <input
                type="text"
                placeholder="To Where"
                value={flight.to}
                onChange={(e) => updateFlight(flight.id, "to", e.target.value)}
                style={s.input}
              />
            </div>

            {/* Date */}
            <div style={s.dateBox}>
              <CalendarIcon
                size={17}
                style={{ color: "#d93025", flexShrink: 0 }}
              />
              <input
                type="date"
                value={flight.date}
                onChange={(e) =>
                  updateFlight(flight.id, "date", e.target.value)
                }
                style={{
                  ...s.dateInput,
                  /* hide native chrome chrome date picker chrome visuals */
                }}
              />
            </div>

            {/* Contact (row 0) / Add flight button (last row) */}
            {idx === 0 ? (
              <div style={s.contactBox}>
                <PhoneIcon
                  size={17}
                  style={{ color: "#1d6dc8", flexShrink: 0 }}
                />
                <input type="text" placeholder="Contact No." style={s.input} />
              </div>
            ) : idx === flights.length - 1 ? (
              <button onClick={addFlight} style={s.addBtn}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    background: "#1d6dc8",
                    color: "#fff",
                  }}
                >
                  <PlusIcon size={12} />
                </span>
                Add
              </button>
            ) : (
              <div style={{ minWidth: 90 }} />
            )}

            {/* Search button (only first row) */}
            {idx === 0 && (
              <button
                style={s.searchBtn}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#1558a0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#1d6dc8")
                }
              >
                <SearchIcon size={18} />
                Search
              </button>
            )}

            {/* Remove button for rows after first */}
            {idx > 0 && flights.length > 2 && (
              <button
                onClick={() => removeFlight(flight.id)}
                style={{ ...s.xBtn, fontSize: 18, marginLeft: 2 }}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
