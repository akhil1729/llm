"use client";

import { useEffect, useState } from "react";

/*const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";*/
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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>FastAPI Response:</h1>
      <p>{message}</p>
    </div>
  );
}
