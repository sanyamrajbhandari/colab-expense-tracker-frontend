import React, { useState } from "react";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";
import { FaWallet, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container">
      <div className="card">
        <div className="logo-container">
          <div className="logo">
            <FaWallet />
          </div>
          <h1>SpendWise</h1>
          <p>Enter your credentials to access your insights</p>
        </div>

        <div className="form">
          {/* Email */}
          <label>Email Address</label>
          <div className="input-group">
            <span className="icon">
              <MdEmail />
            </span>
            <input type="email" placeholder="Enter you email" />
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
          <button onClick={() => navigate("/dashboard")}>Log In →</button>
        </div>

        <p className="signup">
          New to SpendWise?{" "}
          <span onClick={() => navigate("/signup")}>Create an Account</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
