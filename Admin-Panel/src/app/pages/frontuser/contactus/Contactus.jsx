import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import Footer from "@app/components/Footer/Footer";
import Navbar from "@app/components/Navbar/Navbar";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Contactus() {
  window.scrollTo(0, 0);
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      message: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
      message: Yup.string().required("Message is required"),
    }),
    onSubmit: (values) => {
      console.log("Form values:", values);
      alert("Message sent successfully!");
    },
  });

  return (
    <div className="w-full">
      <Navbar />
      <div className="flex flex-col md:flex-row max-w-[1340px] mx-auto px-2 mt-24">
        <div className="md:w-1/2 w-full flex items-center justify-center p-2">
          <img
            src={`${ASSET_IMAGES}/contactform.png`}
            alt="left-arrow.png"
            className="w-full object-cover"
          />
        </div>

        <div className="md:w-1/2 w-full p-8">
          <p className=" font-nunito text-center md:text-left font-bold text-2xl md:text-5xl text-[#1D1B1C]">
            Contact us
          </p>
          <p className="mb-6 font-nunito  text-gray-600">
            Have a question or comment? Drop us a message!
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-nunito  font-semibold">Full Name *</label>
              <input
                type="text"
                name="fullName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullName}
                className="w-full border-b bg-transparent focus:outline-none focus:ring-0 border-gray-500 p-2"
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <div className="text-red-500 text-sm">
                  {formik.errors.fullName}
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <label className="block mb-1 font-nunito  font-semibold">Email *</label>
                <input
                  type="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="w-full border-b bg-transparent focus:outline-none focus:ring-0 border-gray-500 p-2"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              <div className="w-full">
                <label className="block mb-1 font-nunito  font-semibold">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  className="w-full border-b bg-transparent focus:outline-none focus:ring-0 border-gray-500 p-2"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.phone}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-1 font-nunito  font-semibold">Message *</label>
              <textarea
                name="message"
                rows="4"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.message}
                className="w-full border-b bg-transparent focus:outline-none focus:ring-0 border-gray-500 p-2"
              ></textarea>
              {formik.touched.message && formik.errors.message && (
                <div className="text-red-500 text-sm">
                  {formik.errors.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-primary text-white py-2 px-6 rounded font-nunito font-semibold"
            >
              Send Your Message
            </button>
          </form>
        </div>
      </div>
      <div className="bg-[#1B1B1B]">
        <Footer />
      </div>
    </div>
  );
}
