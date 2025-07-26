import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Title from "../components/Title";

const featuredCategories = [
  {
    id: 1,
    title: "Men",
    image: "men.jpg",
  },
  {
    id: 2,
    title: "Kids",
    image: "kids.jpg",
  },
  {
    id: 3,
    title: "Women",
    image: "women.jpg",
  },
];

// Component to render star ratings
const StarRating = ({ rating, numReviews }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        className={`w-4 h-4 inline-block ${i <= Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
          }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 00.95.69h4.166c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.962c.3.92-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.962a1 1 0 00-.364-1.118L2.04 9.39c-.783-.57-.38-1.81.588-1.81h4.165a1 1 0 00.951-.69l1.285-3.962z" />
      </svg>
    );
  }

  return (
    <div className="flex items-center space-x-1 mt-1">
      <div>{stars}</div>
      <span className="text-gray-500 text-sm ml-2">({numReviews})</span>
    </div>
  );
};

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const navigate = useNavigate();

  const handleShopSaleClick = () => {
    navigate("/shop?discounted=true");
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/top-rated`)
      .then((res) => {
        const activeProducts = res.data?.data.filter(
          (p) => p.isActive === true
        );

        setBestSellers(activeProducts || []);
      })
      .catch((err) => console.error("Error fetching best sellers:", err));
  });

  return (
    <main className="font-sans text-gray-900 mt-[-67px]">
      {/* Hero Section with Parallax Effect */}
      <section
        className="relative h-screen flex items-center justify-center text-center px-6 bg-fixed bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1637666544359-0e88de7b3206?q=80&w=1470&auto=format&fit=crop')",
          // "url('https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1470&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>
        <div className="relative z-20 max-w-4xl mx-auto">
          <h1 className="text-white text-5xl md:text-7xl font-extrabold drop-shadow-lg leading-tight mb-6">
            Discover Our Latest Collection
          </h1>
          <p className="text-gray-200 text-lg md:text-2xl max-w-xl mx-auto mb-8 drop-shadow-md">
            Style meets comfort — Explore the trends that define this season.
          </p>
          <Link
            to="/shop"
            className="px-10 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white text-lg font-semibold shadow-lg transition-transform hover:scale-105"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Categories with Hover Zoom */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <Title title="Shop by Category" subtitle="Browse our collection by category to find what suits your needs." />
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
            {featuredCategories.map(({ id, title, image }) => (
              <div
                key={id}
                onClick={() =>
                  navigate(`/shop?category=${title.toLowerCase()}`)
                }
                className="group relative cursor-pointer rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
                aria-label={`Shop ${title} category`}
              >
                <img
                  src={`/images/categories/${image}`}
                  alt={title}
                  className="w-full h-72 object-cover brightness-90 group-hover:brightness-75 transition duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <h3 className="absolute bottom-6 left-6 text-white text-3xl font-bold drop-shadow-lg">
                  {title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6">
        <Title title="Best Sellers" subtitle="Check out our most popular products loved by our customers!" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {(showAll ? bestSellers : bestSellers.slice(0, 3)).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}

          {/* Show More Card */}
          <div
            onClick={() => navigate("/shop")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigate("/shop");
            }}
            className="cursor-pointer flex flex-col items-center justify-center bg-gradient-to-r from-primary to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white rounded-xl shadow-lg p-8 transition-transform"
            aria-label="Go to shop page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            <span className="text-xl font-bold tracking-wide">Show More</span>
            <p className="text-sm opacity-90 mt-2">Explore all products</p>
          </div>
        </div>
      </section>

      {/* Promotional Banner with Gradient and Shadow */}
      <section className="max-w-7xl mx-auto my-20 px-6">
        <div className="relative rounded-3xl bg-gradient-to-r from-primary via-purple-600 to-pink-600 p-16 text-center shadow-2xl text-white overflow-hidden">
          {/* Decorative circles */}
          <span className="absolute -top-10 -left-10 w-40 h-40 bg-pink-400 opacity-30 rounded-full filter blur-3xl animate-pulse"></span>
          <span className="absolute -bottom-10 -right-10 w-60 h-60 bg-indigo-400 opacity-20 rounded-full filter blur-3xl animate-pulse animation-delay-1000"></span>

          <h2 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            Summer Sale - Up to 50% Off!
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 drop-shadow-md">
            Refresh your wardrobe with amazing deals on all summer essentials.
          </p>
          <button
            onClick={handleShopSaleClick}
            className="bg-white text-primary font-bold py-4 px-12 rounded-full hover:bg-gray-100 transition-transform hover:scale-105 shadow-lg"
          >
            Shop the Sale
          </button>
        </div>
      </section>
    </main>
  );
}
