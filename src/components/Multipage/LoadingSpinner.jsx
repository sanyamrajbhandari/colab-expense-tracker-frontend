import React from "react";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full animate-in fade-in duration-500">
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        {/* Spinning Ring */}
        <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        {/* Inner Pulse */}
        <div className="absolute inset-4 bg-blue-400/20 rounded-full animate-pulse"></div>
      </div>
      <p className="mt-6 text-gray-400 text-sm font-medium tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
