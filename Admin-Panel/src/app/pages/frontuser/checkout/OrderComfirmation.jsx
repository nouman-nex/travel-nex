import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Home, ChevronRight } from "lucide-react";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { MEDIA_BASE_URL } from "../../../../backendServices/ApiCalls";

const OrderConfirmation = ({ orderDetails }) => {
  console.log("deatils", orderDetails);
  const navigate = useNavigate();

  // If no order details are provided, redirect to home
  if (!orderDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-6">
            No order information found
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#114F33] text-white px-6 py-3 rounded-md font-medium flex items-center"
          >
            Go Home <Home className="ml-2" size={18} />
          </button>
        </div>
      </div>
    );
  }

  const {
    orderId,
    ticketQuantity,
    totalCost,
    paymentMethod,
    competitionTitle,
    selectedImage,
    isVipPack,
    vipPackDetails,
  } = orderDetails;

  return (
    <div className="w-full bg-white">
      <Navbar />

      <div className="max-w-[1000px] mx-auto px-4 py-16">
        <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={50} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 mt-2">
              Thank you for your purchase. Your tickets are now active.
            </p>
          </div>

          <div className="border-t border-b border-gray-200 py-6 my-6">
            <div className="flex flex-col sm:flex-row items-center mb-6">
              <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
                <img
                  src={`${MEDIA_BASE_URL}/${selectedImage}`}
                  alt={competitionTitle}
                  className="w-full h-auto object-contain rounded-md"
                />
              </div>
              <div className="w-full sm:w-2/3 sm:pl-6">
                <h2 className="text-xl font-bold text-[#1d1b1c]">
                  {competitionTitle}
                </h2>
                {isVipPack ? (
                  <div className="mt-2">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      VIP Pack
                    </span>
                    <div className="mt-3 text-gray-700">
                      <p>
                        <span className="font-medium">Tickets:</span>{" "}
                        {ticketQuantity}
                      </p>
                      <p>
                        <span className="font-medium">Discount:</span>{" "}
                        {vipPackDetails?.discount}%
                      </p>
                      <p>
                        <span className="font-medium">Winning Chance:</span>{" "}
                        {vipPackDetails?.chance}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      Standard Tickets
                    </span>
                    <p className="mt-3 text-gray-700">
                      <span className="font-medium">Tickets:</span>{" "}
                      {ticketQuantity}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-bold text-gray-800 mb-3">Order Summary</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-medium">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium capitalize">
                    {paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-medium">$ {totalCost}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-bold text-gray-800 mb-3">What's Next?</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <ChevronRight
                    size={18}
                    className="text-[#114F33] mr-2 mt-1"
                  />
                  <span>
                    A confirmation email has been sent to your registered email
                    address.
                  </span>
                </li>
                <li className="flex items-start">
                  <ChevronRight
                    size={18}
                    className="text-[#114F33] mr-2 mt-1"
                  />
                  <span>
                    You can view your tickets in your account dashboard.
                  </span>
                </li>
                <li className="flex items-start">
                  <ChevronRight
                    size={18}
                    className="text-[#114F33] mr-2 mt-1"
                  />
                  <span>The competition draw will be held as scheduled.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto bg-[#114F33] text-white px-6 py-3 rounded-md font-medium flex items-center justify-center"
            >
              Go to My Dashboard <ArrowRight className="ml-2" size={18} />
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#1B1B1B]">
        <Footer />
      </div>
    </div>
  );
};

export default OrderConfirmation;
