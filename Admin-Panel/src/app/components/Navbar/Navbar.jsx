import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";

export default function Navbar() {
  const { User } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#1c1d20] text-white shadow-lg"
          : "bg-transparent text-white"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center">
              <img
                src={`${ASSET_IMAGES}/frontweb/logo.png`}
                className="w-24 mx-auto mt-2 cursor-pointer"
                alt="Participate Now"
              />
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-12">
              <Link
                to="/"
                className={`text-base  font-nunito font-semibold hover:text-primary ${
                  isScrolled ? "text-white" : "text-[#000000]"
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`text-base  font-nunito font-semibold hover:text-primary ${
                  isScrolled ? "text-white" : "text-[#000000]"
                }`}
              >
                About
              </Link>
              <Link
                to="/blog"
                className={`text-base  font-nunito font-semibold hover:text-primary ${
                  isScrolled ? "text-white" : "text-[#000000]"
                }`}
              >
                Blog
              </Link>
              <Link
                to="/contactus"
                className={`text-base  font-nunito font-semibold hover:text-primary ${
                  isScrolled ? "text-white" : "text-[#000000]"
                }`}
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <Link
              to={
                User
                  ? User.roles?.includes("Admin")
                    ? "/dashboard/addCompetition"
                    : "/dashboard"
                  : "/auth/login"
              }
            >
              <div className="flex flex-row ">
                <p
                  className={`bg-transparent ${
                    isScrolled ? "text-white" : "text-[#000000]"
                  } border cursor-pointer border-primary hover:bg-hover hover:text-white text-lg border-solid font-nunito px-4 py-1 rounded-3xl font-bold`}
                >
                  {User ? "Dashboard" : "Login"}
                </p>

                {/* <div className="mr-1 bg-[#AEFE3A] h-7 cursor-pointer rounded-full">
                <img
                   src={`${ASSET_IMAGES}/frontweb/participatenow.png`}
                  className="w-7 mt-1 h-6"
                  alt="Participate Now"
                />
              </div> */}
              </div>
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center ${
                isScrolled ? "text-white" : "text-[#1c1d20]"
              }  p-2 rounded-md hover:bg-[#1c1d20] focus:outline-none`}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-[#1c1d20] pb-3">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block text-base  font-nunito font-semibold hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block text-base  font-nunito font-semibold hover:text-primary"
            >
              About
            </Link>
            <Link
              to="/blog"
              className="block text-base  font-nunito font-semibold hover:text-primary"
            >
              Blog
            </Link>
            <Link
              to="/contactus"
              className="block text-base  font-nunito font-semibold hover:text-primary"
            >
              Contact
            </Link>
            <div className="flex flex-row pt-4">
              <Link to={`${User ? "/dashboard" : "/auth/login"}`}>
                <div className="flex flex-row ">
                  <p
                    className={`bg-transparent ${
                      isScrolled ? "text-white" : "text-[#000000]"
                    } border cursor-pointer border-primary hover:bg-hover hover:text-white text-lg border-solid font-nunito px-4 py-1 rounded-3xl font-bold`}
                  >
                    {User ? "Dashboard" : "Login"}
                  </p>

                  {/* <div className="mr-1 bg-[#AEFE3A] h-7 cursor-pointer rounded-full">
                <img
                   src={`${ASSET_IMAGES}/frontweb/participatenow.png`}
                  className="w-7 mt-1 h-6"
                  alt="Participate Now"
                />
              </div> */}
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
