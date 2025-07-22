import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { TrashIcon, HeartIcon } from "@heroicons/react/24/outline";
import Title from "../components/Title";
import { removeFromWishlist } from "../utils/WishlistUtils";
import { showError, showSuccess } from "../utils/Toast";
// import GradientButton from "../components/GradientButton";

export default function Wishlist() {
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const token = Cookies.get("token");
                if (!token) throw new Error("User not authenticated");

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/wishlist`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const wishlistData = response.data.wishlist;

                // Enrich each wishlist item with full product data (including images)
                const itemsWithDetails = await Promise.all(
                    wishlistData.items.map(async (item) => {
                        try {
                            const productRes = await axios.get(
                                `${process.env.REACT_APP_API_URL}/products/${item.productId._id}`
                            );
                            return {
                                ...item,
                                productDetails: productRes.data, // contains title, price, images, etc.
                            };
                        } catch (err) {
                            console.error(`Failed to load product ${item.productId._id}`, err);
                            return {
                                ...item,
                                productDetails: null, // fallback if product is missing
                            };
                        }
                    })
                );

                setWishlist({
                    ...wishlistData,
                    items: itemsWithDetails,
                });
            } catch (err) {
                console.error("Error fetching wishlist:", err);
                setWishlist({ items: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {
        const result = await removeFromWishlist(productId);

        if (result.success) {
            setWishlist((prev) => ({
                ...prev,
                items: prev.items.filter((item) => item.productId._id !== productId),
            }));
            showSuccess("Product removed successfully");
        } else {
            showError(result.message);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-16 pt-32">
                <h1 className="text-4xl font-bold text-center mb-12 animate-pulse text-gray-800">
                    Loading Your Wishlist...
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
                                </div>
                            </div>
                            <div className="w-6 h-6 bg-gray-200 rounded-full mt-4 sm:mt-0"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!wishlist || wishlist.items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-44 pb-32 text-center px-6">
                <HeartIcon className="w-20 h-20 text-red-100 mb-6" />
                <Title title="Your Wishlist is Empty" subtitle="Save your favorite items to come back later. Click the heart icon on any product!" />
                {/* <GradientButton onClick={() => navigate("/shop")}>
                    Start Shopping
                </GradientButton> */}
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="mb-10 text-center">
                <Title title="Your Wishlist" subtitle={`${wishlist.items.length} item(s) saved`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.items.map((item) => {
                    const product = item.productDetails || item.productId;
                    const imageUrl = product?.images?.length
                        ? `${process.env.REACT_APP_API_URL}/public/images/products/${product.images[0]}`
                        : "null";

                    return (
                        <div
                            key={item._id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
                        >
                            {/* Image */}
                            <div
                                onClick={() => navigate(`/products/${product._id}`)}
                                className="w-full h-60 bg-gray-100 relative cursor-pointer"
                            >
                                <img
                                    src={imageUrl}
                                    alt={product.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3
                                    onClick={() => navigate(`/products/${product._id}`)}
                                    className="font-semibold text-gray-800 text-lg leading-tight hover:text-indigo-600 cursor-pointer transition-colors"
                                >
                                    {product.title}
                                </h3>
                                <p className="mt-2 text-indigo-600 font-bold">EGP {product.price}</p>

                                {/* Remove Button */}
                                <button
                                    onClick={() => handleRemove(product._id)}
                                    className="mt-4 w-full flex items-center justify-center gap-2 text-red-600 border border-red-200 hover:bg-red-50 py-2.5 rounded-xl transition"
                                    title="Remove from wishlist"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Continue Shopping */}
            {/* <div className="text-center mt-12">
                <GradientButton onClick={() => navigate("/shop")}>
                    Continue Shopping
                </GradientButton>
            </div> */}
        </main>
    );
}