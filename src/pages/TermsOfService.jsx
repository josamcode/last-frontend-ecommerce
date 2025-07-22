// src/pages/TermsOfService.js
import React from "react";

const TermsOfService = () => {
    return (
        <main className="max-w-4xl mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
            <p className="text-lg text-gray-600 mb-8">Last updated: July 2025</p>

            <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                    These Terms govern your use of JOSAM's website and services. By accessing or using our site, you agree to these terms.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Accounts</h2>
                <p className="text-gray-600">
                    You may create an account to place orders, save favorites, and track shipments.
                    You are responsible for keeping your login credentials secure.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Orders & Payments</h2>
                <p className="text-gray-600">
                    All orders are subject to availability. Prices are listed in EGP and are final at checkout.
                    Cash on delivery is available for all locations.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Intellectual Property</h2>
                <p className="text-gray-600">
                    All content on this site (logos, images, text, designs) is owned by JOSAM and protected by copyright laws.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Changes to Terms</h2>
                <p className="text-gray-600">
                    We may update these terms at any time. Continued use of the site constitutes acceptance of the changes.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Contact</h2>
                <p className="text-gray-600">
                    For questions about these Terms, contact us at{" "}
                    <a href="mailto:support@josam.com" className="text-primary hover:underline">
                        support@josam.com
                    </a>.
                </p>
            </div>
        </main>
    );
};

export default TermsOfService;