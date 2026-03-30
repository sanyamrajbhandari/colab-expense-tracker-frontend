import React from "react";

const Signup = ({ switchToLogin }) => {
  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Create Account</h1>
        <p className="subtitle">Sign up to get started</p>

        <input type="text" placeholder="Full Name" className="input" />
        <input type="email" placeholder="Email address" className="input" />
        <input type="password" placeholder="Password" className="input" />

        <button className="btn">Sign Up →</button>

        <p className="footer">
          Already have an account?{" "}
          <span onClick={switchToLogin}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;