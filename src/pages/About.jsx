// src/pages/About.js
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "../utils/Toast";
import Cookies from "js-cookie";

const About = () => {
    return (
        <main className="bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-24 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3730A3" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                        We Are <span className="text-primary">JOSAM</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                        Premium menswear designed for comfort, style, and confidence.
                        Founded with a passion for quality craftsmanship and timeless fashion.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                        <Link
                            to="/shop"
                            className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
                        >
                            Shop Collection
                        </Link>
                        <Link
                            to="/contact"
                            className="px-8 py-3 border border-primary text-primary rounded-xl hover:bg-indigo-50 transition"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                        <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                            JOSAM was born in 2025 with a simple mission: to deliver high-quality, stylish menswear at accessible prices.
                        </p>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Founded by <strong>Gerges Samuel</strong>, our journey began in Cairo with a small collection of hoodies and shirts.
                            Today, we serve thousands of customers across Egypt and beyond — all thanks to your trust and support.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Every piece is carefully designed, tested, and produced to ensure it meets our standards of comfort, durability, and elegance.
                        </p>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-xl transform rotate-1 hover:rotate-0 transition duration-300">
                        <img
                            src="/images/about-story.jpg"
                            alt="JOSAM Studio"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        These principles guide everything we do — from design to delivery.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    {[
                        {
                            title: "Quality First",
                            description:
                                "We believe in creating clothes that last — made from premium fabrics and built to withstand time and trends.",
                            icon: (
                                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            ),
                        },
                        {
                            title: "Customer Focus",
                            description:
                                "You come first. From easy returns to responsive support, we're here to make your shopping experience seamless.",
                            icon: (
                                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            ),
                        },
                        {
                            title: "Sustainable Style",
                            description:
                                "We’re committed to ethical sourcing, minimal waste, and eco-conscious packaging — because fashion should respect the planet.",
                            icon: (
                                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            ),
                        },
                    ].map((value, i) => (
                        <div
                            key={i}
                            className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center hover:shadow-lg transition group"
                        >
                            <div className="mb-5 inline-block text-primary">{value.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{value.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team / Founder */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900">Meet the Founder</h2>
                    <p className="text-gray-600 mt-4">
                        Passionate about design, driven by purpose.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-12 max-w-4xl mx-auto">
                    <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg border-4 border-gray-100">
                        <img
                            src="/images/founder.jpg"
                            alt="Gerges Samuel - Founder of JOSAM"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold text-gray-900">Gerges Samuel</h3>
                        <p className="text-primary font-medium mb-3">Founder & Lead Designer</p>
                        <p className="text-gray-600 leading-relaxed max-w-xl">
                            “I started JOSAM because I wanted clothes that looked good, felt great,
                            and didn’t cost a fortune. What began as a personal project has grown into a community
                            of people who value style without compromise.”
                        </p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-6 bg-gradient-to-r from-primary to-indigo-700 text-white text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">Join the JOSAM Movement</h2>
                    <p className="text-lg opacity-90 mb-10">
                        Be the first to know about new arrivals, exclusive offers, and behind-the-scenes stories.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto"
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
                        }}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="flex-1 px-5 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                            required
                        />
                        <button
                            type="submit"
                            className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>

            {/* Footer Note */}
            {/* <div className="text-center py-10 text-gray-500 text-sm border-t border-gray-100 bg-gray-50">
                <p>© {new Date().getFullYear()} JOSAM. Crafted with ❤️ in Egypt.</p>
            </div> */}
        </main>
    );
};

export default About;