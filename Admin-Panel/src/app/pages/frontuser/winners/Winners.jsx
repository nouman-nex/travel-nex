import { useEffect, useState } from "react";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import Footer from "@app/components/Footer/Footer";
import Navbar from "@app/components/Navbar/Navbar";
import {
  MEDIA_BASE_URL,
  postRequest,
} from "../../../../backendServices/ApiCalls";

function Winners() {
  const [winners, setWinners] = useState([]);
  const fetchWinners = (first) => {
    postRequest("/getWinners", {}, (res) => {
      console.log("Fetched Winners:", res);
      setWinners(res.data.data);
    });
  };
  useEffect(() => {
    fetchWinners();
  }, []);
  const itemsPerRow = 3;
  const rowsPerClick = 2;
  const initialVisible = itemsPerRow * rowsPerClick;
  const [visibleCount, setVisibleCount] = useState(initialVisible);

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + itemsPerRow * rowsPerClick);
  };

  const showButton = visibleCount < winners.length;

  return (
    <div className="w-full">
      <Navbar />
      <div>
        <div className="bg1 flex flex-col items-center my-20 py-32 gap-10 justify-center">
          <p className="font-nunito text-center font-bold max-w-6xl text-3xl md:text-6xl text-white">
            Our mission is to make luxury timepieces accessible to all.
          </p>
          <p className="font-nunito text-center font-semibold text-3xl md:text-5xl text-primary">
            Their Ultimate Dream Watch
          </p>
        </div>
        <p className="font-nunito text-center mx-auto font-bold max-w-6xl text-3xl md:text-6xl text-black mb-10">
          Winners
        </p>
        <div className="mx-auto max-w-[1440px] px-4">
          <div className="flex flex-wrap gap-8 justify-center">
            {winners.slice(0, visibleCount).map((winner, idx) => (
              <div
                key={idx}
                className="w-[348px] flex-shrink-0 bg-white rounded-2xl shadow-md overflow-hidden mb-8"
              >
                <div className="w-full aspect-[5/5] overflow-hidden bg-gray-100">
                  <img
                    src={MEDIA_BASE_URL + winner.winnerPicture}
                    alt={winner.winnerName}
                    className="w-full h-full object-cover object-center transition-all duration-300 ease-in-out"
                  />
                </div>
                <div className="bg-primary h-[19%] text-white p-4">
                  <p className="font-bold text-lg font-nunito">
                    Winner of {winner.competitionName}
                  </p>
                  <div className="flex justify-between mt-2">
                    <p className="text-sm font-semibold font-nunito">
                      {winner.winnerName}
                    </p>
                    <p className="text-xs font-bold font-nunito">
                      <span className="font-extrabold text-sm">
                        £ {winner.ticketValue}
                      </span>{" "}
                      Value
                    </p>
                  </div>
                </div>
                <button className="bg-[#1D1B1C] text-primary h-10 text-md font-extrabold font-nunito w-full hover:bg-gray-900">
                  {new Date(winner.endDateTime).toLocaleString()}
                </button>
              </div>
            ))}
          </div>

          {showButton && (
            <div className="text-center mt-10">
              <button
                onClick={handleViewMore}
                className="bg-primary text-white font-bold font-nunito px-6 py-3 rounded-xl hover:bg-[#93845a] transition-all duration-300"
              >
                View More
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="bg-[#1B1B1B] mt-20">
        <Footer />
      </div>
    </div>
  );
}

export default Winners;
