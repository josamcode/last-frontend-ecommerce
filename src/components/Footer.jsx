// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "../utils/Toast";
import axios from "axios";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import Cookies from "js-cookie";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Logo & Brand */}
        <div>
          <h1 className="text-white text-3xl font-bold mb-4">JOSAM</h1>
          <p className="text-sm leading-relaxed mb-4">
            Premium fashion crafted with care. Discover quality menswear and timeless styles designed to elevate your everyday look.
          </p>

          <div className="flex space-x-4 mt-4">
            <a
              href="https://www.facebook.com/gobasha.samuil"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition text-xl"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/gerges_s_gabra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition text-xl"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="text-gray-400 cursor-not-allowed pointer-events-none transition text-xl"
              aria-disabled="true"
            >
              <FaTwitter />
            </a>

          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-white transition duration-200">
                About Us
              </Link>
            </li>
            {/* <li>
              <Link to="/blog" className="hover:text-white transition duration-200">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/careers" className="hover:text-white transition duration-200">
                Careers
              </Link>
            </li> */}
            <li>
              <Link to="/contact" className="hover:text-white transition duration-200">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/help-center" className="hover:text-white transition duration-200">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:text-white transition duration-200">
                Shipping Info
              </Link>
            </li>
            <li>
              <Link to="/return-policy" className="hover:text-white transition duration-200">
                Return Policy
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-white transition duration-200">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="hover:text-white transition duration-200">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Stay Updated</h3>
          <p className="text-sm mb-4">
            Be the first to know about new arrivals, exclusive offers, and style tips.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const email = e.target.email.value;
              try {
                const token = Cookies.get("token");
                const res = await axios.post(
                  `${process.env.REACT_APP_API_URL}/subscribers`,
                  { email },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                showSuccess("Subscribed successfully!");
                e.target.reset();
              } catch (err) {
                const message = err?.response?.data?.message || "Something went wrong!";
                showError(message);
              }
            }}
          >
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 text-sm rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium transition"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-800 pt-6 text-sm text-center text-gray-400">
        <div className="max-w-7xl mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} JOSAM. All rights reserved.</p>
          <p className="mt-2 text-xs">
            Developed by <span className="text-primary">Gerges Samuel</span> •
            A full-stack e-commerce solution built with ❤️ using MERN stack
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;