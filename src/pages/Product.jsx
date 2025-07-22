import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

import { LiaStarSolid, LiaStarHalfSolid, LiaStar } from "react-icons/lia";
import { addToCart, checkProductInCart, removeFromCart } from "../utils/CartUtils";
import { showError, showSuccess } from "../utils/Toast";
import { addToWishlist, checkProductInWishlist, removeFromWishlist } from "../utils/WishlistUtils";

const StarRating = ({ rating, numReviews }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<LiaStarSolid key={i} className="text-yellow-400 text-xl" />);
    } else if (rating >= i - 0.5) {
      stars.push(
        <LiaStarHalfSolid key={i} className="text-yellow-400 text-xl" />
      );
    } else {
      stars.push(<LiaStar key={i} className="text-gray-300 text-xl" />);
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex">{stars}</div>
      <span className="text-gray-600 text-sm">({numReviews} reviews)</span>
    </div>
  );
};

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [inWishlist, setInWishlist] = useState(false);
  const [checkingWishlist, setCheckingWishlist] = useState(true);

  const [inCart, setInCart] = useState(false);


  // New quantity state
  const [quantity, setQuantity] = useState(1);

  // Get the top rated products
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/top-rated`)
      .then((res) => {
        setRecommended(res.data?.data || []);
      })
      .catch((err) => console.error("Error fetching top-rated products:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setMainImage(res.data.images[0]);
        setSelectedSize(res.data.sizes[0] || "");
        setSelectedColor(res.data.colors[0] || "");
        setQuantity(1); // reset quantity when product changes
      })
      .catch((err) => {
        setError("Failed to load product");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const [checkingCart, setCheckingCart] = useState(true);

  useEffect(() => {
    const runCheck = async () => {
      setCheckingCart(true);
      if (
        product &&
        (product.colors.length === 0 || selectedColor) &&
        (product.sizes.length === 0 || selectedSize)
      ) {
        const exists = await checkProductInCart(
          product._id,
          selectedColor || null,
          selectedSize || null
        );
        setInCart(exists);
      }
      setCheckingCart(false);
    };

    runCheck();
  }, [product, selectedColor, selectedSize]);

  useEffect(() => {
    const runWishlistCheck = async () => {
      setCheckingWishlist(true);
      if (product) {
        const exists = await checkProductInWishlist(product._id);
        setInWishlist(exists);
      }
      setCheckingWishlist(false);
    };

    runWishlistCheck();
  }, [product]);


  if (loading) {
    return (
      <main className="max-w-7xl mx-auto py-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Section Skeleton */}
          <div>
            <div className="w-full h-[500px] bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="flex mt-4 space-x-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Details Section Skeleton */}
          <div className="space-y-6">
            <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>

            {/* Rating */}
            <div className="flex space-x-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              ))}
              <div className="h-5 bg-gray-200 rounded w-20 ml-2 animate-pulse"></div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-4 mt-6">
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-20 animate-pulse opacity-60"></div>
            </div>

            {/* Brand */}
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mt-2"></div>

            {/* Size Selector */}
            <div className="mt-8">
              <div className="h-5 bg-gray-200 rounded w-28 mb-4 animate-pulse"></div>
              <div className="flex space-x-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-16 h-10 bg-gray-200 rounded-md animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="mt-6">
              <div className="h-5 bg-gray-200 rounded w-28 mb-4 animate-pulse"></div>
              <div className="flex space-x-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-8">
              <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="flex items-center border rounded-md overflow-hidden w-32">
                <div className="w-10 h-10 bg-gray-200"></div>
                <div className="w-12 h-10 bg-gray-100"></div>
                <div className="w-10 h-10 bg-gray-200"></div>
              </div>
            </div>

            {/* Stock & Buttons */}
            <div className="mt-10 space-y-4">
              <div className="h-5 bg-gray-200 rounded w-40 animate-pulse"></div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="h-14 flex-1 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-14 flex-1 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products Skeleton */}
        <section className="mt-20">
          <div className="h-9 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border">
                <div className="w-full h-60 bg-gray-200 animate-pulse"></div>
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

  if (!product) return null;

  const finalPrice =
    product.discountType === "fixed"
      ? product.price - product.discount
      : product.price - (product.price * product.discount) / 100;

  // Handler for Add to Cart
  const handleCartToggle = async (e) => {
    e.stopPropagation();

    if (inCart) {
      const result = await removeFromCart(
        product._id,
        selectedColor || null,
        selectedSize || null
      );

      if (result.success) {
        showSuccess(`${product.title} was removed from your cart!`);
        setInCart(false);
      } else {
        showError(result.message);
      }
    } else {
      const result = await addToCart(
        product._id,
        quantity,
        selectedColor || null,
        selectedSize || null
      );

      if (result.success) {
        showSuccess(`${product.title} was added to your cart!`);
        setInCart(true);
      } else {
        showError(result.message);
      }
    }
  };

  // Handler for Wishlist toggle
  const handleWishlistToggle = async (e) => {
    e.stopPropagation();

    if (inWishlist) {
      const result = await removeFromWishlist(product._id);
      if (result.success) {
        showSuccess(`${product.title} was removed from your wishlist!`);
        setInWishlist(false);
      } else {
        showError(result.message);
      }
    } else {
      const result = await addToWishlist(product._id);
      if (result.success) {
        showSuccess(`${product.title} was added to your wishlist!`);
        setInWishlist(true);
      } else {
        showError(result.message);
      }
    }
  };


  return (
    <main className="max-w-7xl mx-auto py-20 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images Section */}
        <div>
          <img
            src={`${process.env.REACT_APP_API_URL}/public/images/products/${mainImage}`}
            alt={product.title}
            className="w-full rounded-xl shadow-lg object-cover max-h-[500px]"
          />
          <div className="flex mt-4 space-x-4">
            {product.images.map((img) => (
              <img
                key={img}
                src={`${process.env.REACT_APP_API_URL}/public/images/products/${img}`}
                alt={product.title}
                className={`w-20 h-20 rounded-lg cursor-pointer object-cover border-2 ${mainImage === img ? "border-primary" : "border-transparent"
                  }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold mb-3">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <StarRating rating={product.rating} numReviews={product.numReviews} />
          <div className="flex items-baseline space-x-4 mt-4">
            <p className="text-3xl font-bold text-indigo-700">
              ${finalPrice.toFixed(2)}
            </p>
            {product.discount > 0 && (
              <p className="text-gray-400 line-through text-lg mt-1">
                ${product.price.toFixed(2)}
              </p>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Brand: <span className="capitalize">{product.brand}</span>
          </p>

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-2">Select Size</h3>
              <div className="flex space-x-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md font-semibold ${selectedSize === size
                      ? "border-primary bg-indigo-100"
                      : "border-gray-300 hover:border-indigo-500"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Select Color</h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === color
                      ? "border-primary"
                      : "border-gray-300"
                      }`}
                    style={{ backgroundColor: color }}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="mt-8 flex items-center space-x-4">
            <h3 className="font-semibold">Quantity:</h3>
            <div className="flex items-center border rounded-md overflow-hidden w-32">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition"
                type="button"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                min={1}
                max={product.stockQuantity}
                onChange={(e) => {
                  let val = Number(e.target.value);
                  if (isNaN(val) || val < 1) val = 1;
                  else if (val > product.stockQuantity)
                    val = product.stockQuantity;
                  setQuantity(val);
                }}
                className="w-full text-center outline-none border-l border-r"
              />
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stockQuantity, q + 1))
                }
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition"
                type="button"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock and Add to Cart */}
          <div className="mt-10">
            {product.inStock && product.stockQuantity > 0 ? (
              <p className="text-green-600 font-semibold mb-4">
                In stock ({product.stockQuantity} available)
              </p>
            ) : (
              <p className="text-red-600 font-semibold mb-4">Out of stock</p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                disabled={!(product.inStock && product.stockQuantity > 0)}
                onClick={handleCartToggle}
                className={`flex-1 py-4 rounded-xl text-white font-bold transition 
    ${product.inStock && product.stockQuantity > 0
                    ? inCart
                      ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                      : "bg-primary hover:bg-indigo-700 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                  }`}
                type="button"
              >
                {checkingCart ? "Checking..." : inCart ? "Remove from Cart" : "Add to Cart"}
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`flex-1 py-4 rounded-xl border-2 font-bold transition
          ${inWishlist ? "border-red-600 bg-red-600 text-white hover:bg-red-700" : "border-primary text-primary hover:bg-indigo-50"}
        `}
                type="button"
              >
                {checkingWishlist ? "Checking..." : inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <section className="mt-20">
        <h2 className="text-3xl font-extrabold mb-8 text-gray-800">
          Recommended Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {recommended.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
