// src/pages/ShippingInfo.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ShippingInfo = () => {

    const [orderId, setOrderId] = useState("");
    const navigate = useNavigate();

    const handleTrack = (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        // Navigate directly to order confirmation page
        navigate(`/order-confirmation/${orderId.trim()}`);
    };

    return (
        <main className="bg-white">
            {/* Hero Section */}
            <section className="py-20 px-6 text-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                        Shipping & Delivery
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                        We deliver your favorite styles quickly and securely across Egypt — with flexible options to suit your needs.
                    </p>
                    <Link
                        to="/shop"
                        className="inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
                    >
                        Start Shopping
                    </Link>
                </div>
            </section>

            {/* Delivery Times */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Delivery Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                title: "Cairo & Giza",
                                time: "1-2 Business Days",
                                details: "Fast delivery within Greater Cairo area. Orders placed before 3 PM are shipped the same day.",
                                icon: (
                                    <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                ),
                            },
                            {
                                title: "Major Cities",
                                time: "2-4 Business Days",
                                details: "Including Alexandria, Mansoura, Tanta, and more. Shipped via trusted courier partners.",
                                icon: (
                                    <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                ),
                            },
                            {
                                title: "Rest of Egypt",
                                time: "3-6 Business Days",
                                details: "We ship nationwide! Remote areas may take slightly longer depending on logistics.",
                                icon: (
                                    <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                ),
                            },
                        ].map((city, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center hover:shadow-lg transition group">
                                <div className="flex justify-center mb-5">{city.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{city.title}</h3>
                                <p className="text-lg font-bold text-primary mb-3">{city.time}</p>
                                <p className="text-gray-600 text-sm leading-relaxed">{city.details}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Shipping Costs */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Shipping Rates</h2>
                    <p className="text-gray-600 mt-4">Transparent and affordable delivery fees.</p>
                </div>
                <div className="bg-white max-w-3xl mx-auto rounded-2xl shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="px-6 py-4 text-sm text-gray-900">Cairo & Giza</td>
                                <td className="px-6 py-4 text-sm font-medium text-green-600">Free</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 text-sm text-gray-900">Alexandria & Major Cities</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">EGP 49</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 text-sm text-gray-900">Rest of Egypt</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">EGP 79</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-center mt-6 text-gray-500 text-sm">
                    🎉 Free shipping on orders over EGP 999!
                </p>
            </section>

            {/* Returns & Exchanges */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Returns & Exchanges</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Not satisfied? No problem. You can return or exchange any unworn item within <strong>14 days</strong> of delivery.
                        </p>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1">•</span>
                                Items must be in original condition with tags attached.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1">•</span>
                                Refunds processed within 3–5 business days after receiving returned item.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1">•</span>
                                Contact us at <a href="mailto:support@josam.com" className="text-primary hover:underline">support@josam.com</a> to start a return.
                            </li>
                        </ul>
                        <div className="mt-8">
                            <Link
                                to="/contact"
                                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                Request Return
                            </Link>
                        </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-xl transform rotate-1 hover:rotate-0 transition duration-300">
                        <img
                            src="/images/shipping-returns.jpg"
                            alt="Easy Returns Process"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Order Tracking */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Track Your Order</h2>
                    <p className="text-gray-600 mt-4">
                        Enter your order ID to view status and details. You can also check in{" "}
                        <Link to="/profile" className="text-primary hover:underline">My Orders</Link>.
                    </p>
                </div>

                <form onSubmit={handleTrack} className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
                    <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="Enter order ID (e.g., 687ed3b3...)"
                        className="flex-1 px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        Track
                    </button>
                </form>
            </section>

            {/* FAQ */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: "How long does shipping take?",
                                a: "Most orders arrive within 1–4 business days depending on location. Cairo deliveries are fastest!",
                            },
                            {
                                q: "Do you ship internationally?",
                                a: "Currently, we only ship within Egypt. International shipping will be available soon.",
                            },
                            {
                                q: "Can I change my shipping address after ordering?",
                                a: "Yes, but only if the order hasn't been shipped. Contact us immediately at support@josam.com.",
                            },
                            {
                                q: "What happens if I'm not home during delivery?",
                                a: "Our courier will attempt redelivery or leave instructions. You’ll be contacted via phone.",
                            },
                            {
                                q: "Are there customs or import fees?",
                                a: "No. Since we operate locally within Egypt, all prices include taxes and duties.",
                            },
                        ].map((item, i) => (
                            <div key={i} className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.q}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-6 bg-gradient-to-r from-primary to-indigo-700 text-white text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">Ready to Shop?</h2>
                    <p className="text-lg opacity-90 mb-10">
                        Fast shipping, easy returns, and premium quality — all in one place.
                    </p>
                    <Link
                        to="/shop"
                        className="inline-block px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                        Browse Collection
                    </Link>
                </div>
            </section>

            {/* Footer Note */}
            {/* <div className="text-center py-10 text-gray-500 text-sm border-t border-gray-100 bg-gray-50">
                <p>© {new Date().getFullYear()} JOSAM. Crafted with ❤️ in Egypt.</p>
            </div> */}
        </main >
    );
};

export default ShippingInfo;