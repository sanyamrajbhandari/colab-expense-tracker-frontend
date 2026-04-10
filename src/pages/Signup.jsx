import React, { useState } from "react";
import "../css/Signup.css";
import { useNavigate } from "react-router-dom";
import { IoMdWallet } from "react-icons/io";
import { FiEye, FiEyeOff } from "react-icons/fi";

// Axios
import axios from "axios";

// Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

      // Store token if backend sends it upon signup
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
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
    <div className="container">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="card signup-card">
        <div className="logo">
          <IoMdWallet />
        </div>

        <h1 className="title">SpendWise</h1>
        <p className="subtitle">
          Join SpendWise and Track Where Your Money Goes.
        </p>

        <form onSubmit={handleSubmit}>
          <label>FULL NAME</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>EMAIL ADDRESS</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>PASSWORD</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Your Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <span
              className="eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <label>CONFIRM PASSWORD</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn">
            Sign Up
          </button>
        </form>

        <p className="footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Log in</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
