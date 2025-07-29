import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    countryCode: "+2",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isUsingPhone, setIsUsingPhone] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let loginIdentifier = formData.identifier;

      if (isUsingPhone) {
        loginIdentifier = formData.countryCode + formData.identifier;
      }

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          identifier: loginIdentifier,
          password: formData.password,
        }
      );

      Cookies.set("token", res.data.token, { expires: 7 });
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      console.log(err);
    }
  };

  return (
    <div className="py-20 flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">
          Login to Your Account
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* <div className="flex items-center justify-center mb-4">
          <button
            type="button"
            onClick={() => setIsUsingPhone(true)}
            className={`px-4 py-2 rounded-l-md ${isUsingPhone ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Phone
          </button>
          <button
            type="button"
            onClick={() => setIsUsingPhone(false)}
            className={`px-4 py-2 rounded-r-md ${!isUsingPhone ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Email
          </button>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {/* {isUsingPhone ? "Phone" : "Email"} */}
              Email
            </label>
            {!isUsingPhone && (
              <input
                type="email"
                name="identifier"
                placeholder="you@example.com"
                value={formData.identifier}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Your password here"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-3">
          I don't have an account!{" "}
          <Link to="/register" className="text-primary">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;