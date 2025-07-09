"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import DOMPurify from "dompurify"; // Make sure to install this: npm install dompurify

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 min

export default function Task3Page() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [finalAnswer, setFinalAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const router = useRouter();
  const logoutTimer = useRef(null);

  const taskTitle = "Physics / Quantum Mechanics";
  const taskDescription = "If a non-Hermitian operator has real eigenvalues, what specific symmetry may be present?";

  const resetTimer = () => {
    clearTimeout(logoutTimer.current);
    logoutTimer.current = setTimeout(() => {
      localStorage.clear();
      alert("⏳ You have been logged out due to inactivity.");
      router.push("/login");
    }, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    resetTimer();
    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keydown", resetTimer);
    document.addEventListener("click", resetTimer);
    return () => {
      clearTimeout(logoutTimer.current);
      document.removeEventListener("mousemove", resetTimer);
      document.removeEventListener("keydown", resetTimer);
      document.removeEventListener("click", resetTimer);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const email = localStorage.getItem("email");
    if (!email) {
      alert("Please login again.");
      router.push("/login");
      return;
    }

    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/chat`, {
        email,
        message: input.trim(),
        task_number: 3
      });
      const botReply = { text: res.data.response, sender: "bot" };
      setMessages(prev => [...prev, botReply]);
    } catch {
      setMessages(prev => [...prev, { text: "❌ Error fetching response.", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitFinalAnswer = async () => {
  if (!finalAnswer.trim()) {
    alert("Please enter your final answer before submitting.");
    return;
  }
  const email = localStorage.getItem("email");
  if (!email) {
    alert("User email not found. Please login again.");
    router.push("/login");
    return;
  }

  try {
    await axios.post(`${API_BASE_URL}/finalanswer`, {
      email,
      task_number: 3, // Keep constant per task file
      final_answer: finalAnswer.trim(),
    });

    const taskOrder = JSON.parse(localStorage.getItem("taskOrder"));
const currentPath = window.location.pathname;
const currentIndex = taskOrder.findIndex((p) => p === currentPath);
const nextPath = taskOrder[currentIndex + 1] || "/survey";
router.push(nextPath);

  } catch (error) {
    console.error("Error submitting final answer:", error);
    alert("❌ Failed to save final answer. Please try again.");
  }
};


  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <div className="flex justify-between items-center px-6 py-4 bg-gray-900 shadow-md sticky top-0 z-20">
        <h1 className="text-xl font-bold text-cyan-300">Aletheia</h1>
        <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
          <Image src="/google.svg" alt="Google" width={256} height={256} className="cursor-pointer" />
        </a>
      </div>

      <div className="text-center bg-gray-800 py-2 shadow-inner sticky top-[64px] z-10">
        <h2 className="text-md font-semibold text-lime-400">{taskTitle}</h2>
        <p className="text-sm text-gray-300 mt-1">{taskDescription}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`w-full flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-3xl px-5 py-3 rounded-2xl shadow-sm leading-relaxed break-words ${
                msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"
              } prose prose-invert`}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.text) }}
            />
          </div>
        ))}
        {isLoading && <div className="text-sm text-gray-400 animate-pulse">✨ Aletheia is typing...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="px-4 py-3 bg-gray-900 border-t border-gray-700 flex items-center sticky bottom-[60px] z-10">
        <input
          type="text"
          placeholder="Chat with Alethia to find the answer to the question..."
          className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className={`ml-3 px-4 py-2 rounded-lg text-white font-semibold transition ${
            isLoading ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>

      <div className="px-4 py-3 bg-gray-950 flex gap-2 items-center border-t border-gray-800 sticky bottom-0 z-10">
        <input
          className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          type="text"
          placeholder="Submit your final answer..."
          value={finalAnswer}
          onChange={(e) => setFinalAnswer(e.target.value)}
        />
        <button
          onClick={handleSubmitFinalAnswer}
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md text-white font-bold"
        >
          Submit Final Answer
        </button>
      </div>
    </div>
  );
}
