import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaUser, FaLock, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Signup = () => {
  const [Data, setData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/"); // Redirect if already logged in
    }
  }, [isLoggedIn, navigate]);

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error on new submission
    try {
      if (
        Data.username === "" ||
        Data.email === "" ||
        Data.password === "" ||
        Data.address === ""
      ) {
        setError("All fields are required.");
        return;
      }
      const response = await axios.post(
        "http://localhost:1000/api/v1/sign-up",
        Data
      );
      setData({ username: "", email: "", password: "", address: "" });
      alert(response.data.message); // Keeping alert as per original code, can be replaced with a notification
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row bg-zinc-800 rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        {/* Left Side: Branding and Image */}
        <div className="w-full md:w-1/2 p-8 flex-col items-center justify-center bg-zinc-900 text-white hidden md:flex">
          <h1 className="text-4xl font-bold text-yellow-100">BookHeaven</h1>
          <p className="mt-2 text-zinc-300">Join Our Community of Readers</p>
          <img
            src="/hero.png" // Using the hero image for consistency
            alt="Book illustration"
            className="mt-8 w-48 h-48 object-cover"
          />
        </div>

        {/* Right Side: Signup Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-zinc-100 mb-6 text-center">Create an Account</h2>

          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            {/* Username */}
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUser className="text-zinc-400" />
              </span>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 bg-zinc-700 text-zinc-100 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-100"
                placeholder="Username"
                name="username"
                required
                value={Data.username}
                onChange={change}
              />
            </div>
            {/* Email */}
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaEnvelope className="text-zinc-400" />
              </span>
              <input
                type="email"
                className="w-full pl-10 pr-3 py-2 bg-zinc-700 text-zinc-100 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-100"
                placeholder="Email"
                name="email"
                required
                value={Data.email}
                onChange={change}
              />
            </div>
            {/* Password */}
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLock className="text-zinc-400" />
              </span>
              <input
                type="password"
                className="w-full pl-10 pr-3 py-2 bg-zinc-700 text-zinc-100 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-100"
                placeholder="Password"
                name="password"
                required
                value={Data.password}
                onChange={change}
              />
            </div>
            {/* Address */}
            <div className="relative mb-6">
               <span className="absolute top-3 left-0 flex items-center pl-3">
                <FaMapMarkerAlt className="text-zinc-400" />
              </span>
              <textarea
                className="w-full pl-10 pr-3 py-2 bg-zinc-700 text-zinc-100 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-100"
                rows="3"
                placeholder="Address"
                name="address"
                required
                value={Data.address}
                onChange={change}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-yellow-100 text-zinc-900 font-bold py-2 rounded-lg hover:bg-yellow-200 transition-all duration-300"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-zinc-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-yellow-100 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
