import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";
import { removeFromCart } from "../utils/CartUtils";
import GradientButton from "../components/GradientButton";
import Title from "../components/Title";

export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = Cookies.get("token");
                if (!token) throw new Error("User not authenticated");

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const itemsWithImages = await Promise.all(
                    response.data.cart.items.map(async (item) => {
                        const productRes = await axios.get(
                            `${process.env.REACT_APP_API_URL}/products/${item.productId._id}`
                        );
                        return {
                            ...item,
                            productDetails: productRes.data,
                        };
                    })
                );

                setCart({ ...response.data.cart, items: itemsWithImages });
            } catch (err) {
                console.error("Error fetching cart:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleRemove = async (item) => {
        const result = await removeFromCart(item.productId._id, item.color, item.size);
        if (result.success) {
            setCart((prev) => ({
                ...prev,
                items: prev.items.filter((i) => i._id !== item._id),
            }));
        } else {
            alert(result.message);
        }
    };

    const handleQuantityChange = async (item, delta) => {
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return;

        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/cart/update/${item.productId._id}`,
                {
                    quantity: newQuantity,
                    color: item.color,
                    size: item.size,
                },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            );

            setCart((prev) => ({
                ...prev,
                items: prev.items.map((i) =>
                    i._id === item._id ? { ...i, quantity: newQuantity } : i
                ),
            }));
        } catch (err) {
            console.error("Error updating quantity:", err);
        }
    };

    // Total price calculation
    const totalAmount = cart?.items.reduce(
        (acc, item) => acc + item.productDetails.price * item.quantity,
        0
    );

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-16 pt-32">
                <h1 className="text-4xl font-bold text-center mb-12 animate-pulse text-gray-800">
                    Loading Your Cart...
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
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-24 h-24 mb-6 text-gray-300">
                    {/* Simple shopping bag icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6l-1-7z"
                        />
                    </svg>
                </div>
                <Title title="Your Cart is Empty" subtitle="Looks like you haven't added any items yet. Start shopping to fill your cart!" />
                <button
                    onClick={() => navigate("/shop")}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-full hover:from-purple-600 hover:to-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="mb-10 text-center">
                <Title title="Your Shopping Cart" className="mb-0" />
                <p className="text-gray-500 mt-2">{cart.items.length} item(s) in your cart</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-5">
                    {cart.items.map((item) => {
                        const product = item.productDetails;
                        const itemTotal = product.price * item.quantity;

                        return (
                            <div
                                key={item._id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
                            >
                                <div className="flex flex-col sm:flex-row">
                                    {/* Image: Fixed width (40 = 10rem), full height */}
                                    <div
                                        onClick={() => navigate(`/products/${product._id}`)}
                                        className="sm:w-40 w-full sm:h-auto h-48 bg-gray-100 flex-shrink-0 cursor-pointer relative"
                                    >
                                        <img
                                            src={`${process.env.REACT_APP_API_URL}/public/images/products/${product.images[0]}`}
                                            alt={product.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        {/* Product Info */}
                                        <div
                                            className="flex-1 cursor-pointer"
                                            onClick={() => navigate(`/products/${product._id}`)}
                                        >
                                            <h3 className="font-semibold text-gray-800 text-lg leading-tight hover:text-indigo-600 transition-colors">
                                                {product.title}
                                            </h3>
                                            <div className="mt-2 space-y-1 text-sm text-gray-500">
                                                <p>
                                                    Size: <span className="font-medium">{item.size || "N/A"}</span>
                                                </p>
                                                <p>
                                                    Color: <span className="font-medium">{item.color || "N/A"}</span>
                                                </p>
                                            </div>
                                            <p className="mt-2 text-indigo-600 font-bold">EGP {product.price}</p>
                                        </div>

                                        {/* Actions (Quantity, Total, Remove) */}
                                        <div className="flex flex-col items-end sm:items-end justify-between space-y-3 sm:space-y-2">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                                                <button
                                                    onClick={() => handleQuantityChange(item, -1)}
                                                    disabled={item.quantity <= 1}
                                                    className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>
                                                <span className="w-12 text-center font-semibold text-gray-800">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item, 1)}
                                                    className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition"
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Subtotal */}
                                            <p className="text-right text-sm text-gray-500">
                                                Subtotal<br />
                                                <span className="font-bold text-indigo-700">EGP {itemTotal}</span>
                                            </p>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemove(item)}
                                                className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition ease-in-out"
                                                title="Remove item"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>EGP {totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <hr className="border-gray-200" />
                            <div className="flex justify-between text-lg font-bold text-gray-800">
                                <span>Total</span>
                                <span>EGP {totalAmount}</span>
                            </div>
                        </div>

                        <GradientButton onClick={() => navigate("/checkout")} className="mt-6">
                            Proceed to Checkout
                        </GradientButton>

                        <p className="text-xs text-gray-400 text-center mt-4">
                            Taxes calculated at checkout
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}