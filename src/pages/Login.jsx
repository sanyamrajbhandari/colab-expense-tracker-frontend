import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { IoMdWallet } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";

// Axios
import axios from "axios";

// Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const extractToken = (payload) =>
    payload?.token ||
    payload?.data?.token ||
    payload?.data?.accessToken ||
    null;

  const handleLogin = async () => {
    // Empty fields check
    if (email.trim() === "" || password.trim() === "") {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login", // change if needed
        {
          email,
          password,
        },
      );

      // Success
      toast.success(response.data.message || "Login successful!");

      // Store token from common backend response shapes
      const token = extractToken(response.data);
      if (token) {
        localStorage.setItem("token", token);
      }

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      // Error handling
      if (error.response) {
        toast.error(error.response.data.message || "Login failed");
      } else if (error.request) {
        toast.error("Server not responding");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-8 bg-[radial-gradient(circle_at_top,#0f172a,#020617)] text-white">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        closeButton={false}
        autoClose={2000}
      />

      <div className="w-full max-w-[380px] p-8 sm:p-10 bg-white/5 rounded-2xl backdrop-blur-md shadow-2xl border border-white/10">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-4xl text-indigo-400 mb-3 flex justify-center">
            <IoMdWallet />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">SpendWise</h1>
          <p className="text-xs text-slate-400">
            Enter your credentials to access your insights
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-1">
          {/* Email */}
          <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider font-semibold">
            Email Address
          </label>
          <div className="flex items-center bg-white/5 border border-white/5 rounded-xl px-4 py-3 mb-4 focus-within:border-indigo-400 focus-within:bg-white/10 transition-all">
            <span className="mr-2.5 opacity-70 text-lg flex items-center text-slate-400">
              <MdEmail />
            </span>
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-slate-500"
            />
          </div>

          {/* Password */}
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs text-slate-400 uppercase tracking-wider font-semibold m-0">
              Password
            </label>
            <span className="text-xs text-indigo-400 hover:underline cursor-pointer">
              Forgot Password?
            </span>
          </div>

          <div className="flex items-center bg-white/5 border border-white/5 rounded-xl px-4 py-3 mb-4 focus-within:border-indigo-400 focus-within:bg-white/10 transition-all">
            <span className="mr-2.5 opacity-70 text-lg flex items-center text-slate-400">
              <FaLock />
            </span>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-slate-500"
            />

            <span
              className="ml-2.5 cursor-pointer opacity-70 text-lg flex items-center text-slate-400 hover:text-indigo-400 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* Remember */}
          <div className="mb-4">
            <label className="flex items-center text-xs text-slate-400 gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
              />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          {/* Button */}
          <button
            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-400 text-slate-900 rounded-full font-bold text-sm hover:-translate-y-0.5 hover:opacity-95 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
            onClick={handleLogin}
          >
            Log In →
          </button>
        </div>

        {/* Signup */}
        <p className="mt-6 text-center text-xs text-slate-400">
          New to SpendWise?{" "}
          <span
            className="text-indigo-400 cursor-pointer font-semibold hover:underline"
            onClick={() => navigate("/signup")}
          >
            Create an Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
