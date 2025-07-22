import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import Title from "../components/Title";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const initialFilters = {
    brand: "",
    category: "",
    discounted: false,
    minPrice: 0,
    maxPrice: 2000,
    page: 1,
    limit: 9,
  };

  const [filters, setFilters] = useState(initialFilters);

  const fetchProducts = async (customFilters = filters) => {
    setLoading(true);
    try {
      const params = { ...customFilters };

      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === 0 || params[key] === false) {
          delete params[key];
        }
      });

      if (searchTerm) {
        params.q = searchTerm;
      }

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`, {
        params,
      });

      const activeProducts = res.data.data.filter((p) => p.isActive === true);

      setProducts(activeProducts || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/products/categories`),
          axios.get(`${process.env.REACT_APP_API_URL}/products/brands`),
        ]);
        setCategories(categoriesRes.data || []);
        setBrands(brandsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch categories or brands:", err);
      }
    };

    fetchCategoriesAndBrands();
  }, []);

  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    setFilters({
      category: params.category || "",
      brand: params.brand || "",
      minPrice: params.minPrice ? Number(params.minPrice) : 0,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : 2000,
      page: params.page ? Number(params.page) : 1,
      limit: params.limit ? Number(params.limit) : 9,
      discounted: params.discounted === "true",
    });
  }, [searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filters, searchTerm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    const updatedFilters = { ...filters, [name]: val };
    if (name !== "page") updatedFilters.page = 1;

    setFilters(updatedFilters);

    const updatedParams = new URLSearchParams(searchParams);
    if (val && val !== "" && val !== 0 && val !== false) {
      updatedParams.set(name, val);
    } else {
      updatedParams.delete(name);
    }

    setSearchParams(updatedParams);
  };

  return (
    <div className="min-h-screen px-4 py-20 max-w-7xl mx-auto">
      <Title
        title="Shop All Products"
        subtitle="Explore our full range of items and find your perfect match."
      />


      {/* Toggle Filters */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
          <span>Filter</span>
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-12 border border-gray-100 transition-all duration-300 transform hover:shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
            Filter Products
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search Input */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Products
              </label>
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                onChange={handleChange}
                value={filters.category}
                className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              >
                <option value="">All Categories</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <select
                name="brand"
                onChange={handleChange}
                value={filters.brand}
                className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              >
                <option value="">All Brands</option>
                {brands.map((brand, index) => (
                  <option key={index} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Discounted Toggle Button */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount
              </label>
              <button
                onClick={() =>
                  setFilters((prev) => {
                    const newDiscounted = !prev.discounted;
                    const updatedParams = new URLSearchParams(searchParams);

                    if (newDiscounted) {
                      updatedParams.set("discounted", "true");
                    } else {
                      updatedParams.delete("discounted");
                    }

                    setSearchParams(updatedParams);

                    return {
                      ...prev,
                      discounted: newDiscounted,
                      page: 1,
                    };
                  })
                }
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filters.discounted
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {filters.discounted ? "Only Discounted" : "Show All Prices"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-pulse">
            Discovering Products...
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
              >
                {/* Image Placeholder */}
                <div className="w-full h-60 bg-gray-200 animate-pulse"></div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  {/* Title */}
                  <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>

                  {/* Price & Old Price */}
                  <div className="flex items-center space-x-2">
                    <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse opacity-70"></div>
                  </div>

                  {/* Category & Brand */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/5 animate-pulse"></div>
                  </div>

                  {/* Button Placeholder */}
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" style={{ opacity: loading ? 0.5 : 1 }}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products found.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-10 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${filters.page === i + 1
              ? "bg-primary text-white"
              : "bg-white border hover:bg-gray-100"
              }`}
            onClick={() => setFilters((prev) => ({ ...prev, page: i + 1 }))}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Shop;
