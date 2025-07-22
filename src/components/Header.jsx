import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCartIcon, HeartIcon, BellIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { showSuccess } from "../utils/Toast";
import Swal from 'sweetalert2';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHome = location.pathname === "/" || location.pathname === "/home";

  const token = Cookies.get("token");

  // Check login status
  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  // Fetch cart and wishlist counts
  const fetchCounts = async () => {
    if (!token) return;

    try {
      const [cartRes, wishlistRes, myMessagesRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/message-to-user/my`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCartCount(cartRes.data.cart?.items?.length || 0);
      setWishlistCount(wishlistRes.data.wishlist?.items?.length || 0);
      setMessagesCount(
        myMessagesRes.data.messages?.filter((msg) => msg.isRead === false).length || 0
      );
    } catch (error) {
      console.error("Failed to fetch counts:", error);
      setCartCount(0);
      setWishlistCount(0);
      setMessagesCount(0);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCounts();
    } else {
      setCartCount(0);
      setWishlistCount(0);
      setMessagesCount(0);
    }
  }, [isLoggedIn]);

  // Listen for custom events to refresh counts after add/remove
  useEffect(() => {
    const handleUpdate = () => {
      if (isLoggedIn) {
        fetchCounts();
      }
    };

    window.addEventListener("cartUpdated", handleUpdate);
    window.addEventListener("wishlistUpdated", handleUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleUpdate);
      window.removeEventListener("wishlistUpdated", handleUpdate);
    };
  }, [isLoggedIn]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4F46E5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log me out'
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("token");
        setIsLoggedIn(false);
        setMobileMenuOpen(false);
        setCartCount(0);
        setWishlistCount(0);
        showSuccess("Logged out successfully!");
        window.location.reload();
      }
    });
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Scroll listener
  useEffect(() => {
    function onScroll() {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed w-full top-0 left-0 z-50 transition-colors duration-700 ease-in-out ${isHome && !scrolled ? "bg-transparent" : "bg-white shadow-md"
        }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className={`font-extrabold text-3xl select-none cursor-pointer transition-colors duration-300 ${isHome && !scrolled ? "text-white" : "text-primary"
            }`}
        >
          JOSAM
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {!isLoggedIn ? (
            <>
              <a
                href="/login"
                className={`font-semibold transition ${isHome && !scrolled
                  ? "text-white hover:text-indigo-300"
                  : "text-gray-700 hover:text-primary"
                  }`}
              >
                Login
              </a>
              <a
                href="/register"
                className={`px-4 py-2 rounded-md font-semibold transition ${isHome && !scrolled
                  ? "bg-white bg-opacity-20 text-white hover:bg-opacity-40"
                  : "bg-primary text-white hover:bg-indigo-700"
                  }`}
              >
                Register
              </a>
            </>
          ) : (
            <>
              <Link
                to="/my-messages"
                className={`relative transition-transform hover:scale-110 ${isHome && !scrolled ? "text-white" : "text-gray-800"
                  }`}
                aria-label="Messages"
              >
                <BellIcon className="w-6 h-6" />
                {messagesCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                    {messagesCount}
                  </span>
                )}
              </Link>

              {/* Wishlist Icon with Count */}
              <Link
                to="/wishlist"
                className={`relative transition-transform hover:scale-110 ${isHome && !scrolled ? "text-white" : "text-gray-800"
                  }`}
                aria-label="Wishlist"
              >
                <HeartIcon className="w-6 h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon with Count */}
              <Link
                to="/cart"
                className={`relative transition-transform hover:scale-110 ${isHome && !scrolled ? "text-white" : "text-gray-800"
                  }`}
                aria-label="Cart"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center space-x-2 focus:outline-none transition-colors duration-300 ${isHome && !scrolled
                    ? "text-white hover:text-indigo-300"
                    : "text-gray-800 hover:text-primary"
                    }`}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <span className="font-semibold cursor-pointer select-none">
                    Account
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : "rotate-0"
                      }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg origin-top transition-all duration-300 overflow-hidden z-50 bg-white ${dropdownOpen
                    ? "max-h-96 opacity-100 scale-y-100"
                    : "max-h-0 opacity-0 scale-y-0 pointer-events-none"
                    }`}
                  style={{ transformOrigin: "top" }}
                >
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </a>
                  <a
                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
                    onClick={handleLogout}
                  >
                    Logout
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <MobileMenu
          isLoggedIn={isLoggedIn}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          dropdownRef={dropdownRef}
          scrolled={scrolled}
          isHome={isHome}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          handleLogout={handleLogout}
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          messagesCount={messagesCount}
        />
      </nav>
    </header>
  );
}

// MobileMenu Component
function MobileMenu({
  isLoggedIn,
  dropdownOpen,
  setDropdownOpen,
  dropdownRef,
  scrolled,
  isHome,
  mobileMenuOpen,
  setMobileMenuOpen,
  handleLogout,
  cartCount,
  wishlistCount,
  messagesCount,
}) {
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="md:hidden relative" ref={dropdownRef}>
      <button
        aria-label="Toggle menu"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={`focus:outline-none transition-colors duration-300 ${isHome && !scrolled ? "text-white" : "text-gray-800"
          }`}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          {mobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <div
        className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg origin-top transition-all duration-300 overflow-hidden z-50 bg-white ${mobileMenuOpen
          ? "max-h-screen opacity-100 scale-y-100"
          : "max-h-0 opacity-0 scale-y-0 pointer-events-none"
          }`}
        style={{ transformOrigin: "top" }}
      >
        {!isLoggedIn ? (
          <>
            <a
              href="/login"
              className="block px-4 py-3 border-b text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </a>
            <a
              href="/register"
              className="block px-4 py-3 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Register
            </a>
          </>
        ) : (
          <>
            <Link
              to="/profile"
              className="block px-4 py-3 border-b text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/wishlist"
              className="flex justify-between px-4 py-3 border-b text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="flex justify-between px-4 py-3 border-b text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/my-messages"
              className="flex justify-between px-4 py-3 border-b text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>My Messages</span>
              {messagesCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                  {messagesCount}
                </span>
              )}
            </Link>
            <a
              className="block px-4 py-3 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
              onClick={handleLogout}
            >
              Logout
            </a>
          </>
        )}
      </div>
    </div>
  );
}