import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdWallet } from "react-icons/io";
import { FiEye, FiEyeOff } from "react-icons/fi";

// Axios - used to send HTTP POST request to the signup API
import axios from "axios";

// Toast - used to show success/error notifications without page alerts
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate(); // useNavigate hook — used to redirect user to dashboard after successful signup
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const extractToken = (payload) =>
    payload?.token ||
    payload?.data?.token ||
    payload?.data?.accessToken ||
    null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //HANDLER - Input Change
  // Uses computed property [e.target.name] to dynamically update the correct
  // field in formData without needing a separate handler for each input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    // Password match check
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Password strength check
    const isWeak =
      password.length < 6 || !/[A-Z]/.test(password) || !/[0-9]/.test(password);

    if (isWeak) {
      toast.error(
        "Password must have at least 6 characters, 1 uppercase letter, and 1 number",
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup", // change if needed
        {
          fullName: name,
          email,
          password, // backend will hash it
        },
      );

      // Success
      toast.success(
        response.data.message || "Signup successful! Logging you in...",
      );

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
        // backend sent error
        toast.error(error.response.data.message || "Signup failed");
      } else if (error.request) {
        // no response from server
        toast.error("Server not responding");
      } else {
        // other error
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-8 bg-[radial-gradient(circle_at_top,#0b0f2a,#020617)] text-white">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="w-full max-w-[360px] p-8 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-white/5 shadow-2xl">
        <div className="w-12 h-12 bg-indigo-500 text-white rounded-xl flex items-center justify-center mx-auto mb-4 text-xl shadow-lg shadow-indigo-500/20">
          <IoMdWallet />
        </div>

        <h1 className="text-2xl font-bold text-center text-white mb-1">
          SpendWise
        </h1>
        <p className="text-center text-xs text-slate-400 mb-6">
          Join SpendWise and Track Where Your Money Goes.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-4 mb-1.5">
            FULL NAME
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-800 rounded-lg text-white border border-slate-700 focus:outline-none focus:border-indigo-500 text-sm placeholder-slate-500"
            required
          />

          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-4 mb-1.5">
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-800 rounded-lg text-white border border-slate-700 focus:outline-none focus:border-indigo-500 text-sm placeholder-slate-500"
            required
          />

          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-4 mb-1.5">
            PASSWORD
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Your Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 pr-10 bg-slate-800 rounded-lg text-white border border-slate-700 focus:outline-none focus:border-indigo-500 text-sm placeholder-slate-500"
              required
            />

            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-300 text-lg flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-4 mb-1.5">
            CONFIRM PASSWORD
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-800 rounded-lg text-white border border-slate-700 focus:outline-none focus:border-indigo-500 text-sm placeholder-slate-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full font-bold text-sm hover:-translate-y-0.5 transition-all shadow-md shadow-indigo-500/20 mt-6 cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{" "}
          <span
            className="text-indigo-400 cursor-pointer font-semibold hover:underline"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
