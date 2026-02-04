import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="max-w-[1440px] pt-20 px-4 mx-auto pb-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        height="15"
        viewBox="0 0 50 15"
        width="50"
        className="mx-auto"
      >
        <path
          d="m45.2196 11.8567c0-.3216-.2588-.5848-.5751-.5848h-13.3707c.248-.4276.4529-.8845.611-1.36327.0216 0 .0432.00731.0683.00731h17.4718c.3163 0 .5751-.26316.5751-.5848s-.2588-.58479-.5751-.58479h-17.2525c.0683-.40571.1114-.82237.1114-1.24635 0-.1133-.0108-.22295-.018-.33626h17.1591c.3163 0 .5751-.26316.5751-.58479 0-.32164-.2588-.5848-.5751-.5848h-17.292c-.1115-.56286-.2948-1.09649-.5212-1.60819h13.0328c.3163 0 .5751-.26315.5751-.58479s-.2588-.5848-.5751-.5848h-13.687c-1.3335-1.94444-3.5439-3.21637-6.0492-3.21637-2.5052 0-4.7156 1.27558-6.0491 3.21637h-13.50013c-.3163 0-.57509.26316-.57509.5848s.25879.58479.57509.58479h12.84233c-.1941.43129-.3486.88451-.46 1.356h-17.166316c-.316297 0-.575084.26316-.575084.58479 0 .32164.258787.5848.575084.5848h16.983016c-.0144.19371-.0288.38743-.0288.58845 0 .33626.0288.66886.0719.99415h-17.026116c-.316297 0-.575084.26316-.575084.5848s.258787.58479.575084.58479h17.266916c.1689.56656.4026 1.10376.6937 1.60816h-13.18022c-.3163 0-.57509.2632-.57509.5848 0 .3217.25879.5848.57509.5848h14.01052c1.3514 1.5643 3.3283 2.5585 5.5388 2.5585 2.2104 0 4.1873-.9942 5.5387-2.5585h14.201c.3163 0 .5751-.2631.5751-.5848zm-20.3148 2.0322c-3.4685 0-6.2828-2.8619-6.2828-6.3889 0-3.52705 2.8143-6.38889 6.2828-6.38889 3.4684 0 6.2828 2.86184 6.2828 6.38889 0 3.527-2.8144 6.3889-6.2828 6.3889z"
          fill="#fff"
        />
      </svg>
      <div className="flex flex-col md:flex-row gap-4 sm:gap-10 justify-center mt-10">
        <Link to="/">
          <p className="font-bold font-nunito text-xl hover:text-primary cursor-pointer text-white">
            Home
          </p>
        </Link>
        <Link to="/winners">
        <p className="font-bold font-nunito text-xl hover:text-primary cursor-pointer text-white">
          winner
        </p>
        </Link>
        <Link to="/howtoenter">
        <p className="font-bold font-nunito text-xl hover:text-primary cursor-pointer text-white">
          How To Enter
        </p></Link>
        <Link to="/about">
        <p className="font-bold font-nunito text-xl hover:text-primary cursor-pointer text-white">
          About Us
        </p></Link>
        <Link to="/contactus">
        <p className="font-bold font-nunito text-xl hover:text-primary cursor-pointer text-white">
          Contact Us
        </p></Link>
      </div>
      <p className="font-medium text-center mt-4 font-nunito text-md text-white">
        For news, exclusive offers and beautiful watches, follow us on
        Instagram.
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="35"
        height="35"
        viewBox="0 0 24 24"
        className="mx-auto mt-6 cursor-pointer"
      >
        <defs></defs>
        <path
          fill="white"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
        ></path>
      </svg>
      <img
        src={`${ASSET_IMAGES}/frontweb/secure-payment.png`}
        className="w-32 mx-auto mt-16 cursor-pointer"
        alt="Participate Now"
      />
    </div>
  );
}

export default Footer;