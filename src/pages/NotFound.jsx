// src/pages/NotFound.jsx

import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6 py-20 text-white">
      <div className="text-center max-w-xl">
        <h1 className="text-8xl font-bold tracking-tight mb-4">404</h1>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
          Page Not Found
        </h2>
        <p className="mb-8 text-lg sm:text-xl opacity-90">
          Sorry, the page you're looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-indigo-100 transition duration-300 ease-in-out"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
