import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import Faqs from "../../../components/Faqs/Faqs";
import ProductValues from "../../../components/ProductValues/ProductValues";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import {
  MEDIA_BASE_URL,
  postRequest,
} from "../../../../backendServices/ApiCalls";
import { Spinner } from "@app/_shared";
import { useCheckout } from "@app/_components/AppProvider/context/checkoutContext";

export default function ProductDetail() {
  window.scrollTo(0, 0);
  const navigate = useNavigate();
  const location = useLocation();
  const { setProduct } = useCheckout(); // Use the context

  const [selectedNumber, setSelectedNumber] = useState(1);
  const [selectedPack, setSelectedPack] = useState(null);
  console.log(selectedPack);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [outOfStock, setOutOfStock] = useState(false);
  const [ended, setIsEnded] = useState(false);
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);

  const numberOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const vipPacks = [
    { tickets: 15, discount: 10, chance: "1/67" },
    { tickets: 20, discount: 15, chance: "1/50" },
    { tickets: 25, discount: 20, chance: "1/40" },
    { tickets: 50, discount: 25, chance: "1/20" },
  ];

  // Get competition ID from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");

    if (id) {
      setLoading(true);
      postRequest(
        "/getCompetitionById",
        { id },
        (response) => {
          console.log("response ...", response);
          if (response.data) {
            setCompetition(response?.data?.data[0]);
            if (
              new Date(response?.data?.data[0].endDateTime).getTime() <
              Date.now()
            ) {
              setIsEnded(true);
            }
          } else {
            console.error("No competition data found");
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching competition:", error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, [location.search]);

  // Safely get watch images only if competition exists
  const watchImages = competition?.pictures?.length
    ? competition.pictures
    : [`${ASSET_IMAGES}/frontweb/heading1.png`];

  // Function to handle continuing to checkout
  const handleContinueToCheckout = () => {
    // Create product object with all relevant details
    const productDetails = {
      competition,
      selectedImage: competition.featuredImage,
      quantity: selectedNumber,
      packDetails: selectedPack !== null ? vipPacks[selectedPack] : null,
      ticketPrice: competition.ticketValue,
      totalCost: calculateTotalCost(),
    };

    // Set the product in context
    setProduct(productDetails);

    // Navigate to checkout
    navigate("/checkout");
  };

  // Calculate total cost based on selection
  const calculateTotalCost = () => {
    if (selectedPack !== null) {
      const pack = vipPacks[selectedPack];
      const basePrice = competition.ticketValue * pack.tickets;
      const discount = basePrice * (pack.discount / 100);
      return basePrice;
    } else {
      return competition.ticketValue * selectedNumber;
    }
  };

  // Check if selected tickets exceed available tickets
  const isExceedingAvailableTickets = () => {
    if (selectedPack !== null) {
      const selectedTickets = vipPacks[selectedPack].tickets;
      return selectedTickets > competition?.availableTickets;
    } else {
      return selectedNumber > competition?.availableTickets;
    }
  };

  useEffect(() => {
    if (competition?.availableTickets === 0) {
      setOutOfStock(true);
    } else {
      setOutOfStock(false);
    }
  }, [competition]);

  if (loading) {
    return (
      <div className="w-full bg-white">
        <Navbar />
        <div className="max-w-[1440px] pt-[10%] md:pt-[4%] mx-auto flex justify-center items-center h-96">
          <Spinner />
        </div>
        <div className="bg-[#1B1B1B]">
          <Footer />
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="w-full bg-white">
        <Navbar />
        <div className="max-w-[1440px] pt-[10%] md:pt-[4%] mx-auto flex justify-center items-center h-96">
          <div className="text-xl">Competition not found</div>
        </div>
        <div className="bg-[#1B1B1B]">
          <Footer />
        </div>
      </div>
    );
  }

  console.log(ended);

  return (
    <div className="w-full bg-white">
      <Navbar />
      <div className="max-w-[1440px] pt-[10%] md:pt-[4%] mx-auto">
        <div className="flex flex-col md:flex-row bg-white p-4 gap-6">
          <div className="w-full md:w-1/2">
            <div className="flex flex-col-reverse gap-4 md:gap-0 md:flex-row">
              {/* Thumbnails */}
              <div className="flex md:flex-col gap-2 mb-4 md:mb-0">
                {watchImages.map((image, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 border overflow-hidden cursor-pointer flex items-center justify-center ${
                      selectedImageIndex === index
                        ? "border-green-800 border-2"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={`${MEDIA_BASE_URL}/${image}`}
                      className="max-w-full max-h-full object-contain"
                      alt={`Image ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-grow md:ml-4">
                <div className="w-full h-[90%] aspect-square bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  <img
                    src={`${MEDIA_BASE_URL}/${watchImages[selectedImageIndex]}`}
                    className="max-w-full max-h-full object-contain"
                    alt="Main product"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <div className="text-[#898989] font-bold text-lg">Win the</div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1D1B1C] mb-6">
              {competition.title}
            </h1>

            <div className="flex mb-6 py-4">
              <div className="w-1/2 border-l-2 border-[#114f33] px-3">
                <div className="text-2xl md:text-3xl font-bold text-[#1D1B1C]">
                  £{competition.ticketValue}
                </div>
                <div className="text-[#1d1b1c] text-base font-normal">
                  Entry Price
                </div>
              </div>
              <div className="w-1/2 border-l-2 border-[#114f33] px-3">
                <div className="text-2xl md:text-3xl font-bold text-[#1D1B1C]">
                  {competition.availableTickets ?? "N/A"}
                </div>
                <div className="text-[#1d1b1c] text-base font-normal">
                  Tickets Available
                </div>
              </div>
            </div>

            <div className="mb-6 pb-1 border-l-2 border-[#114f33] px-3">
              <div className="text-xl md:text-xl text-[#1d1b1c] font-bold">
                {competition.endDateTime
                  ? new Date(competition.endDateTime).toLocaleDateString()
                  : "N/A"}
              </div>
              <div className="text-[#1d1b1c] text-base font-normal">
                Draw Date
              </div>
              <div className="text-xs font-semibold text-[#898989]">
                or until all tickets are sold out. But never after the draw date
              </div>
            </div>

            {/* Number selection */}
            <div className="mb-6">
              <div className="grid grid-cols-10 gap-4">
                {numberOptions.map((num) => (
                  <button
                    key={num}
                    className={`flex items-center justify-center font-bold text-lg border ${
                      selectedNumber === num
                        ? "bg-primary text-white"
                        : "bg-white text-[#1d1b1c]"
                    }`}
                    onClick={() => {
                      setSelectedNumber(num);
                      setSelectedPack(null);
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* VIP Pack */}
            <div className="mb-6">
              <h2 className="text-[#898989] font-bold text-lg">VIP Pack</h2>
              <div className="grid grid-cols-4 gap-2">
                {vipPacks.map((pack, index) => (
                  <button
                    key={index}
                    className={`border p-1 text-center ${
                      selectedPack === index
                        ? "bg-primary text-white"
                        : "bg-white text-[#1d1b1c]"
                    } ${pack.tickets > competition?.availableTickets ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => {
                      if (pack.tickets <= competition?.availableTickets) {
                        setSelectedPack(index);
                        setSelectedNumber(null);
                      }
                    }}
                  >
                    <div className="font-bold text-sm">{pack.tickets}</div>
                    <div className="font-bold text-xs">
                      {pack.chance} chance to win
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Total Amount */}
            <div className="mb-6">
              <div className="text-lg font-bold">
                Total: £{calculateTotalCost()}
              </div>
            </div>

            {/* Continue button */}
            {(outOfStock || isExceedingAvailableTickets() || ended) && (
              <span className="text-red-600 font-semibold mb-2 block text-center">
                {outOfStock
                  ? "Tickets are out of stock"
                  : isExceedingAvailableTickets()
                    ? "You have exceeded the available number of tickets"
                    : ended
                      ? "This event has ended"
                      : ""}
              </span>
            )}

            <button
              disabled={outOfStock || isExceedingAvailableTickets() || ended}
              className={`w-full bg-primary hover:bg-hover text-white py-4 px-6 rounded flex items-center justify-center ${
                outOfStock || isExceedingAvailableTickets() || ended
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleContinueToCheckout}
            >
              <span className="font-bold text-xl mr-2">
                Continue to the next step
              </span>
              <ArrowRight size={25} className="mt-2" />
            </button>
          </div>
        </div>

        <ProductValues />
        <Faqs />
      </div>
      <div className="bg-[#1B1B1B]">
        <Footer />
      </div>
    </div>
  );
}
