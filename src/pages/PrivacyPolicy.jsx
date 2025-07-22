// src/pages/PrivacyPolicy.js
import React from "react";

const PrivacyPolicy = () => {
    return (
        <main className="max-w-4xl mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="text-lg text-gray-600 mb-8">Last updated: July 2025</p>

            <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                    At JOSAM, we respect your privacy and are committed to protecting your personal information.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Information We Collect</h2>
                <p className="text-gray-600">
                    When you shop with us, we collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
                    <li>Personal details: name, email, phone, address</li>
                    <li>Order and purchase history</li>
                    <li>Device and browsing data (via cookies)</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">How We Use Your Data</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
                    <li>To process and deliver your orders</li>
                    <li>To improve our website and customer experience</li>
                    <li>To communicate about your account, orders, and promotions</li>
                    <li>We do not sell or share your data with third parties.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Data Security</h2>
                <p className="text-gray-600">
                    We use industry-standard encryption and security practices to protect your information.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Your Rights</h2>
                <p className="text-gray-600">
                    You have the right to access, correct, or delete your personal data at any time.
                    Contact us at <strong>support@josam.com</strong>.
                </p>
            </div>
        </main>
    );
};

export default PrivacyPolicy;