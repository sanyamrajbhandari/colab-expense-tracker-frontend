import React, { useState } from "react";
import "../css/Login.css";
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

  const handleLogin = async () => {
    // Empty fields check
    if (email.trim() === "" || password.trim() === "") {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login", // change if needed
        {
          email,
          password,
        },
      );

      // Success
      toast.success(response.data.message || "Login successful!");

      // Optional: store token (if backend sends it)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
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
    <div className="container">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        closeButton={false}
        autoClose={2000}
      />

      <div className="card">
        {/* Logo */}
        <div className="logo-container">
          <div className="logo">
            <IoMdWallet />
          </div>
          <h1>SpendWise</h1>
          <p>Enter your credentials to access your insights</p>
        </div>

        {/* Form */}
        <div className="form">
          {/* Email */}
          <label>Email Address</label>
          <div className="input-group">
            <span className="icon">
              <MdEmail />
            </span>
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="password-header">
            <label>Password</label>
            <span className="forgot">Forgot Password?</span>
          </div>

          <div className="input-group">
            <span className="icon">
              <FaLock />
            </span>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* Remember */}
          <div className="remember">
            <label className="checkbox">
              <input type="checkbox" />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          {/* Button */}
          <button onClick={handleLogin}>Log In →</button>
        </div>

        {/* Signup */}
        <p className="signup">
          New to SpendWise?{" "}
          <span onClick={() => navigate("/signup")}>Create an Account</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
