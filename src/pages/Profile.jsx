// src/pages/Profile.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { showError } from "../utils/Toast";
import Title from "../components/Title";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = Cookies.get("token");

    useEffect(() => {
        if (!token) {
            window.location.href = "/login";
            return;
        }

        const fetchProfileData = async () => {
            try {
                // Fetch user profile
                const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!userRes.data.user) {
                    throw new Error("Failed to load user data");
                }
                setUser(userRes.data.user);

                // Fetch user orders
                const ordersRes = await axios.get(`${process.env.REACT_APP_API_URL}/orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (ordersRes.data.status === "success") {
                    setOrders(ordersRes.data.orders || []);
                } else {
                    setOrders([]); // Empty array is valid — not an error
                }
            } catch (err) {
                console.error("Error fetching profile or orders:", err);
                setError(err.response?.data?.message || "Could not load your profile.");
                showError("Failed to load profile or orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    // if (error) {
    //     return (
    //         <div className="max-w-3xl mx-auto px-6 py-20 text-center">
    //             <h2 className="text-3xl font-bold text-red-600 mb-4">Error</h2>
    //             <p className="text-gray-600 mb-6">{error}</p>
    //             <button
    //                 onClick={() => window.location.reload()}
    //                 className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 transition"
    //             >
    //                 Retry
    //             </button>
    //         </div>
    //     );
    // }

    if (!user) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl font-bold text-gray-800">User Not Found</h2>
            </div>
        );
    }

    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

    return (
        <main className="max-w-7xl mx-auto px-6 py-12 pb-24">
            {/* Page Header */}
            <div className="text-center mb-12">
                <Title title={`Welcome back, ${user.username.split(" ")[0]}!`} subtitle="Here’s your account overview." />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Sidebar - User Info */}
                <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 lg:col-span-1">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Account Info</h2>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Name</label>
                            <p className="font-medium text-gray-900">{user.username}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">Phone</label>
                            <p className="font-medium text-gray-900">{user.phone}</p>
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-600">Role</label>
                            <span
                                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize ${user.role === "admin"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                    }`}
                            >
                                {user.role}
                            </span>
                        </div> */}

                        <div>
                            <label className="block text-sm font-medium text-gray-600">Member Since</label>
                            <p className="text-gray-700 text-sm">
                                {new Date(user.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                })}
                            </p>
                        </div>

                        <hr className="my-4 border-gray-200" />

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="text-center p-3 bg-indigo-50 rounded-lg">
                                <p className="text-2xl font-bold text-primary">{orders.length}</p>
                                <p className="text-xs text-gray-600">Orders</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">${totalSpent.toFixed(2)}</p>
                                <p className="text-xs text-gray-600">Spent</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 space-y-3">
                        <Link
                            to="/wishlist"
                            className="block w-full py-3 text-center bg-primary text-white rounded-xl hover:bg-indigo-700 transition font-semibold"
                        >
                            View Wishlist
                        </Link>
                        <Link
                            to="/cart"
                            className="block w-full py-3 text-center border border-primary text-primary rounded-xl hover:bg-indigo-50 transition font-semibold"
                        >
                            Go to Cart
                        </Link>
                    </div>
                </div>

                {/* Right Side - Orders */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Recent Orders</h2>
                        <Link to="/profile" className="text-primary hover:text-indigo-700 text-sm font-medium">
                            View All ({orders.length})
                        </Link>
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                            <Link
                                to="/shop"
                                className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <Link
                                    key={order._id}
                                    to={`/order-confirmation/${order._id}`}
                                    className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group"
                                >
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-gray-900 group-hover:text-primary transition">
                                                    Order #{order._id}
                                                </h3>

                                                {order.state === "cancelled" ? (
                                                    <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize bg-gray-100 text-gray-800">
                                                        {order.state}
                                                    </span>
                                                ) : (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-semibold capitalize text-gray-700 mb-1">{order.state}</span>
                                                        <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className={`
            h-full rounded-full transition-all duration-300
            ${order.state === "pending" && "w-1/4 bg-yellow-400"}
            ${order.state === "processing" && "w-1/2 bg-blue-500"}
            ${order.state === "shipped" && "w-3/4 bg-indigo-500"}
            ${order.state === "delivered" && "w-full bg-green-500"}
          `}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-sm text-gray-600 mb-1">
                                                Placed on{" "}
                                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Payment:{" "}
                                                {order.paymentMethod === "CashOnDelivery"
                                                    ? "Cash on Delivery"
                                                    : order.paymentMethod}
                                            </p>
                                        </div>
                                        <div className="text-right md:text-left">
                                            <p className="text-lg font-bold text-gray-900">
                                                ${order.total.toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {order.items.length} item{order.items.length > 1 && "s"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="flex items-center gap-3 mt-4 overflow-x-auto max-w-lg scrollbar-hide">
                                        {order.items.map((item) => (
                                            <img
                                                key={item._id}
                                                src={`${process.env.REACT_APP_API_URL}/public/images/products/${item.image}`}
                                                alt={item.productId?.title || "Product"}
                                                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                                onError={(e) => {
                                                    e.target.src = "/images/fallback-product.png";
                                                }}
                                            />
                                        ))}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Profile;