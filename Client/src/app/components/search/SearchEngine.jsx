import { useState, useRef, useEffect } from "react";
import {
  Plane,
  Calendar,
  Phone,
  Search,
  ChevronDown,
  Users,
  Plus,
  X,
} from "lucide-react";
import "../../styles/search.css";

const TRIP_TYPES = ["One Way", "Round Trip", "Multi-City"];
const CABIN_CLASSES = ["Economy", "Premium Economy", "Business", "First Class"];

const PassengerRow = ({ label, sub, value, onDec, onInc }) => (
  <div className="pass-row">
    <div>
      <div className="pass-label">{label}</div>
      <div className="pass-sub">{sub}</div>
    </div>
    <div className="pass-ctrl">
      <button onClick={onDec} className="cnt-btn dec">
        −
      </button>
      <span className="cnt-val">{value}</span>
      <button onClick={onInc} className="cnt-btn inc">
        +
      </button>
    </div>
  </div>
);

export default function SearchEngine() {
  const [tripType, setTripType] = useState("One Way");
  const [cabinClass, setCabinClass] = useState("Economy");
  const [passengers, setPassengers] = useState({
    adult: 1,
    child: 0,
    infant: 0,
  });
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [flights, setFlights] = useState([
    { id: 1, from: "", to: "", date: "" },
    { id: 2, from: "", to: "", date: "" },
  ]);

  const containerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setFrom("");
    setTo("");
    setDepartDate("");
    setReturnDate("");
    setFlights([
      { id: 1, from: "", to: "", date: "" },
      { id: 2, from: "", to: "", date: "" },
    ]);
  }, [tripType]);

  const totalPass = passengers.adult + passengers.child + passengers.infant;

  const swapRoute = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const swapMultiRoute = (id) => {
    setFlights((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return { ...f, from: f.to, to: f.from };
        }
        return f;
      }),
    );
  };

  const updateFlight = (id, field, val) => {
    setFlights((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: val } : f)),
    );
  };

  const addFlight = () => {
    setFlights((prev) => [
      ...prev,
      { id: Date.now(), from: "", to: "", date: "" },
    ]);
  };

  const removeFlight = (id) => {
    if (flights.length > 2)
      setFlights((prev) => prev.filter((f) => f.id !== id));
  };

  const updatePassenger = (type, delta) => {
    setPassengers((p) => {
      const newVal = Math.max(type === "adult" ? 1 : 0, p[type] + delta);
      return { ...p, [type]: newVal };
    });
  };

  return (
    <>
      <div className="container mt-4" ref={containerRef}>
        <div className="header">
          <button className="tab active">
            <Plane size={16} />
            Flights
          </button>
          <button className="tab">
            <svg
              viewBox="-3.6 -3.6 43.20 43.20"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              class="iconify iconify--twemoji w-3.75 sm:w-6.25 sm:h-6.25 h-3.75 mr-1"
              preserveAspectRatio="xMidYMid meet"
              fill="#000000"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M18 0L0 5v29l18 2l18-2V5z" fill="#000000"></path>
                <path fill="#292F33" d="M18 36l18-2V5L18 0z"></path>
                <path
                  fill="#FFD983"
                  d="M22.454 14.507v3.407l4.229.612V15.22zm7 1.181v3.239l3.299.478v-3.161zM18 13.756v3.513l1.683.244V14.04zm18 3.036l-.539-.091v3.096l.539.078z"
                ></path>
                <path
                  fill="#FFAC33"
                  d="M0 16.792v3.083l.539-.078v-3.096zm16.317-2.752v3.473L18 17.269v-3.513zm-13.07 2.204v3.161l3.299-.478v-3.239zm6.07-1.024v3.306l4.229-.612v-3.407z"
                ></path>
                <path
                  fill="#FFD983"
                  d="M21.389 15.131v-.042c0-.421-.143-.763-.32-.763c-.177 0-.32.342-.32.763v.042c-.208.217-.355.621-.355 1.103c0 .513.162.949.393 1.152c.064.195.163.33.282.33s.218-.135.282-.33c.231-.203.393-.639.393-1.152c-.001-.482-.147-.886-.355-1.103zm6.999 1.069v-.042c0-.421-.143-.763-.32-.763c-.177 0-.32.342-.32.763v.042c-.208.217-.355.621-.355 1.103c0 .513.162.949.393 1.152c.064.195.163.33.282.33s.218-.135.282-.33c.231-.203.393-.639.393-1.152c0-.481-.147-.885-.355-1.103zm6.017 1.03v-.039c0-.393-.134-.712-.299-.712c-.165 0-.299.319-.299.712v.039c-.194.203-.331.58-.331 1.03c0 .479.151.886.367 1.076c.059.182.152.308.263.308s.203-.126.263-.308c.215-.189.367-.597.367-1.076c0-.45-.136-.827-.331-1.03z"
                ></path>
                <path
                  fill="#FFAC33"
                  d="M14.611 15.131v-.042c0-.421.143-.763.32-.763s.32.342.32.763v.042c.208.217.355.621.355 1.103c0 .513-.162.949-.393 1.152c-.064.195-.163.33-.282.33s-.218-.135-.282-.33c-.231-.203-.393-.639-.393-1.152c.001-.482.147-.886.355-1.103zM7.612 16.2v-.042c0-.421.143-.763.32-.763s.32.342.32.763v.042c.208.217.355.621.355 1.103c0 .513-.162.949-.393 1.152c-.064.195-.163.33-.282.33s-.218-.135-.282-.33c-.231-.203-.393-.639-.393-1.152c0-.481.147-.885.355-1.103zm-6.017 1.03v-.039c0-.393.134-.712.299-.712s.299.319.299.712v.039c.194.203.331.58.331 1.03c0 .479-.151.886-.367 1.076c-.059.182-.152.308-.263.308s-.204-.127-.264-.308c-.215-.189-.367-.597-.367-1.076c.001-.45.137-.827.332-1.03zM0 11.146v3.5l18-3.268V7.614z"
                ></path>
                <path fill="#FFD983" d="M18 7.614v3.764l18 3.268v-3.5z"></path>
              </g>
            </svg>{" "}
            Umrah
          </button>
          <button className="tab">
            <svg
              class="mr-1 w-3.75 sm:w-6.25 sm:h-6.25 h-3.75"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="-51.2 -51.2 614.40 614.40"
              xml:space="preserve"
              fill="white"
              stroke="#000000"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke="#CCCCCC"
                stroke-width="1.024"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <path
                    class="st0"
                    d="M270.465,279.817c4.674-3.824,9.136-9.612,12.926-16.946c1.258-2.431,2.414-5.116,3.519-7.887h-26.634v29.032 c1.334-0.069,2.651-0.171,3.968-0.29C266.327,282.775,268.408,281.5,270.465,279.817z"
                  ></path>
                  <path
                    class="st0"
                    d="M216.295,200.236h35.457v-37.674h-29.626C218.743,173.636,216.643,186.485,216.295,200.236z"
                  ></path>
                  <path
                    class="st0"
                    d="M215.947,254.984h-21.51c1.64,2.015,3.417,3.969,5.27,5.822c8.286,8.303,18.382,14.745,29.643,18.748 c-3.059-3.714-5.83-7.98-8.295-12.774C219.159,263.134,217.493,259.182,215.947,254.984z"
                  ></path>
                  <path
                    class="st0"
                    d="M241.535,279.817c2.058,1.683,4.139,2.958,6.222,3.909c1.334,0.119,2.652,0.221,3.994,0.29v-29.032h-26.703 C229.476,266.058,235.281,274.701,241.535,279.817z"
                  ></path>
                  <path
                    class="st0"
                    d="M222.083,246.452h29.669v-37.682h-35.474C216.626,222.519,218.709,235.37,222.083,246.452z"
                  ></path>
                  <path
                    class="st0"
                    d="M295.706,208.769h-35.43v37.682h29.626C293.259,235.37,295.341,222.537,295.706,208.769z"
                  ></path>
                  <path
                    class="st0"
                    d="M282.644,279.554c11.269-4.003,21.365-10.445,29.676-18.748c1.853-1.853,3.604-3.807,5.27-5.822h-21.536 C292.536,264.656,288.049,273.019,282.644,279.554z"
                  ></path>
                  <path
                    class="st0"
                    d="M289.919,162.562h-29.643v37.674h35.472C295.375,186.485,293.31,173.636,289.919,162.562z"
                  ></path>
                  <path
                    class="st0"
                    d="M304.23,200.236h31.292c-0.722-13.794-4.98-26.634-11.838-37.674h-24.85 C302.029,173.908,303.899,186.69,304.23,200.236z"
                  ></path>
                  <path
                    class="st0"
                    d="M296.055,154.021h21.536c-1.666-2.023-3.417-3.96-5.27-5.813c-8.303-8.294-18.399-14.737-29.651-18.748 c3.051,3.706,5.83,7.989,8.278,12.765C292.842,145.862,294.533,149.84,296.055,154.021z"
                  ></path>
                  <path
                    class="st0"
                    d="M270.465,129.188c-2.057-1.666-4.139-2.941-6.221-3.892c-1.318-0.119-2.634-0.221-3.968-0.298v29.023h26.677 C282.55,142.938,276.729,134.295,270.465,129.188z"
                  ></path>
                  <path
                    class="st0"
                    d="M298.817,246.452h24.867c6.858-11.048,11.116-23.881,11.838-37.682h-31.249 C303.916,222.333,302.004,235.098,298.817,246.452z"
                  ></path>
                  <polygon
                    class="st0"
                    points="225.329,373.625 217.307,398.467 233.692,398.467 225.651,373.625 "
                  ></polygon>
                  <path
                    class="st0"
                    d="M394.486,0h-276.97C83.453,0,55.84,27.612,55.84,61.674v388.66c0,34.054,27.613,61.666,61.676,61.666h276.97 c34.062,0,61.674-27.612,61.674-61.666V61.674C456.16,27.612,428.548,0,394.486,0z M256.009,104.712 c55.113,0,99.791,44.668,99.791,99.791c0,55.131-44.678,99.791-99.791,99.8c-55.13-0.009-99.791-44.669-99.808-99.8 C156.218,149.38,200.879,104.712,256.009,104.712z M164.037,399.615h-12.629c-0.424,0-0.629,0.204-0.629,0.62v23.694 c0,0.629-0.407,1.045-1.036,1.045h-13.259c-0.628,0-1.053-0.416-1.053-1.045v-68.881c0-0.629,0.424-1.046,1.053-1.046h27.553 c15.451,0,24.731,9.289,24.731,22.853C188.768,390.215,179.385,399.615,164.037,399.615z M256.859,424.974h-13.564 c-0.731,0-1.156-0.314-1.36-1.045l-4.079-12.417h-24.833l-3.978,12.417c-0.204,0.731-0.612,1.045-1.343,1.045H194.02 c-0.731,0-0.935-0.416-0.731-1.045l24.424-68.881c0.205-0.629,0.629-1.046,1.36-1.046h13.156c0.731,0,1.139,0.417,1.36,1.046 l24,68.881C257.794,424.558,257.59,424.974,256.859,424.974z M289.765,426.122c-11.066,0-21.807-4.386-27.348-9.706 c-0.408-0.416-0.629-1.147-0.103-1.776l7.938-9.077c0.408-0.526,1.038-0.526,1.564-0.11c4.692,3.765,11.065,7.308,18.578,7.308 c7.411,0,11.592-3.442,11.592-8.456c0-4.173-2.515-6.782-10.963-7.929l-3.757-0.519c-14.414-1.988-22.454-8.77-22.454-21.298 c0-13.045,9.824-21.705,25.156-21.705c9.399,0,18.17,2.812,24.119,7.411c0.628,0.416,0.73,0.833,0.204,1.564l-6.357,9.493 c-0.424,0.526-0.952,0.628-1.461,0.314c-5.439-3.544-10.658-5.422-16.504-5.422c-6.255,0-9.485,3.23-9.485,7.717 c0,4.071,2.924,6.68,11.049,7.836l3.772,0.518c14.601,1.981,22.336,8.661,22.336,21.502 C317.642,416.628,308.14,426.122,289.765,426.122z M351.908,426.122c-11.065,0-21.825-4.386-27.348-9.706 c-0.426-0.416-0.629-1.147-0.102-1.776l7.92-9.077c0.424-0.526,1.054-0.526,1.564-0.11c4.708,3.765,11.065,7.308,18.578,7.308 c7.41,0,11.592-3.442,11.592-8.456c0-4.173-2.499-6.782-10.964-7.929l-3.756-0.519c-14.397-1.988-22.436-8.77-22.436-21.298 c0-13.045,9.807-21.705,25.156-21.705c9.4,0,18.152,2.812,24.102,7.411c0.629,0.416,0.731,0.833,0.221,1.564l-6.374,9.493 c-0.408,0.526-0.934,0.628-1.462,0.314c-5.422-3.544-10.64-5.422-16.487-5.422c-6.272,0-9.502,3.23-9.502,7.717 c0,4.071,2.923,6.68,11.065,7.836l3.756,0.518c14.618,1.981,22.334,8.661,22.334,21.502 C379.766,416.628,370.264,426.122,351.908,426.122z"
                  ></path>
                  <path
                    class="st0"
                    d="M225.1,154.021h26.652v-29.023c-1.343,0.077-2.66,0.178-3.994,0.298c-2.082,0.951-4.164,2.226-6.222,3.892 c-4.674,3.825-9.118,9.62-12.909,16.946C227.36,148.582,226.195,151.259,225.1,154.021z"
                  ></path>
                  <path
                    class="st0"
                    d="M163.102,367.252h-11.694c-0.424,0-0.629,0.212-0.629,0.629v17.847c0,0.416,0.205,0.628,0.629,0.628h11.694 c6.459,0,10.334-3.756,10.334-9.502C173.436,371.118,169.561,367.252,163.102,367.252z"
                  ></path>
                  <path
                    class="st0"
                    d="M213.184,162.562h-24.867c-6.858,11.04-11.099,23.881-11.838,37.674h31.249 C208.085,186.681,209.997,173.908,213.184,162.562z"
                  ></path>
                  <path
                    class="st0"
                    d="M229.357,129.46c-11.252,3.994-21.357,10.454-29.651,18.748c-1.853,1.853-3.629,3.79-5.27,5.813h21.51 C219.465,144.366,223.978,135.987,229.357,129.46z"
                  ></path>
                  <path
                    class="st0"
                    d="M213.184,246.452c-3.212-11.354-5.065-24.118-5.413-37.682h-31.292c0.739,13.802,4.98,26.634,11.838,37.682 H213.184z"
                  ></path>
                </g>
              </g>
            </svg>{" "}
            Visa
          </button>
          <button className="tab">
            <svg
              fill="#ffffff"
              class="mr-1 w-3.75 sm:w-6.25 sm:h-6.25 h-3.75"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 380 380"
              xml:space="preserve"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <path d="M303.838,353.36V106.867h7.697V64.12H68.465v42.747h7.697V353.36H61.759V380h256.482v-26.64H303.838z M145.162,336.865 h-40.424v-40.424h40.424V336.865z M145.162,278.32h-40.424v-40.424h40.424V278.32z M145.162,219.775h-40.424v-40.424h40.424 V219.775z M145.162,161.23h-40.424v-40.424h40.424V161.23z M210.213,353.36h-40.426v-56.919h40.426V353.36z M210.213,278.32 h-40.426v-40.424h40.426V278.32z M210.213,219.775h-40.426v-40.424h40.426V219.775z M210.213,161.23h-40.426v-40.424h40.426V161.23 z M275.262,336.865h-40.424v-40.424h40.424V336.865z M275.262,278.32h-40.424v-40.424h40.424V278.32z M275.262,219.775h-40.424 v-40.424h40.424V219.775z M275.262,161.23h-40.424v-40.424h40.424V161.23z"></path>
                  <polygon points="111.373,55.757 129.489,46.232 147.606,55.757 144.146,35.584 158.803,21.297 138.548,18.354 129.489,0 120.43,18.354 100.176,21.297 114.832,35.584 "></polygon>
                  <polygon points="171.883,55.757 190,46.232 208.117,55.757 204.656,35.584 219.313,21.297 199.059,18.354 190,0 180.941,18.354 160.687,21.297 175.344,35.584 "></polygon>
                  <polygon points="232.394,55.757 250.511,46.232 268.627,55.757 265.168,35.584 279.824,21.297 259.57,18.354 250.511,0 241.452,18.354 221.197,21.297 235.854,35.584 "></polygon>
                </g>
              </g>
            </svg>{" "}
            Hotel
          </button>
        </div>

        <div className="controls">
          <div className="trip-group">
            {TRIP_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setTripType(t)}
                className={`trip-btn ${tripType === t ? "active" : ""}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="pill">
            <Plane size={15} style={{ color: "#1d6dc8" }} />
            {cabinClass}
            <ChevronDown
              size={14}
              onClick={() =>
                setActiveDropdown(activeDropdown === "class" ? null : "class")
              }
            />
            {activeDropdown === "class" && (
              <div className="dropdown">
                {CABIN_CLASSES.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCabinClass(c);
                      setActiveDropdown(null);
                    }}
                    className="dropdown-item"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pill">
            <Users size={15} style={{ color: "#1d6dc8" }} />
            {totalPass} Traveller{totalPass > 1 ? "s" : ""}
            <ChevronDown
              size={14}
              onClick={() =>
                setActiveDropdown(activeDropdown === "pass" ? null : "pass")
              }
            />
            {activeDropdown === "pass" && (
              <div className="dropdown pass-dropdown">
                <PassengerRow
                  label="Adult"
                  sub="12+ years"
                  value={passengers.adult}
                  onDec={() => updatePassenger("adult", -1)}
                  onInc={() => updatePassenger("adult", 1)}
                />
                <PassengerRow
                  label="Child"
                  sub="2-11 years"
                  value={passengers.child}
                  onDec={() => updatePassenger("child", -1)}
                  onInc={() => updatePassenger("child", 1)}
                />
                <PassengerRow
                  label="Infant"
                  sub="Under 2"
                  value={passengers.infant}
                  onDec={() => updatePassenger("infant", -1)}
                  onInc={() => updatePassenger("infant", 1)}
                />
                <button
                  onClick={() => setActiveDropdown(null)}
                  className="done-btn"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="form">
          {tripType === "Multi-City" ? (
            <>
              {flights.map((flight, idx) => (
                <div key={flight.id} className="multi-flight">
                  <div className="multi-header">
                    <div className="multi-title">Flight {idx + 1}</div>
                    {flights.length > 2 && (
                      <button
                        onClick={() => removeFlight(flight.id)}
                        className="x-btn"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <div className="input-grid">
                    <div className="input-row">
                      <div className="field-group">
                        <div className="field-label">From</div>
                        <div className="field">
                          <Plane size={16} style={{ color: "#1d6dc8" }} />
                          <input
                            placeholder="City or Airport"
                            value={flight.from}
                            onChange={(e) =>
                              updateFlight(flight.id, "from", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div
                        className="swap"
                        onClick={() => swapMultiRoute(flight.id)}
                      >
                        <svg viewBox="0 0 28 28" fill="none">
                          <circle cx="14" cy="14" r="14" />
                          <path d="M10 11h6M14 8l2 3-2 3M18 17h-6M14 20l-2-3 2-3" />
                        </svg>
                      </div>
                      <div className="field-group">
                        <div className="field-label">To</div>
                        <div className="field">
                          <Plane size={16} style={{ color: "#1d6dc8" }} />
                          <input
                            placeholder="City or Airport"
                            value={flight.to}
                            onChange={(e) =>
                              updateFlight(flight.id, "to", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="input-row">
                      <div className="field-group">
                        <div className="field-label">Departure Date</div>
                        <div className="field">
                          <Calendar size={16} style={{ color: "#ef4444" }} />
                          <input
                            type="date"
                            value={flight.date}
                            onChange={(e) =>
                              updateFlight(flight.id, "date", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      {/* {idx === 0 && (
                        <div className="field-group">
                          <div className="field-label">Contact Number</div>
                          <div className="field">
                            <Phone size={16} style={{ color: "#1d6dc8" }} />
                            <input
                              placeholder="+92 300 1234567"
                              value={contact}
                              onChange={(e) => setContact(e.target.value)}
                            />
                          </div>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              ))}

              <button onClick={addFlight} className="add-btn">
                <span className="add-icon">
                  <Plus size={14} />
                </span>
                Add Another Flight
              </button>

              <div className="search-section">
                <button className="search-btn">
                  <Search size={20} />
                  Search Flights
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="input-grid">
                <div className="input-row">
                  <div className="field-group">
                    <div className="field-label">From</div>
                    <div className="field">
                      <Plane size={18} style={{ color: "#1d6dc8" }} />
                      <input
                        placeholder="City or Airport"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="swap" onClick={swapRoute}>
                    <svg viewBox="0 0 28 28" fill="none">
                      <circle cx="14" cy="14" r="14" />
                      <path d="M10 11h6M14 8l2 3-2 3M18 17h-6M14 20l-2-3 2-3" />
                    </svg>
                  </div>
                  <div className="field-group">
                    <div className="field-label">To</div>
                    <div className="field">
                      <Plane size={18} style={{ color: "#1d6dc8" }} />
                      <input
                        placeholder="City or Airport"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="input-row">
                  <div className="field-group">
                    <div className="field-label">Departure</div>
                    <div className="field">
                      <Calendar size={18} style={{ color: "#ef4444" }} />
                      <input
                        type="date"
                        value={departDate}
                        onChange={(e) => setDepartDate(e.target.value)}
                      />
                    </div>
                  </div>
                  {tripType === "Round Trip" && (
                    <div className="field-group">
                      <div className="field-label">Return</div>
                      <div className="field">
                        <Calendar size={18} style={{ color: "#ef4444" }} />
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="search-section">
                <button className="search-btn">
                  <Search size={20} />
                  Search Flights
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
