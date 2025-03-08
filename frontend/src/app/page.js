"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function Home() {
    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        fetch(`${API_BASE_URL}/`)
            .then((response) => response.json())
            .then((data) => setMessage(data.message))
            .catch(() => setMessage("Error fetching data"));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome to LLM Chat</h1>
                <p className="text-gray-400 mb-6">{message}</p>

                <p className="text-lg font-semibold mb-4">Join us today:</p>
                <div className="flex flex-col space-y-4">
                    <Link href="/signup">
                        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg shadow-md transition">Sign Up</button>
                    </Link>
                    <Link href="/login">
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg shadow-md transition">Login</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
