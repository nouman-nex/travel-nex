import React, { useState } from "react";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Globe,
  TrendingUp,
} from "lucide-react";
import PageHeader from "../../components/pageHeader/Pageheader";

export default function BeOurPartner() {
  const [formData, setFormData] = useState({
    agencyName: "",
    contactPerson: "",
    emailAddress: "",
    phoneNumber: "",
    address: "",
    dtsLicense: "",
    businessLicense: "",
    primaryRegion: "",
    monthlyVolume: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formFields = [
    {
      name: "agencyName",
      label: "Agency Name",
      type: "text",
      icon: Building2,
      placeholder: "Enter your agency name",
      colSpan: "md:col-span-2",
    },
    {
      name: "contactPerson",
      label: "Contact Person",
      type: "text",
      icon: User,
      placeholder: "Full name",
    },
    {
      name: "emailAddress",
      label: "Email Address",
      type: "email",
      icon: Mail,
      placeholder: "your@email.com",
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "tel",
      icon: Phone,
      placeholder: "+92 300 1234567",
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      icon: MapPin,
      placeholder: "Complete address",
    },
    {
      name: "dtsLicense",
      label: "DTS License #",
      type: "text",
      icon: FileText,
      placeholder: "DTS-XXXX-XXXX",
    },
    {
      name: "businessLicense",
      label: "Business License #",
      type: "text",
      icon: FileText,
      placeholder: "BL-XXXX-XXXX",
    },
    {
      name: "primaryRegion",
      label: "Primary Region",
      type: "select",
      icon: Globe,
      options: [
        { value: "", label: "Select region" },
        { value: "punjab", label: "Punjab" },
        { value: "sindh", label: "Sindh" },
        { value: "kpk", label: "Khyber Pakhtunkhwa" },
        { value: "balochistan", label: "Balochistan" },
        { value: "gilgit", label: "Gilgit-Baltistan" },
        { value: "azad-kashmir", label: "Azad Kashmir" },
        { value: "islamabad", label: "Islamabad" },
      ],
    },
    {
      name: "monthlyVolume",
      label: "Monthly Volume",
      type: "select",
      icon: TrendingUp,
      options: [
        { value: "", label: "Select volume" },
        { value: "0-10", label: "0-10 bookings" },
        { value: "10-25", label: "10-25 bookings" },
        { value: "25-50", label: "25-50 bookings" },
        { value: "50-100", label: "50-100 bookings" },
        { value: "100+", label: "100+ bookings" },
      ],
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("=== Partner Registration Form Submitted ===");
      console.log("Form Data:", formData);
      console.log("Timestamp:", new Date().toISOString());
      console.log("==========================================");

      alert("Thank you for your interest! We'll contact you soon.");

      setFormData({
        agencyName: "",
        contactPerson: "",
        emailAddress: "",
        phoneNumber: "",
        address: "",
        dtsLicense: "",
        businessLicense: "",
        primaryRegion: "",
        monthlyVolume: "",
      });

      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div>
      <PageHeader
        image="https://ex-coders.com/html/turmet/assets/img/breadcrumb/breadcrumb.jpg"
        title="Be Our Partner"
        breadcrumb="Partnership"
      />

      {/* Partner Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="inline-block px-4 py-2 bg-cyan-500 text-white rounded-full text-sm font-semibold mb-4">
              Join Our Network
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Become a Trusted Partner
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Partner with CFD Travels and unlock new opportunities for your
              travel business. Join our growing network of trusted agencies and
              benefit from exclusive deals, competitive commissions, and
              dedicated support.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                High Commissions
              </h3>
              <p className="text-gray-600">
                Earn competitive commissions on every booking with transparent
                pricing and timely payouts.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                <Globe className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Global Network
              </h3>
              <p className="text-gray-600">
                Access to worldwide destinations, exclusive packages, and
                premium travel services.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Dedicated Support
              </h3>
              <p className="text-gray-600">
                24/7 partner support, marketing materials, and training to help
                you succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-cyan-50 rounded-2xl shadow-2xl p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Partner Registration Form
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and our partnership team will contact
                  you within 24-48 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {formFields.map((field) => {
                    const Icon = field.icon;
                    return (
                      <div key={field.name} className={field.colSpan || ""}>
                        <label className="flex items-center text-gray-700 font-semibold mb-2">
                          <Icon className="w-5 h-5 mr-2 text-cyan-600" />
                          {field.label} *
                        </label>
                        {field.type === "select" ? (
                          <select
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors bg-white text-gray-800"
                          >
                            {field.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors text-gray-800 placeholder:text-gray-400"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="newsletter-btn theme-btn"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>

                <p className="text-sm text-gray-500 text-center pt-4">
                  By submitting this form, you agree to our Terms & Conditions
                  and Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
