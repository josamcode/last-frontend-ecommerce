// src/pages/HelpCenter.js
import React from "react";
import { Link } from "react-router-dom";

const HelpCenter = () => {
    return (
        <main className="max-w-4xl mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Help Center</h1>
            <p className="text-lg text-gray-600 mb-10">
                We're here to help. Find answers to common questions or contact support.
            </p>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">Shipping & Delivery</h2>
                    <p className="text-gray-600 mb-4">
                        Learn about delivery times, tracking, and shipping rates across Egypt.
                    </p>
                    <Link to="/shipping" className="text-primary hover:underline">
                        View Shipping Info →
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">Returns & Exchanges</h2>
                    <p className="text-gray-600 mb-4">
                        Not satisfied? Return within 14 days for a full refund.
                    </p>
                    <Link to="/return-policy" className="text-primary hover:underline">
                        Read Return Policy →
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">Payments</h2>
                    <p className="text-gray-600 mb-4">
                        We accept cash on delivery. No hidden fees or charges.
                    </p>
                    <Link to="/contact" className="text-primary hover:underline">
                        Contact Us →
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">Account & Orders</h2>
                    <p className="text-gray-600 mb-4">
                        Manage your profile, wishlist, and order history from your dashboard.
                    </p>
                    <Link to="/profile" className="text-primary hover:underline">
                        Go to Profile →
                    </Link>
                </div>
            </div>

            <div className="mt-12 text-center">
                <p className="text-gray-500">Still need help?</p>
                <Link
                    to="/contact"
                    className="inline-block mt-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Contact Support
                </Link>
            </div>
        </main>
    );
};

export default HelpCenter;