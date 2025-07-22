// src/pages/ReturnPolicy.js
import React from "react";

const ReturnPolicy = () => {
    return (
        <main className="max-w-4xl mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Return & Exchange Policy</h1>
            <p className="text-lg text-gray-600 mb-8">Last updated: July 2025</p>

            <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                    We want you to love every piece from JOSAM. If you're not completely satisfied, we offer hassle-free returns and exchanges.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Eligibility</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
                    <li>You may return or exchange items within <strong>14 days</strong> of delivery.</li>
                    <li>Items must be unworn, in original condition with tags attached.</li>
                    <li>Shoes must be tried on indoors and not damaged.</li>
                    <li>We do not accept returns on final sale or discounted items unless defective.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">How to Return</h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-2">
                    <li>Contact us at <strong>support@josam.com</strong> with your order ID.</li>
                    <li>We’ll provide return instructions and authorization.</li>
                    <li>Pack the item securely and ship it back.</li>
                    <li>Once received, we’ll process your refund within 3–5 business days.</li>
                </ol>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Refunds</h2>
                <p className="text-gray-600">
                    Refunds will be issued to the original payment method (for prepaid orders) or as store credit.
                    Shipping costs are non-refundable.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Damaged or Wrong Items</h2>
                <p className="text-gray-600">
                    If you received a damaged, defective, or incorrect item, contact us immediately.
                    We’ll cover return shipping and send a replacement at no cost.
                </p>
            </div>
        </main>
    );
};

export default ReturnPolicy;