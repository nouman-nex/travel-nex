import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import {
  ChevronRight,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Wallet,
} from "lucide-react";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { useCheckout } from "@app/_components/AppProvider/context/checkoutContext";
import {
  MEDIA_BASE_URL,
  postRequest,
} from "../../../../backendServices/ApiCalls";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import OrderConfirmation from "./OrderComfirmation";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_reCAPTCHA_SITE_KEY;

const checkoutSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  country: Yup.string().required("Country is required"),
  zipCode: Yup.string().required("ZIP code is required"),
  address: Yup.string().required("Address is required"),
  town: Yup.string().required("Town/City is required"),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  termsAccepted: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions"
  ),
  // Add reCAPTCHA validation
  recaptchaToken: Yup.string().required(
    "Please complete the reCAPTCHA verification"
  ),
});

const Checkout = () => {
  window.scrollTo(0, 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [country, setCountry] = useState("US");
  const { User } = useAuth();
  const [formInitialValues, setFormInitialValues] = useState({
    firstName: "",
    lastName: "",
    country: "",
    zipCode: "",
    address: "",
    town: "",
    phone: "",
    email: "",
    coupon: "",
    termsAccepted: false,
    emailUpdates: false,
    isGift: false,
    recaptchaToken: "", // Add reCAPTCHA token field
  });
  const [formKey, setFormKey] = useState(0);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [formValues, setFormValues] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [recaptchaRef, setRecaptchaRef] = useState(null);
  const [comfirmationDetails, setComfirmationDetails] = useState({});
  const navigate = useNavigate();
  const { product, setProduct } = useCheckout();

  const [ticketCount, setTicketCount] = useState(
    product?.quantity || product?.packDetails?.tickets || 1
  );

  useEffect(() => {
    if (product && !product?.packDetails) {
      const updatedProduct = {
        ...product,
        quantity: ticketCount,
        totalCost: (ticketCount * (product?.ticketPrice || 0)).toFixed(2),
      };
      setProduct(updatedProduct);
    }
  }, [ticketCount]);

  useEffect(() => {
    if (User) {
      console.log("Setting user data for form:", User);

      const newInitialValues = {
        firstName: User.firstName || "",
        lastName: User.lastName || "",
        country: User.address?.country || "",
        zipCode: User.address?.zipCode || "",
        address: User.address?.shortAddress || "",
        town: User.address?.city || "",
        phone: User.cellNumber || "",
        email: User.email || "",
        coupon: "",
        termsAccepted: false,
        emailUpdates: false,
        isGift: false,
        recaptchaToken: "",
      };

      setFormInitialValues(newInitialValues);
      setFormKey((prevKey) => prevKey + 1);

      if (User.address?.country) {
        setCountry(User.address.country);
      }
    }
  }, [User]);

  const isVipPack = !!product?.packDetails;

  const ticketPrice = product?.ticketPrice || 0;
  const totalCost = product?.totalCost || 0;

  const countryFlags = {
    US: `${ASSET_IMAGES}/frontweb/us.png`,
    UK: `${ASSET_IMAGES}/frontweb/uk.png`,
    CA: `${ASSET_IMAGES}/frontweb/ca.png`,
    AU: `${ASSET_IMAGES}/frontweb/au.png`,
  };

  const countryCodes = {
    US: "+1",
    UK: "+44",
    CA: "+1",
    AU: "+61",
  };

  const increaseTickets = () => {
    if (!isVipPack) {
      const newCount = ticketCount + 1;
      setTicketCount(newCount);
    }
  };

  const decreaseTickets = () => {
    if (!isVipPack && ticketCount > 1) {
      const newCount = ticketCount - 1;
      setTicketCount(newCount);
    }
  };
  // Handle reCAPTCHA change
  const handleRecaptchaChange = (token, setFieldValue) => {
    setFieldValue("recaptchaToken", token);
  };

  // Handle reCAPTCHA expiry
  const handleRecaptchaExpired = (setFieldValue) => {
    setFieldValue("recaptchaToken", "");
    toast.warning("reCAPTCHA expired. Please verify again.", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Handle reCAPTCHA error
  const handleRecaptchaError = (setFieldValue) => {
    setFieldValue("recaptchaToken", "");
    toast.error("reCAPTCHA error. Please try again.", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const proceedToPayment = (values) => {
    setFormValues(values);
    setShowPaymentOptions(true);
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);

    if (!product?.competition?._id) {
      toast.error(
        "No valid competition selected. Please select a competition first.",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
      setIsSubmitting(false);
      return;
    }

    const orderData = {
      buyerId: User?._id,
      firstName: values.firstName,
      lastName: values.lastName,
      country: values.country,
      zipCode: values.zipCode,
      address: values.address,
      city: values.town,
      phone: values.phone,
      email: values.email,
      competitionId: product.competition._id,
      competitionTitle: product.competition.title || "Competition",
      selectedImage:
        product.selectedImage || `${ASSET_IMAGES}/frontweb/heading1.png`,
      isVipPack: isVipPack,
      ticketQuantity: isVipPack
        ? product.packDetails.tickets
        : product.quantity || ticketCount,
      vipPackDetails: product.packDetails || null,
      ticketPrice: ticketPrice,
      totalCost: totalCost,
      paymentMethod: selectedPaymentMethod,
      recaptchaToken: values.recaptchaToken,
    };

    postRequest(
      "/createOrder",
      orderData,
      (response) => {
        console.log("Order created successfully:", response.data);
        toast.success("Order placed successfully!", {
          position: "top-right",
          autoClose: 5000,
          icon: <CheckCircle className="text-green-500" />,
        });

        const orderId = response.data.data._id;
        setComfirmationDetails({ ...orderData, orderId });

        postRequest(
          "/completeOrder",
          { orderId },
          (completeResponse) => {
            console.log("Order completed successfully:", completeResponse.data);
          },
          (completeError) => {
            console.error(
              "Error completing order:",
              completeError.response?.data || completeError.message
            );
          }
        );

        resetForm();
        setTicketCount(1);
        setShowPaymentOptions(false);
        setSelectedPaymentMethod("");
        // Reset reCAPTCHA
        if (recaptchaRef) {
          recaptchaRef.reset();
        }
        if (setProduct) {
          const resetProduct = {
            ...product,
            quantity: 1,
            totalCost: product.ticketPrice,
          };
          setProduct(resetProduct);
        }
        setIsSubmitting(false);
      },
      (error) => {
        console.error(
          "Error creating order:",
          error.response?.data || error.message
        );

        // Check if error is related to reCAPTCHA
        if (
          error.response?.data?.message?.includes("reCAPTCHA") ||
          error.response?.data?.message?.includes("verification")
        ) {
          toast.error("reCAPTCHA verification failed. Please try again.", {
            position: "top-right",
            autoClose: 5000,
          });
          // Reset reCAPTCHA on verification failure
          if (recaptchaRef) {
            recaptchaRef.reset();
          }
        } else {
          toast.error(
            `Order failed: ${error.response?.data?.message || "Please try again later"}`,
            {
              position: "top-right",
              autoClose: 5000,
              icon: <AlertCircle className="text-red-500" />,
            }
          );
        }
        setIsSubmitting(false);
      }
    );
  };

  const finalizeOrder = () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (formValues) {
      handleComplete();
      handleSubmit(formValues, {
        setSubmitting: () => {},
        resetForm: () => {},
      });
    }
  };

  const handleComplete = () => {
    if (!User) {
      navigate("/auth/login");
    } else {
      setShowConfirmation(true);
    }
  };

  if (showConfirmation) {
    return <OrderConfirmation orderDetails={comfirmationDetails} />;
  }

  return (
    <div className="w-full bg-white">
      <Navbar />
      <ToastContainer />

      {!product?.competition?._id && (
        <div className="max-w-[1340px] mx-auto px-4 mt-20 bg-yellow-100 border-l-4 border-yellow-500 p-4 text-yellow-700">
          <p className="font-bold">Warning: No competition selected</p>
          <p>
            Please select a valid competition before proceeding with checkout.
          </p>
        </div>
      )}

      {!showPaymentOptions ? (
        <Formik
          key={formKey}
          initialValues={formInitialValues}
          validationSchema={checkoutSchema}
          onSubmit={proceedToPayment}
          enableReinitialize={true}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form className="flex flex-col md:flex-row gap-8 pt-[14%] md:pt-[4%] px-4 max-w-[1340px] mx-auto">
              <div className="flex-1 my-auto">
                <div className="mb-8">
                  <div className="flex flex-col md:flex-row gap-6 mb-4">
                    <h2 className="text-2xl font-bold text-[#1d1b1c]">
                      BILLING INFORMATION
                    </h2>
                    {!User && (
                      <div className="text-sm text-[#89899C] my-auto">
                        Already have an account?{" "}
                        <a
                          href="/auth/login"
                          className="font-bold text-[#1d1b1c]"
                        >
                          Connect now
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block font-medium text-sm text-[#1D1B1C] mb-1"
                      >
                        FIRST NAME
                      </label>
                      <Field
                        type="text"
                        name="firstName"
                        className={`w-full border ${
                          errors.firstName && touched.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                        } p-3 rounded`}
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block font-medium text-sm text-[#1D1B1C] mb-1"
                      >
                        LAST NAME
                      </label>
                      <Field
                        type="text"
                        name="lastName"
                        className={`w-full border ${
                          errors.lastName && touched.lastName
                            ? "border-red-500"
                            : "border-gray-300"
                        } p-3 rounded`}
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="country"
                        className="block font-medium text-sm text-[#1D1B1C] mb-1"
                      >
                        COUNTRY/REGION
                      </label>
                      <Field
                        type="text"
                        name="country"
                        className={`w-full border ${
                          errors.country && touched.country
                            ? "border-red-500"
                            : "border-gray-300"
                        } p-3 rounded appearance-none`}
                        onChange={(e) => {
                          setCountry(e.target.value);
                          setFieldValue("country", e.target.value);
                        }}
                        placeholder="Enter country"
                      />

                      <ErrorMessage
                        name="country"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="zipCode"
                        className="block font-medium text-sm text-[#1D1B1C] mb-1"
                      >
                        ZIP CODE
                      </label>
                      <Field
                        type="text"
                        name="zipCode"
                        className={`w-full border ${
                          errors.zipCode && touched.zipCode
                            ? "border-red-500"
                            : "border-gray-300"
                        } p-3 rounded`}
                      />
                      <ErrorMessage
                        name="zipCode"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="block font-medium text-sm text-[#1D1B1C] mb-1"
                      >
                        ADDRESS
                      </label>
                      <Field
                        type="text"
                        name="address"
                        placeholder="house number & street name"
                        className={`w-full border ${
                          errors.address && touched.address
                            ? "border-red-500"
                            : "border-gray-300"
                        } p-3 rounded`}
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="town"
                        className="block font-medium text-sm text-[#1D1B1C] mb-1"
                      >
                        TOWN/CITY
                      </label>
                      <Field
                        type="text"
                        name="town"
                        className={`w-full border ${
                          errors.town && touched.town
                            ? "border-red-500"
                            : "border-gray-300"
                        } p-3 rounded`}
                      />
                      <ErrorMessage
                        name="town"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block font-medium text-sm text-[#1D1B1C] mb-1"
                      >
                        PHONE<span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        <Field
                          type="tel"
                          name="phone"
                          className={`w-full border ${
                            errors.phone && touched.phone
                              ? "border-red-500"
                              : "border-gray-300"
                          } p-3 rounded-r`}
                        />
                      </div>
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block font-medium text-sm text-[#1D1B1C] mb-1"
                      >
                        EMAIL
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className={`w-full border ${
                          errors.email && touched.email
                            ? "border-red-500"
                            : "border-gray-300"
                        } p-3 rounded`}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                      <div className="text-sm text-[#898989] font-medium mt-1">
                        A confirmation email will be sent after checkout.
                      </div>
                    </div>
                  </div>

                  {/* reCAPTCHA Component */}
                  <div className="mt-6">
                    <label className="block font-medium text-sm text-[#1D1B1C] mb-2">
                      SECURITY VERIFICATION
                    </label>
                    <ReCAPTCHA
                      ref={(ref) => setRecaptchaRef(ref)}
                      sitekey={RECAPTCHA_SITE_KEY}
                      onChange={(token) =>
                        handleRecaptchaChange(token, setFieldValue)
                      }
                      onExpired={() => handleRecaptchaExpired(setFieldValue)}
                      onError={() => handleRecaptchaError(setFieldValue)}
                      theme="light"
                      size="normal"
                    />
                    <ErrorMessage
                      name="recaptchaToken"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full md:w-96">
                <div className="bg-white p-4">
                  <h2 className="text-2xl font-bold text-center text-[#1D1B1C] mb-6">
                    ORDER SUMMARY
                  </h2>
                  <div className="flex items-center mb-6">
                    <div className="w-full aspect-[16/9] mr-2">
                      <img
                        src={
                          `${MEDIA_BASE_URL}/${product?.selectedImage}` ||
                          `${ASSET_IMAGES}/frontweb/heading1.png`
                        }
                        alt="Competition Item"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="w-[90%]">
                      <h3 className="font-bold text-[#1d1b1c] text-base">
                        {product?.competition?.title ||
                          "Please select a competition"}
                      </h3>
                      <div className="flex items-center mt-2">
                        {isVipPack ? (
                          <div className="flex flex-col">
                            <span className="text-[#898989] text-base font-semibold">
                              VIP PACK: {product.packDetails.tickets} TICKETS
                            </span>
                            <span className="text-green-600 text-sm">
                              {product.packDetails.discount}% DISCOUNT
                            </span>
                            <span className="text-blue-600 text-sm">
                              {product.packDetails.chance} WINNING CHANCE
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className="mr-2 text-[#898989] text-base font-semibold">
                              {ticketCount} TICKETS
                            </span>
                            <button
                              type="button"
                              onClick={decreaseTickets}
                              className="px-1 border border-gray-300 rounded-l-2xl bg-[#F5F5F5] flex items-center justify-center"
                            >
                              <Minus size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={increaseTickets}
                              className="px-1 border border-gray-300 rounded-r-2xl bg-[#F5F5F5] flex items-center justify-center"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t-2 border-b-2 border-[#EBEDF0] py-2 mb-4">
                    <span className="text-xl font-medium text-[#1d1b1c]">
                      total :
                    </span>
                    <span className="text-2xl text-[#1d1b1c] font-bold">
                      £{totalCost}
                    </span>
                  </div>

                  <i className="text-sm text-[#898989] mb-4 font-semibold">
                    By entering this competition, you confirm you are 18 or
                    older. Age verification may be required if you win, and
                    providing false information about your age will void any
                    prize claims.
                  </i>

                  <div className="mb-4">
                    <label className="flex items-start">
                      <Field
                        type="checkbox"
                        name="termsAccepted"
                        className="mt-1 mr-2 text-[#898989] font-medium text-sm"
                      />
                      <span>
                        I confirm that I am at least 18 years old, and I have
                        read and agree to the{" "}
                        <a
                          href="#"
                          className="font-medium text-[#898989] text-sm"
                        >
                          terms & conditions
                        </a>
                        , including the{" "}
                        <a
                          href="#"
                          className="font-medium text-[#898989] text-sm"
                        >
                          non-refundable ticket policy
                        </a>
                      </span>
                    </label>
                    <ErrorMessage
                      name="termsAccepted"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="flex items-start">
                      <Field
                        type="checkbox"
                        name="emailUpdates"
                        className="mt-1 mr-2 font-medium text-[#898989] text-sm"
                      />
                      <span>I agree to receive email updates & news.</span>
                    </label>
                  </div>

                  <button
                    type={User ? "submit" : "button"}
                    disabled={
                      isSubmitting ||
                      !product?.competition?._id ||
                      !values.recaptchaToken
                    }
                    className={`w-full p-2 rounded flex items-center font-bold text-xl justify-center ${
                      isSubmitting ||
                      !product?.competition?._id ||
                      !values.recaptchaToken
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary hover:bg-hover text-white"
                    }`}
                  >
                    {isSubmitting
                      ? "Processing..."
                      : !product?.competition?._id
                        ? "Please select a competition"
                        : !values.recaptchaToken
                          ? "Complete reCAPTCHA verification"
                          : "Proceed to Payment"}
                    <ChevronRight className="ml-2" />
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 pt-[14%] md:pt-[4%] px-4 max-w-[1340px] mx-auto">
          <div className="flex-1 my-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#1d1b1c] mb-6">
                PAYMENT OPTIONS
              </h2>
              <div className="space-y-4">
                {/* PayPal Option */}
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                    selectedPaymentMethod === "paypal"
                      ? "border-[#114F33] bg-[#f0f8f4]"
                      : "border-gray-300 hover:border-[#114F33]"
                  }`}
                  onClick={() => setSelectedPaymentMethod("paypal")}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedPaymentMethod === "paypal"
                          ? "border-[#114F33] bg-[#114F33]"
                          : "border-gray-300"
                      }`}
                    ></div>
                    <div className="flex-1 flex items-center">
                      <img
                        src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png"
                        alt="PayPal"
                        className="h-6 mr-2"
                      />
                      <span className="font-semibold">PayPal</span>
                    </div>
                  </div>
                  {selectedPaymentMethod === "paypal" && (
                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        You will be redirected to PayPal to complete your
                        payment securely.
                      </p>
                      <p className="mt-2">
                        Total amount:{" "}
                        <span className="font-bold">£{totalCost}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Wallet Option */}
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                    selectedPaymentMethod === "wallet"
                      ? "border-[#114F33] bg-[#f0f8f4]"
                      : "border-gray-300 hover:border-[#114F33]"
                  }`}
                  onClick={() => setSelectedPaymentMethod("wallet")}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedPaymentMethod === "wallet"
                          ? "border-[#114F33] bg-[#114F33]"
                          : "border-gray-300"
                      }`}
                    ></div>
                    <div className="flex-1 flex items-center">
                      <Wallet className="mr-2 text-[#114F33]" size={20} />
                      <span className="font-semibold">Personal Wallet</span>
                    </div>
                  </div>
                  {selectedPaymentMethod === "wallet" && (
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Pay using your personal wallet balance.</p>
                      <div className="flex justify-between mt-2 border-b pb-2">
                        <span>Available Balances:</span>
                        <div className="flex flex-col items-end">
                          <div className="flex gap-2">
                            <span>Wallet:</span>
                            <span className="font-bold">
                              £{User?.walletBalance?.toFixed(2) || "0.00"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <span>Withdrawable Commission:</span>
                            <span className="font-bold">
                              £
                              {User?.commissionWithdrawable?.toFixed(2) ||
                                "0.00"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <span>Locked Commission:</span>
                            <span className="font-bold">
                              £{User?.commissionLocked?.toFixed(2) || "0.00"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-3 font-medium">
                        <span>Total Available Balance:</span>
                        <span className="font-bold">
                          £{(User?.walletBalance || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between mt-2 border-t pt-2">
                        <span>Amount to Pay:</span>
                        <span className="font-bold">£{totalCost}</span>
                      </div>
                      {(User?.walletBalance || 0) < totalCost && (
                        <p className="text-red-500 mt-2">
                          Insufficient balance. Please add funds to your wallet
                          or choose another payment method.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-96">
            <div className="bg-white p-4 border rounded-lg">
              <h2 className="text-2xl font-bold text-center text-[#1D1B1C] mb-6">
                ORDER SUMMARY
              </h2>
              <div className="flex items-center mb-6">
                <div className="w-full aspect-[16/9] mr-2">
                  <img
                    src={
                      `${MEDIA_BASE_URL}/${product?.selectedImage}` ||
                      `${ASSET_IMAGES}/frontweb/heading1.png`
                    }
                    alt="Competition Item"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="w-[90%]">
                  <h3 className="font-bold text-[#1d1b1c] text-base">
                    {product?.competition?.title ||
                      "Please select a competition"}
                  </h3>
                  <div className="mt-2">
                    {isVipPack ? (
                      <div className="flex flex-col">
                        <span className="text-[#898989] text-base font-semibold">
                          VIP PACK: {product.packDetails.tickets} TICKETS
                        </span>
                        <span className="text-green-600 text-sm">
                          {product.packDetails.discount}% DISCOUNT
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#898989] text-base font-semibold">
                        {ticketCount} TICKETS
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-b border-[#EBEDF0] py-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>£{totalCost}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>£0.00</span>
                </div>
                <div className="flex justify-between font-bold mt-2 pt-2 border-t border-dotted border-gray-200">
                  <span className="text-xl">Total:</span>
                  <span className="text-2xl text-[#114F33]">£{totalCost}</span>
                </div>
              </div>

              <div className="mb-6 text-sm">
                <h4 className="font-bold mb-2">Billing Details:</h4>
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {formValues?.firstName} {formValues?.lastName}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {formValues?.email}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {formValues?.address}, {formValues?.town},{" "}
                  {formValues?.zipCode}, {formValues?.country}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentOptions(false)}
                  className="flex-1 p-2 rounded bg-gray-200 text-gray-800 font-medium"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={finalizeOrder}
                  disabled={
                    isSubmitting ||
                    !selectedPaymentMethod ||
                    (selectedPaymentMethod === "wallet" &&
                      (User?.walletBalance || 0) < totalCost)
                  }
                  className={`flex-1 p-2 rounded flex items-center font-bold justify-center ${
                    isSubmitting ||
                    !selectedPaymentMethod ||
                    (selectedPaymentMethod === "wallet" &&
                      (User?.commissionEarned + User?.commissionLocked || 0) <
                        totalCost)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-hover text-white"
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Order Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-[#1B1B1B]">
        <Footer />
      </div>
    </div>
  );
};

export default Checkout;
