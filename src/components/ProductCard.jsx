import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCartIcon, HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, StarIcon } from "@heroicons/react/24/solid";
import {
  addToCart,
  checkProductInCart,
  removeFromCart
} from "../utils/CartUtils";
import {
  addToWishlist,
  checkProductInWishlist,
  removeFromWishlist
} from "../utils/WishlistUtils";
import { showError, showSuccess } from "../utils/Toast";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [inCart, setInCart] = useState(false);
  const [checkingCart, setCheckingCart] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [checkingWishlist, setCheckingWishlist] = useState(true);

  const finalPrice =
    product.discount > 0
      ? product.discountType === "fixed"
        ? product.price - product.discount
        : product.price * (1 - product.discount / 100)
      : product.price;

  const imageUrl =
    process.env.REACT_APP_API_URL + "/public/images/products/" + product.images[0];

  useEffect(() => {
    const check = async () => {
      setCheckingCart(true);
      setCheckingWishlist(true);

      const cartExists = await checkProductInCart(product._id, product.colors[0], product.sizes[0]);
      const wishlistExists = await checkProductInWishlist(product._id);

      setInCart(cartExists);
      setInWishlist(wishlistExists);

      setCheckingCart(false);
      setCheckingWishlist(false);
    };

    check();
  }, [product._id]);

  const handleCartToggle = async (e) => {
    e.stopPropagation();

    if (inCart) {
      const result = await removeFromCart(product._id, product.colors[0], product.sizes[0]);
      if (result.success) {
        setInCart(false);
        showSuccess(`${product.title} was removed from your cart.`);
      } else {
        showError(result.message);
      }
    } else {
      const result = await addToCart(product._id, 1, null, null);
      if (result.success) {
        setInCart(true);
        showSuccess(`${product.title} was added to your cart.`);
      } else {
        showError(result.message);
      }
    }
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();

    if (inWishlist) {
      const result = await removeFromWishlist(product._id);
      if (result.success) {
        setInWishlist(false);
        showSuccess(`${product.title} was removed from your wishlist.`);
      } else {
        showError(result.message);
      }
    } else {
      const result = await addToWishlist(product._id);
      if (result.success) {
        setInWishlist(true);
        showSuccess(`${product.title} was added to your wishlist.`);
      } else {
        showError(result.message);
      }
    }
  };

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative flex flex-col cursor-pointer"
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        disabled={checkingWishlist}
        className="absolute top-3 right-3 z-20 bg-white rounded-full p-2 hover:bg-gray-100 shadow-md transition"
        title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        {inWishlist ? (
          <HeartSolidIcon className="h-5 w-5 text-red-500" />
        ) : (
          <HeartOutlineIcon className="h-5 w-5 text-gray-500 hover:text-red-500" />
        )}
      </button>

      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-semibold px-2 py-1 rounded-full z-20 shadow">
          {product.discountType === "fixed"
            ? `-${product.discount}$`
            : `-${product.discount}%`}
        </div>
      )}

      {/* Out of Stock Overlay */}
      {!product.inStock && (
        <div className="absolute inset-0 bg-white/80 z-30 flex items-center justify-center">
          <span className="text-red-600 font-semibold text-lg">Out of Stock</span>
        </div>
      )}

      {/* Image */}
      <div className="overflow-hidden h-56 bg-gray-100">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="p-4 pt-3 flex flex-col flex-grow relative">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
          {product.title}
        </h3>

        {/* Rating */}
        <span className="flex items-center gap-1 text-yellow-500">
          <StarIcon className="w-4 h-4" />
          {product.rating.toFixed(1)}
        </span>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-primary font-bold text-xl">${finalPrice.toFixed(2)}</span>
          {product.discount > 0 && (
            <span className="line-through text-sm text-gray-400">${product.price.toFixed(2)}</span>
          )}
        </div>

        {/* Add to Cart Icon Button */}
        {product.inStock && product.stockQuantity > 0 && (
          <button
            onClick={handleCartToggle}
            disabled={checkingCart}
            className={`absolute bottom-6 right-6 rounded-full transition-transform hover:scale-110`}
            title={inCart ? "Remove from Cart" : "Add to Cart"}
          >
            <ShoppingCartIcon
              className={`w-6 h-6 ${inCart ? "text-red-600" : "text-gray-950"}`}
            />
          </button>
        )}
      </div>
    </div>
  );
}
