"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { AiOutlineLogin, AiOutlineHome, AiOutlineUserAdd } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);

      try {
        const demoRes = await axios.get(`${API_BASE_URL}/user/demographics/${email}`);
        const demographics = demoRes.data;

        if (demographics?.first_name) {
          router.push("/chat");
        } else {
          router.push("/demographics");
        }
      } catch (err) {
        if (err.response?.status === 404) {
          router.push("/demographics");
        } else {
          toast.error("Error checking demographics.");
        }
      }
    } catch {
      toast.error("Invalid credentials. Please try again.");
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

      {/* Login Form Card */}
      <div
        className="relative z-10 max-w-md w-full p-10 bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-green-500/20 transition duration-500"
        data-aos="zoom-in"
      >
        <h2 className="text-4xl font-bold text-center mb-6 drop-shadow-lg">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow-lg transition text-lg font-semibold"
          >
            <AiOutlineLogin className="text-xl" />
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-gray-300">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-400 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
