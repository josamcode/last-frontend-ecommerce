// src/pages/OrderConfirmation.js
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const OrderConfirmation = () => {
    const { id } = useParams(); // Order ID from URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = Cookies.get("token");

    useEffect(() => {
        if (!token) {
            window.location.href = "/login";
            return;
        }

        const fetchOrder = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.data.status === "success") {
                    const fetchedOrder = res.data.order;
                    console.log("Fetched Order", fetchedOrder);
                    setOrder(fetchedOrder[0]);
                } else {
                    setError("Order not found.");
                }
            } catch (err) {
                console.error("Failed to fetch order:", err);
                setError(
                    err.response?.data?.message || "Could not load order details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, token]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your order confirmation...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl font-bold text-red-600 mb-4">Error</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                    onClick={() => window.history.back()}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl font-bold text-gray-800">Order Not Found</h2>
            </div>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <main className="max-w-7xl mx-auto px-6 py-12 pb-24">
            {/* Success Header */}
            <div className="text-center mb-12">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                    Thank You, {order.shippingAddress.fullName.split(" ")[0]}!
                </h1>
                <p className="text-lg text-gray-600">
                    Your order has been confirmed and is being processed.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Order #<span className="font-mono">{order._id.slice(-6).toUpperCase()}</span> • Placed on{" "}
                    {formatDate(order.createdAt)}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Order Summary */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items List */}
                    <section className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Order Details</h2>
                        <div className="space-y-6 divide-y divide-gray-100">
                            {order.items.map((item) => (
                                <div key={item._id} className="flex gap-4 pt-6 first:pt-0">
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/public/images/products/${item.image}`}
                                        alt={item.productId?.title || "Product"}
                                        className="w-20 h-20 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.src = "/images/fallback-product.png";
                                        }}
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.productId?.title || "Product"}</h3>
                                        <p className="text-gray-600 text-sm">
                                            Size: <span className="capitalize">{item.size}</span>, Color:{" "}
                                            <span className="capitalize">{item.color}</span>
                                        </p>
                                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Payment Method */}
                    <section className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Information</h2>
                        <p>
                            <strong>Method:</strong>{" "}
                            {order.paymentMethod === "CashOnDelivery"
                                ? "Cash on Delivery"
                                : order.paymentMethod}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                            You will pay upon delivery.
                        </p>
                    </section>
                </div>

                {/* Sidebar: Shipping & Total */}
                <div className="space-y-8">
                    {/* Shipping Address */}
                    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
                        <h2 className="text-xl font-semibold mb-5 text-gray-800">Shipping Address</h2>
                        <div className="space-y-2 text-gray-700">
                            <p className="font-medium">{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.phone}</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}</p>
                            {order.shippingAddress.notes && (
                                <p className="text-sm text-gray-500 mt-2">
                                    <strong>Notes:</strong> {order.shippingAddress.notes}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
                        <h2 className="text-xl font-semibold mb-5 text-gray-800">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            {order.couponCode && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount ({order.couponCode})</span>
                                    <span>
                                        - $
                                        {(
                                            order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) - order.total
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            )}
                            <hr className="my-2 border-gray-200" />
                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link
                            to="/profile"
                            className="block w-full py-3 text-center bg-primary text-white rounded-xl hover:bg-indigo-700 transition font-semibold"
                        >
                            View All Orders
                        </Link>
                        <Link
                            to="/shop"
                            className="block w-full py-3 text-center border border-primary text-primary rounded-xl hover:bg-indigo-50 transition font-semibold"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OrderConfirmation;