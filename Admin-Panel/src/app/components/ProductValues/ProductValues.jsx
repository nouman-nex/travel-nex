import React from "react";

export default function ProductValues() {
  return (
    <div className="mx-2">
      <div className="w-full max-w-7xl mx-auto product-value-bg text-white p-6 mb-10 font-sans">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">
            WATCH &amp; COMPETITION INFORMATIONS
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1 */}
            <div>
              <div className="mb-5">
                <p className="text-[#b8b8b8] font-normal text-sm mb-1">BRAND</p>
                <p className="text-white font-bold text-base ">AQUANAUT</p>
              </div>

              <div className="mb-5">
                <p className="text-[#b8b8b8] font-normal text-sm mb-1">MODEL</p>
                <p className="text-white font-bold text-base">£44,000</p>
              </div>

              <div className="mb-5">
                <p className="text-[#b8b8b8] font-normal text-sm mb-1">
                  REFERENCE NUMBER
                </p>
                <p className="text-white font-bold text-base">AQUANAUT</p>
              </div>

              <div className="mb-5">
                <p className="text-[#b8b8b8] font-normal text-sm mb-1">
                  MOVEMENT
                </p>
                <p className="text-white font-bold text-base">
                  REMONTAGE AUTOMATIQUE
                </p>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <div className="mb-5">
                <p className="text-[#b8b8b8] font-normal text-sm mb-1">YEAR</p>
                <p className="text-white font-bold text-base">2018</p>
              </div>

              <div className="mb-5">
                <p className="text-[#b8b8b8] font-normal text-sm mb-1">
                  CALIBER
                </p>
                <p className="text-white font-bold text-base">324</p>
              </div>

              <div className="mb-5">
                <p className="text-[#b8b8b8] font-normal text-sm mb-1">GLASS</p>
                <p className="text-white font-bold text-base">VERRE SAPHIRE</p>
              </div>

              <div className="mb-5">
                <p className="text-[#b8b8b8] font-normal text-sm mb-1">
                  BEZEL MATERIAL
                </p>
                <p className="text-white font-bold text-base">ACIER</p>
              </div>

              <div className="mb-5">
                <p className="text-[#b8b8b8] font-normal text-sm mb-1">
                  BRACELET MATERIAL
                </p>
                <p className="text-white font-bold text-base">CAOUTCHOUC</p>
              </div>
            </div>

            {/* Column 3 */}
            <div>
              <div className="mb-5">
                <p className="text-[#b8b8b8] font-normal text-sm mb-1">
                  PAPERS
                </p>
                <p className="text-white font-bold text-base">
                  THIS PRODUCT COMES WITH FULL PAPERWORK, A NEW DIGITAL WARRANTY
                  CARD AND IS FULLY BOXED
                </p>
              </div>

              <div className="mb-5">
                <p className="text-[#b8b8b8] font-normal text-sm mb-1">
                  MAXIMUM ENTRIES
                </p>
                <p className="text-white font-bold text-base">999</p>
              </div>

              <div className="mb-5">
                <p className="text-[#b8b8b8] font-normal text-sm mb-1">
                  MAXIMUM WATCH WINNERS :
                </p>
                <p className="text-white font-bold text-base">1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
