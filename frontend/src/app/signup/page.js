"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { AiOutlineUserAdd, AiOutlineHome, AiOutlineLogin } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";
import ClientSearchParams from "@/components/ClientSearchParams";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [redirected, setRedirected] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, formData);
      setSuccess(true);
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white bg-black overflow-hidden">
      {/* Background Image */}
      <img
        src="/ai-bg.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80"></div>

      {/* Toast */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar theme="dark" />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full px-10 py-4 flex justify-between items-center z-20 text-white">
        <div className="text-2xl font-bold tracking-wider">Aletheia</div>
        <div className="flex space-x-6 text-lg font-medium">
          <Link href="/" className="hover:text-pink-400 flex items-center gap-1">
            <AiOutlineHome /> Home
          </Link>
          <Link href="/signup" className="hover:text-pink-400 flex items-center gap-1">
            <AiOutlineUserAdd /> Sign Up
          </Link>
          <Link href="/login" className="hover:text-pink-400 flex items-center gap-1">
            <AiOutlineLogin /> Login
          </Link>
        </div>
      </nav>

      {/* SearchParams logic in Suspense */}
      <ClientSearchParams
        onParams={(params) => {
          const redirectedParam = params.get("redirected");
          if (redirectedParam) {
            setRedirected(redirectedParam);
            toast.warning("You must be logged in to access that page.", { theme: "dark" });
          }
        }}
      />

      {/* Form Card */}
      <div
        className="relative z-10 max-w-md w-full p-10 bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-pink-500/20 transition duration-500"
        data-aos="zoom-in"
      >
        <h4 className="text-4xl font-bold text-center mb-6 drop-shadow-lg">Create Your Account</h4>

        {error && <p className="text-red-400 text-center mb-3">{error}</p>}
        {success && (
          <p className="text-green-400 text-center mb-3">
            Signup successful! Please{" "}
            <Link href="/login" className="text-blue-400 underline">Login</Link>.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg shadow-lg transition text-lg font-semibold"
          >
            <AiOutlineUserAdd className="text-xl" />
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
