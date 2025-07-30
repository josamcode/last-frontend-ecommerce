// src/pages/CheckoutPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { showSuccess, showError } from "../utils/Toast";

const CheckoutPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [productDetails, setProductDetails] = useState({});

    // Coupon state
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null); // Stores applied coupon data
    const [orderTotal, setOrderTotal] = useState(0); // Dynamic total after coupon
    const [applying, setApplying] = useState(false);
    const [removing, setRemoving] = useState(false);

    const token = Cookies.get("token");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        city: "",
        street: "",
        notes: "",
        paymentMethod: "CashOnDelivery",
    });

    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        const fetchCartAndProducts = async () => {
            try {
                const cartRes = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const cartData = cartRes.data.cart;

                if (!cartData || !cartData.items.length) {
                    showError("Your cart is empty.");
                    navigate("/cart");
                    return;
                }

                setCart(cartData);
                setOrderTotal(cartData.total); // Initial total

                const productFetchPromises = cartData.items.map(async (item) => {
                    try {
                        const res = await axios.get(
                            `${process.env.REACT_APP_API_URL}/products/${item.productId._id}`
                        );
                        return [item.productId._id, res.data];
                    } catch (err) {
                        console.error(`Failed to load product ${item.productId._id}`, err);
                        return [item.productId._id, null];
                    }
                });

                const results = await Promise.all(productFetchPromises);
                const detailsMap = Object.fromEntries(results.filter(([_, prod]) => prod));
                setProductDetails(detailsMap);
            } catch (err) {
                console.error("Error loading cart or products:", err);
                showError("Could not load cart or product data.");
                navigate("/cart");
            } finally {
                setLoading(false);
            }
        };

        fetchCartAndProducts();
    }, [token, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle coupon input change
    const handleCouponChange = (e) => {
        setCouponCode(e.target.value.trim());
    };

    // Apply coupon
    // In CheckoutPage.js
    const handleApplyCoupon = async () => {
        if (!couponCode) {
            showError("Enter a coupon code");
            return;
        }

        setApplying(true);
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/orders/apply-coupon`,
                { couponCode },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const { discount, totalAfterDiscount, message } = res.data;

            setAppliedCoupon({ couponCode, discount, totalAfterDiscount });
            setOrderTotal(parseFloat(totalAfterDiscount));
            showSuccess(message);
        } catch (error) {
            showError(error.response?.data?.message || "Invalid or expired coupon");
            setCouponCode("");
        } finally {
            setApplying(false);
        }
    };

    // Remove coupon
    const handleRemoveCoupon = async () => {
        setRemoving(true);
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/orders/remove-coupon`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setAppliedCoupon(null);
            setCouponCode("");
            setOrderTotal(cart.total); // Reset to original cart total
            showSuccess("Coupon removed");
        } catch (error) {
            showError(error.response?.data?.message || "Failed to remove coupon");
        } finally {
            setRemoving(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!cart || cart.items.length === 0) {
            showError("Your cart is empty!");
            return;
        }

        setSubmitting(true);
        try {
            const orderItems = cart.items.map((item) => ({
                productId: item.productId._id,
                quantity: item.quantity,
                color: item.color || null,
                size: item.size || null,
            }));

            const payload = {
                items: orderItems,
                paymentMethod: formData.paymentMethod,
                shippingAddress: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    city: formData.city,
                    street: formData.street,
                    notes: formData.notes,
                },
                ...(appliedCoupon && { couponCode: appliedCoupon.couponCode }), // Optional
            };

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/orders`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.status === "success") {
                showSuccess("Order placed successfully!");
                window.dispatchEvent(new Event("cartUpdated"));
                navigate(`/order-confirmation/${response.data.order._id}`);
            }
        } catch (error) {
            console.error("Order failed:", error);
            const message =
                error.response?.data?.message ||
                "Failed to place order. Please try again.";
            showError(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-16 pt-32">
                <h1 className="text-4xl font-bold text-center mb-12 animate-pulse text-gray-800">
                    Loading Your Order...
                </h1>
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col sm:flex-row items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
                        >
                            <div className="flex flex-1 items-center gap-5">
                                <div className="w-24 h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center mt-4 sm:mt-0 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                                </div>
                                <div className="h-5 bg-gray-200 rounded w-20"></div>
                                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                <button
                    onClick={() => navigate("/shop")}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Go to Shop
                </button>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Shipping Form */}
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                    <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City *
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Street Address *
                            </label>
                            <textarea
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                required
                                rows="3"
                                placeholder="e.g., Nasr City - Street 10"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Order Notes (Optional)
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="2"
                                placeholder="Special instructions for delivery"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Method
                            </label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="CashOnDelivery">Cash on Delivery</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                    <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

                    {/* Coupon Input */}
                    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Coupon Code
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={handleCouponChange}
                                placeholder="Enter code"
                                disabled={appliedCoupon !== null}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                            />
                            {!appliedCoupon ? (
                                <button
                                    type="button"
                                    onClick={handleApplyCoupon}
                                    disabled={applying}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                                >
                                    {applying ? "Applying..." : "Apply"}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleRemoveCoupon}
                                    disabled={removing}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
                                >
                                    {removing ? "Removing..." : "Remove"}
                                </button>
                            )}
                        </div>
                        {appliedCoupon && (
                            <p className="text-green-600 text-sm mt-2">
                                ✓ Saved ${(appliedCoupon.discount || 0).toFixed(2)}
                            </p>
                        )}
                    </div>

                    {/* Items List */}
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                        {cart.items.map((item) => {
                            const product = productDetails[item.productId._id];
                            const title = product?.title || "Unknown Product";
                            const price = product?.price || 0;
                            const image = product?.images?.[0];
                            return (
                                <div key={item._id} className="flex gap-4 border-b pb-4">
                                    <img
                                        src={
                                            image
                                                ? `${process.env.REACT_APP_API_URL}/public/images/products/${image}`
                                                : "/images/fallback-product.png"
                                        }
                                        alt={title}
                                        className="w-16 h-16 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.src = "/images/fallback-product.png";
                                        }}
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium">{title}</h3>
                                        <p className="text-gray-600 text-sm">
                                            {item.quantity} × ${price.toFixed(2)}
                                            {item.color && <span>, Color: {item.color}</span>}
                                            {item.size && <span>, Size: {item.size}</span>}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${(price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Totals */}
                    <div className="border-t pt-6 mt-6">
                        {appliedCoupon ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-base">
                                    <span>Original Total:</span>
                                    <span className="line-through text-gray-500">${cart.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-base text-green-600">
                                    <span>Discount (-):</span>
                                    <span>-${parseFloat(appliedCoupon.discount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>New Total:</span>
                                    <span>${orderTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total:</span>
                                <span>${orderTotal.toFixed(2)}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full py-3 mt-6 text-white font-bold rounded-lg transition ${submitting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-primary hover:bg-indigo-700"
                                }`}
                        >
                            {submitting ? "Processing..." : "Place Order"}
                        </button>
                    </div>
                </div>
            </form>
        </main>
    );
};

export default CheckoutPage;