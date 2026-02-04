import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import React, { useState } from "react";

// FAQ data
const faqItems = [
  {
    id: 1,
    question: "How and when are the winners selected?",
    answer:
      "Winners are selected through a random drawing process conducted by our panel of judges. The selection typically takes place within 14 days after the contest closing date. All eligible entries are assigned a unique identifier and the winners are chosen using a random number generator to ensure fairness and transparency.",
  },
  {
    id: 2,
    question: "Can I see the draw live?",
    answer:
      "Yes, the course includes collaborative projects to simulate real-world design scenarios. This fosters teamwork and provides valuable experience for participants in handling actual industry challenges.",
  },
  {
    id: 3,
    question: "How will I be notified if I win?",
    answer:
      "Winners will be notified via the email address they provided during registration. We will also announce winners on our official social media channels and website. Please ensure your contact information is up to date. Winners must respond within 7 days of notification to claim their prize.",
  },
];
function Faqs() {
  const [openItemId, setOpenItemId] = useState(null);

  const toggleItem = (id) => {
    setOpenItemId((prevId) => (prevId === id ? null : id));
  };
  return (
    <div className="flex flex-col my-10 px-4 md:px-0">
      <div className="w-full text-center">
        <div className="flex gap-1 flex-row justify-center">
          {/* <img
            src={`${ASSET_IMAGES}/frontweb/section-icon.png`}
            className="md:w-[2%] md:h-[2%]"
            alt="heading1"
          /> */}
          <p className="font-sans font-bold text-[18px] text-primary ">
            You Have Answeis
          </p>
        </div>
        <p className="text-4xl md:text-6xl font-bold font-nunito mb-6 text-[#000000]">
          We Have{" "}
          <span className="text-4xl md:text-6xl font-bold font-nunito text-primary">
            Answers
          </span>
        </p>
        <p className="text-center text-[#4e4e4e] text-xl font-nunito font-normal">
          Do not hesitate to send us an email if you can't find what you're
          looking for.
        </p>
      </div>
      <div className="max-w-4xl mx-auto mt-4 rounded-2xl">
        <div className="space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className={`border rounded-2xl overflow-hidden transition-all duration-700 ${
                openItemId === item.id
                  ? "bg-primary text-white"
                  : "bg-[#F4F4F4]"
              }`}
            >
              <button
                className="w-full p-5 text-left flex justify-between items-center text-xl font-arial font-bold"
                onClick={() => toggleItem(item.id)}
              >
                <span>{item.question}</span>
                <span className="text-xl">
                  {openItemId === item.id ? "−" : "+"}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-700 ease-in-out ${
                  openItemId === item.id
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-4 ">
                  <p className="text-lg font-normal font-nunito">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Faqs;