import React, { useState } from "react";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { IoMdWallet } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (email.trim() === "" || password.trim() === "") {
      alert("Please enter email and password");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      (user) => user.email === email && user.password === password,
    );

    if (foundUser) {
      alert(`Welcome ${foundUser.name}!`);
      navigate("/dashboard");
    } else {
      alert("Account not found. Please sign up first.");
    }
  };

  return (
    <div className="container">
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
