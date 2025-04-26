"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

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
                    // User has not filled demographics yet
                    router.push("/demographics");
                } else {
                    setError("Error checking demographics.");
                }
            }
        
        } catch (err) {
            setError("Invalid credentials");
        }
        
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
                {error && <p className="text-red-400 text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 mb-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 mb-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg shadow-md transition"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center mt-4 text-gray-300">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-blue-400 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
