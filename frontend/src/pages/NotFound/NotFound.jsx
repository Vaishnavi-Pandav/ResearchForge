import React from "react";
import { useNavigate, Link } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg transition"
        >
          Home
        </button>
        <Link to="/dashboard" className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition">
          Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
