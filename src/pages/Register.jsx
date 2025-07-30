import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    countryCode: "+2",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const fullPhone = formData.countryCode + formData.phone;

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          username: formData.username,
          phone: fullPhone,
          email: formData.email,
          password: formData.password,
        }
      );

      setSuccessMessage(res.data.message);
      setFormData({ username: "", phone: "", countryCode: "+2", email: "", password: "" });

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      console.log(err);
    }
  };

  return (
    <div className="py-20 flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">
          Create Account
        </h2>
        {successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {!successMessage && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter Your first & last name"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="border rounded-md p-2 bg-white"
                >
                  <option value="+2">+2 (EG)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+91">+91 (IN)</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  placeholder="012xxxxxxxx"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">An email verification link will be sent.</p>
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
              disabled={!!successMessage}
            >
              Register
            </button>
          </form>
        )}
        <p className="text-center mt-3">
          I have an account!{" "}
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </p>
        {successMessage && (
          <p className="text-center mt-2 text-sm text-gray-600">
            Please check your email inbox (and spam folder) for the verification link.
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;