import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import React, { useState, useEffect } from "react";
import { postRequest } from "../../../../backendServices/ApiCalls";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import {
  Package,
  DollarSign,
  Calendar,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Zap,
  AlertCircle,
  Info,
  Eye,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Div } from "@jumbo/shared";
import { Button, Stack, Typography } from "@mui/material";
import useNotify from "@app/_components/Notification/useNotify";

export default function MyPackages() {
  const { t } = useTranslation();
  const { User } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const notify = useNotify();
  const [mintingForm, setMintingForm] = useState({
    mintingType: "AUTO",
    investedAmount: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [mintingDetailsModal, setMintingDetailsModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (User) {
      const roles = Array.isArray(User.roles) ? User.roles : [];
      const isUser = roles.includes("User");

      if (!isUser) {
        navigate("/adminDashboard");
      }
    }
  }, [User, navigate]);
  const fetchUserPackages = () => {
    setLoading(true);
    postRequest(
      "/getPackagesOfUser",
      {},
      (response) => {
        console.log(response);
        console.log("Fetched packages:", response);
        if (response.data) {
          setPackages(response.data.data || []);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching packages:", error);
        toast.error("Failed to fetch packages");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchUserPackages();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (isActive) => {
    return isActive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";
  };

  const getStatusIcon = (isActive) => {
    return isActive ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <XCircle className="w-4 h-4" />
    );
  };

  // Calculate remaining amount in package
  const getRemainingAmount = (pkg) => {
    return pkg.remainingAmount || 0;
  };

  // Check if package has active minting
  const hasActiveMinting = (pkg) => {
    return pkg.hasActiveMinting || false;
  };

  // Get current minting activity
  const getCurrentMintingActivity = (pkg) => {
    return pkg.mintingActivities?.find((activity) => activity.isActive) || null;
  };

  // Get investment amounts by type
  const getInvestmentAmountsByType = (pkg) => {
    let autoAmount = 0;
    let selfAmount = 0;

    if (pkg.mintingActivities && pkg.mintingActivities.length > 0) {
      pkg.mintingActivities.forEach((activity) => {
        if (activity.mintingType === "AUTO") {
          autoAmount += activity.investedAmount || 0;
        } else if (activity.mintingType === "MANUAL") {
          selfAmount += activity.investedAmount || 0;
        }
      });
    }

    return { autoAmount, selfAmount };
  };

  // Get minimum minting requirements
  const getMinimumMintingInfo = (pkg) => {
    // Check if package has minimum minting requirements
    let minimumMinting = 0;
    let isRequired = false;

    // First check hubPackage
    if (pkg.hubPackage?.minimumMinting) {
      minimumMinting = pkg.hubPackage.minimumMinting;
    }

    // Then check packageDetails from packages collection
    if (pkg.packageDetails) {
      if (pkg.packageDetails.minimumMinting) {
        minimumMinting = parseFloat(pkg.packageDetails.minimumMinting);
      }
      isRequired = pkg.packageDetails.minimumMintingRequired === true;
    }

    return { minimumMinting, isRequired };
  };

  const handleStartMinting = () => {
    const remainingAmount = getRemainingAmount(selectedPackage);
    const { minimumMinting, isRequired } =
      getMinimumMintingInfo(selectedPackage);
    const isReInvestment = hasActiveMinting(selectedPackage);

    // Validation checks
    if (!mintingForm.investedAmount || mintingForm.investedAmount <= 0) {
      toast.error("Please enter a valid invested amount");
      return;
    }

    if (parseFloat(mintingForm.investedAmount) > remainingAmount) {
      toast.error(
        `Invested amount cannot exceed remaining amount: ${formatAmount(remainingAmount)}`
      );
      return;
    }

    // Check minimum minting requirement only for new investments
    if (
      !isReInvestment &&
      isRequired &&
      parseFloat(mintingForm.investedAmount) < minimumMinting
    ) {
      toast.error(
        `Minimum {t("myPackages.mintingModal.amountLabel")}
 required: ${formatAmount(minimumMinting)}`
      );
      return;
    }

    setSubmitting(true);
    const requestData = {
      investmentId: selectedPackage._id,
      mintingType: mintingForm.mintingType,
      investedAmount: parseFloat(mintingForm.investedAmount),
    };

    postRequest(
      "/startMinting",
      requestData,
      (response) => {
        console.log("Minting response:", response);
        setSubmitting(false);
        if (response.data.success) {
          const message = response.data.isReInvestment
            ? `Successfully added ${formatAmount(mintingForm.investedAmount)} to your existing minting activity!`
            : response.data.message || t("myPackages.success.mintingStarted");

          toast.success(message);
          notify(t("myPackages.success.mintingStarted"), "success");
          toast.success("Invested successfully and minting started");
          setSelectedPackage(null);
          setMintingForm({ mintingType: "AUTO", investedAmount: "" });
          fetchUserPackages();
        } else {
          toast.error(response.data.message || "Failed to start minting");
        }
      },
      (error) => {
        console.error("Error starting minting:", error);
        setSubmitting(false);
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error(
            "An error occurred while starting minting. Please try again."
          );
        }
      }
    );
  };

  const getCryptoColor = (crypto) => {
    return crypto === "USDT"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";
  };

  const handleCloseModal = () => {
    setSelectedPackage(null);
    setMintingForm({ mintingType: "AUTO", investedAmount: "" });
  };

  // MintingDetailsModal Component
  const MintingDetailsModal = ({ isOpen, onClose, packageData }) => {
    if (!isOpen || !packageData) return null;

    const { autoAmount, selfAmount } = getInvestmentAmountsByType(packageData);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
        <div className="bg-white rounded-2xl max-w-lg w-full h-[500px] flex flex-col overflow-hidden">
          {" "}
          {/* Fixed height */}
          {/* Fixed Header */}
          <div className="shrink-0 bg-white border-b border-gray-200 p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-r from-[#AC9B6D] via-[#8B7550] to-[#6A5637] rounded-lg">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {t("myPackages.mintingDetailsModal.title")}
                  </h2>
                  <p className="text-xs text-gray-600">
                    Hub #{packageData.packageNumber || "N/A"} •{" "}
                    {packageData.cryptoUsed}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Your dynamic content goes here */}
            {/* This will scroll when content exceeds available space */}
          </div>
          {/* Fixed Footer */}
          <div className="shrink-0 bg-white border-t border-gray-200 p-4 rounded-b-2xl">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-[#AC9B6D] via-[#8B7550] to-[#6A5637] text-white py-1.5 px-3 rounded-md text-sm font-medium hover:from-[#BFA670] hover:via-[#9C7F52] hover:to-[#7A5F3A] transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* <Div sx={{ borderBottom: 2, borderColor: "divider", py: 1, mb: 3 }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <>
            <Div sx={{ display: { xs: "none", lg: "block" } }}>
              <Typography variant="h3" sx={{ my: 1 }}>
                Packages
              </Typography>
            </Div>
          </>
        </Stack>
      </Div> */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="mb-8">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-[#AC9B6D] via-[#8B7550] to-[#6A5637] rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <Typography
              variant="h3"
              sx={{
                background: "linear-gradient(to right, #374151, #4B5563)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("myPackages.title")}
            </Typography>
          </div>
          <p className="text-gray-600 text-sm">{t("myPackages.subtitle")}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("myPackages.stats.totalHubs")}
                </p>
                <p style={{ fontSize: 18 }} className="text-2xl text-gray-800">
                  {packages.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("myPackages.stats.totalInvested")}
                </p>
                <p style={{ fontSize: 18 }} className="text-2xl text-gray-800">
                  {formatAmount(
                    packages.reduce(
                      (sum, pkg) => sum + (pkg.totalInvested || 0),
                      0
                    )
                  )}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              {/* Left: Value and Label */}
              <div className="flex flex-col justify-center">
                <p className="text-sm text-gray-600 mb-1">
                  {t("myPackages.stats.active")}
                </p>
                <p style={{ fontSize: 18 }} className="text-2xl text-gray-800">
                  {packages.filter((pkg) => hasActiveMinting(pkg)).length}
                </p>
              </div>

              {/* Middle: Small Centered Button */}
              <div className="flex items-center justify-center px-2">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate("/minting")}
                  sx={{
                    color: "white",
                    fontSize: "0.7rem",
                    background: "linear-gradient(to right, #AC9B6D, #6A5637)",
                    "&:hover": {
                      background: "linear-gradient(to right, #BFA670, #7A5F3A)",
                    },
                    "&:disabled": {
                      background: "linear-gradient(to right, #e5e7eb, #d1d5db)",
                      color: "#6b7280",
                      opacity: 1,
                    },
                    px: 2,
                    py: 0.5,
                    minWidth: "60px",
                    height: "28px",
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  {t("myPackages.hubCard.viewDetails")}
                </Button>
              </div>

              {/* Right: Icon */}
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("myPackages.stats.hubCapacity")}
                </p>

                <p style={{ fontSize: 18 }} className="text-2xl text-gray-800">
                  {packages.reduce(
                    (sum, pkg) => sum + (pkg.hubPackage?.hubCapacity || 0),
                    0
                  )}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        {packages.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {t("myPackages.noHubs.title")}
            </h3>
            <p className="text-gray-500">
              {t("myPackages.noHubs.description")}
            </p>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate("/packages")}
              sx={{
                mt: 3,
                color: "white",
                background: "linear-gradient(to right, #AC9B6D, #6A5637)",
                "&:hover": {
                  background: "linear-gradient(to right, #BFA670, #7A5F3A)",
                },
                "&:disabled": {
                  background: "linear-gradient(to right, #e5e7eb, #d1d5db)",
                  color: "#6b7280",
                  opacity: 1, // Keep it fully visible
                },
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              {t("myPackages.noHubs.buyButton")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, index) => {
              const remainingAmount = getRemainingAmount(pkg);
              const totalInvested = pkg.totalInvested || 0;
              const isActiveMinting = hasActiveMinting(pkg);
              const currentActivity = getCurrentMintingActivity(pkg);
              const { minimumMinting, isRequired } = getMinimumMintingInfo(pkg);
              const { autoAmount, selfAmount } =
                getInvestmentAmountsByType(pkg);

              return (
                <div
                  key={pkg._id || index}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                >
                  {/* Package Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-r from-[#AC9B6D] via-[#8B7550] to-[#6A5637] rounded-lg">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-gray-800">
                        {t("myPackages.hubCard.hubNumber")} # {index + 1}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getCryptoColor(pkg.cryptoUsed)}`}
                    >
                      {pkg.cryptoUsded}
                    </span>
                  </div>

                  {/* Investment Details */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        {t("myPackages.hubCard.totalCapacity")}{" "}
                      </span>
                      <span className="text-lg text-gray-800">
                        {formatAmount(pkg.amount)}
                      </span>
                    </div>
                    {totalInvested > 0 && (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            {t("myPackages.hubCard.totalInvested")}
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            {formatAmount(totalInvested)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            {t("myPackages.hubCard.remaining")}
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            {formatAmount(remainingAmount)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Hub Package Details */}
                  {pkg.hubPackage && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        {t("myPackages.hubCard.hubDetails")}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {t("myPackages.hubCard.hubPrice")}
                          </span>
                          <span className="font-medium">
                            {formatAmount(pkg.hubPackage.hubPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Minting Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">
                      {t("myPackages.hubCard.mintingStatus")}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* Eye button for packages with {t("myPackages.mintingDetailsModal.title")} */}
                      {pkg.mintingActivities &&
                        pkg.mintingActivities.length > 0 && (
                          <button
                            onClick={() => setMintingDetailsModal(pkg)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            title="View Minting Details"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(isActiveMinting)}`}
                      >
                        {getStatusIcon(isActiveMinting)}
                        {isActiveMinting ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {t("myPackages.hubCard.purchased")}
                        {formatDate(pkg.purchaseDate)}
                      </span>
                    </div>
                    {pkg.startDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {t("myPackages.hubCard.started")}
                          {formatDate(pkg.startDate)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    {remainingAmount <= 0 ? (
                      <div className="w-full bg-gray-100 text-gray-500 py-2 px-4 rounded-lg font-medium text-center flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {t("myPackages.hubCard.fullyInvested")}
                      </div>
                    ) : isActiveMinting ? (
                      <button
                        onClick={() => setSelectedPackage(pkg)}
                        className="w-full bg-gradient-to-r from-[#AC9B6D] via-[#8B7550] to-[#6A5637] text-white py-2 px-4 rounded-lg font-medium hover:from-[#BFA670] hover:via-[#9C7F52] hover:to-[#7A5F3A] transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <TrendingUp className="w-4 h-4" />
                        {t("myPackages.hubCard.startMinting")}{" "}
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedPackage(pkg)}
                        className="w-full bg-gradient-to-r from-[#AC9B6D] via-[#8B7550] to-[#6A5637] text-white py-2 px-4 rounded-lg font-medium hover:from-[#BFA670] hover:via-[#9C7F52] hover:to-[#7A5F3A] transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        {t("myPackages.hubCard.startMinting")}{" "}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Updated MintingDetailsModal - place this after the packages grid */}
            {mintingDetailsModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-[#AC9B6D] via-[#8B7550] to-[#6A5637] rounded-lg">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">
                            {t("myPackages.mintingDetailsModal.title")}
                          </h2>
                          <p className="text-sm text-gray-600">
                            Hub #
                            {packages.findIndex(
                              (p) => p._id === mintingDetailsModal._id
                            ) + 1}{" "}
                            • {mintingDetailsModal.cryptoUsed}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setMintingDetailsModal(null)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6">
                    {/* Package Info - Moved from card */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-green-600" />
                          <h4 className="font-semibold text-green-700">
                            {t(
                              "myPackages.mintingDetailsModal.packageSummary"
                            )}{" "}
                          </h4>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">
                            {t(
                              "myPackages.mintingDetailsModal.totalCapacity"
                            )}{" "}
                          </span>
                          <p className="font-medium text-gray-800">
                            {formatAmount(mintingDetailsModal.amount)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            {t("myPackages.mintingDetailsModal.totalInvested")}
                          </span>
                          <p className="font-medium text-blue-600">
                            {formatAmount(
                              mintingDetailsModal.totalInvested || 0
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            {t("myPackages.mintingDetailsModal.remaining")}
                          </span>
                          <p className="font-medium text-green-600">
                            {formatAmount(
                              getRemainingAmount(mintingDetailsModal)
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            {t("myPackages.mintingDetailsModal.activeMinting")}
                          </span>
                          <p className="font-medium text-green-700">
                            {mintingDetailsModal.mintingActivities?.length || 0}
                          </p>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-3">
                        <h4 className="font-semibold text-gray-700 text-sm mb-2">
                          {t(
                            "myPackages.mintingDetailsModal.investmentSummary"
                          )}
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Zap className="w-3 h-3 text-blue-500" />
                              <span className="text-xs text-gray-600">
                                Auto:
                              </span>
                            </div>
                            <span className="text-xs font-medium text-blue-600">
                              {formatAmount(
                                getInvestmentAmountsByType(mintingDetailsModal)
                                  .autoAmount
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Activity className="w-3 h-3 text-purple-500" />
                              <span className="text-xs text-gray-600">
                                Self:
                              </span>
                            </div>
                            <span className="text-xs font-medium text-purple-600">
                              {formatAmount(
                                getInvestmentAmountsByType(mintingDetailsModal)
                                  .selfAmount
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
                    <button
                      onClick={() => setMintingDetailsModal(null)}
                      className="w-full bg-gradient-to-r from-[#AC9B6D] via-[#8B7550] to-[#6A5637] text-white py-2 px-4 rounded-lg font-medium hover:from-[#BFA670] hover:via-[#9C7F52] hover:to-[#7A5F3A] transition-all duration-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Start Minting Modal */}
        {selectedPackage && (
          <div className="fixed inset-0 mt-[5%] bg-black bg-opacity-50 flex items-center justify-center p-1 z-50">
            <div className="bg-white rounded-2xl p-4 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-lg ${hasActiveMinting(selectedPackage) ? "bg-gradient-to-r from-orange-500 to-red-600" : "bg-gradient-to-r from-green-500 to-blue-600"}`}
                  >
                    {hasActiveMinting(selectedPackage) ? (
                      <TrendingUp className="w-5 h-5 text-white" />
                    ) : (
                      <Zap className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {t("myPackages.mintingModal.title")}
                  </h3>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={submitting}
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Package Info */}
              <div className="bg-gray-50 rounded-lg p-3 mb-2">
                <h4 className="font-semibold text-gray-700 mb-2">
                  {t("myPackages.mintingModal.hubDetails")}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t("myPackages.mintingModal.totalCapacity")}
                    </span>
                    <span className="font-medium">
                      {formatAmount(selectedPackage.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t("myPackages.mintingModal.remainingCapacity")}
                    </span>
                    <span className="font-medium text-green-600">
                      {formatAmount(getRemainingAmount(selectedPackage))}
                    </span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-gray-600">Crypto Used:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getCryptoColor(selectedPackage.cryptoUsed)}`}
                    >
                      {selectedPackage.cryptoUsed}
                    </span>
                  </div> */}
                </div>
              </div>

              {/* Re-Investment Info */}
              {/* {hasActiveMinting(selectedPackage) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Re-Investment Information
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">
                    You are adding funds to your existing active minting
                    activity. This will increase your total invested amount.
                  </p>
                  {(() => {
                    const currentActivity =
                      getCurrentMintingActivity(selectedPackage);
                    return (
                      currentActivity && (
                        <div className="text-sm text-blue-700">
                          <strong>Current Investment:</strong>{" "}
                          {formatAmount(currentActivity.investedAmount)}
                        </div>
                      )
                    );
                  })()}
                </div>
              )} */}

              {/* Minimum Minting Warning */}
              {(() => {
                const { minimumMinting, isRequired } =
                  getMinimumMintingInfo(selectedPackage);
                const isReInvestment = hasActiveMinting(selectedPackage);

                return (
                  isRequired &&
                  !isReInvestment && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">
                          {t("myPackages.mintingModal.minimumRequired")}
                        </span>
                      </div>
                      <p className="text-sm text-orange-700">
                        {t("myPackages.mintingDetailsModal.investAtleast")}{" "}
                        {formatAmount(minimumMinting)}{" "}
                      </p>
                    </div>
                  )
                );
              })()}

              {/* Minting Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("myPackages.mintingModal.mintingType")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setMintingForm({ ...mintingForm, mintingType: "AUTO" })
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        mintingForm.mintingType === "AUTO"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      disabled={submitting}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span className="font-medium">
                          {t("myPackages.mintingModal.auto")}
                        </span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setMintingForm({
                          ...mintingForm,
                          mintingType: "MANUAL",
                        })
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        mintingForm.mintingType === "MANUAL"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      disabled={submitting}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Activity className="w-4 h-4" />
                        <span className="font-medium">
                          {" "}
                          {t("myPackages.mintingModal.manual")}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("myPackages.mintingModal.amountLabel")}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={mintingForm.investedAmount}
                      onChange={(e) =>
                        setMintingForm({
                          ...mintingForm,
                          investedAmount: e.target.value,
                        })
                      }
                      placeholder={
                        hasActiveMinting(selectedPackage)
                          ? t("myPackages.mintingModal.additionalAmount")
                          : t("myPackages.amountInvests")
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={submitting}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {t("myPackages.mintingModal.available")}
                    {formatAmount(getRemainingAmount(selectedPackage))}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 ">
                  <button
                    onClick={handleCloseModal}
                    disabled={submitting}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
                  >
                    {t("myPackages.mintingModal.cancel")}
                  </button>
                  <button
                    onClick={handleStartMinting}
                    disabled={submitting}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : hasActiveMinting(selectedPackage)
                          ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                          : "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                    }`}
                  >
                    {submitting ? (
                      t("myPackages.mintingModal.processing")
                    ) : hasActiveMinting(selectedPackage) ? (
                      <>
                        <TrendingUp className="inline w-4 h-4 mr-2" />
                        {t("myPackages.hubCard.startMinting")}{" "}
                      </>
                    ) : (
                      <>
                        <Zap className="inline w-4 h-4 mr-2" />
                        {t("myPackages.hubCard.startMinting")}{" "}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
