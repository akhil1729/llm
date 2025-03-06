"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function Home() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    console.log("API BASE URL:", API_BASE_URL); // Debugging log
    if (!API_BASE_URL) {
      console.error("🚨 API URL is undefined. Check .env.local!");
      setMessage("Error: API URL is undefined.");
      return;
    }

    fetch(`${API_BASE_URL}/`)
      .then((response) => {
        console.log("Response status:", response.status);
        return response.json();
      })
      .then((data) => setMessage(data.message))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setMessage("Error fetching data");
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">WELCOME TO LLMs</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <p className="text-lg font-semibold mb-4">Join us today:</p>
        
        <div className="flex flex-col space-y-4">
          <Link href="/signup">
            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">Sign Up</button>
          </Link>
          <Link href="/login">
            <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
