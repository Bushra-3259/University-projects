import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { authActions } from "../store/auth";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [Data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null); // State for handling errors
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

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
      if (Data.username === "" || Data.password === "") {
        setError("All fields are required.");
        return;
      }
      const response = await axios.post(
        "http://localhost:1000/api/v1/login", // Corrected endpoint based on typical REST conventions
        Data
      );
      
      // Store user data in localStorage
      localStorage.setItem("id", response.data._id); // Correct
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      // Update Redux state
      dispatch(authActions.login());
      dispatch(authActions.changeRole(response.data.role));
      
      setData({ username: "", password: "" });
      navigate("/profile");

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
        <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center bg-zinc-900 text-white">
          <h1 className="text-4xl font-bold text-yellow-100">BookHeaven</h1>
          <p className="mt-2 text-zinc-300">Welcome Back!</p>
          <img 
            src="/hero.png" // Using the hero image for consistency
            alt="Book illustration" 
            className="mt-8 w-48 h-48 object-cover"
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-zinc-100 mb-6 text-center">Login</h2>
          
          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={submit}>
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

            <div className="relative mb-6">
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

            <div>
              <button
                type="submit"
                className="w-full bg-yellow-100 text-zinc-900 font-bold py-2 rounded-lg hover:bg-yellow-200 transition-all duration-300"
              >
                Log In
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-zinc-400">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-yellow-100 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
