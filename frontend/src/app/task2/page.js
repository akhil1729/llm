"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes

export default function Task2Page() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [finalAnswer, setFinalAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);
    const router = useRouter();
    const logoutTimer = useRef(null);

    const taskTitle = "Mathematics";
    const taskDescription = "Which of the following sets is not a group under addition? Integers, real numbers, or natural numbers?";

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
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/chat`, {
                email,
                message: input.trim(),
                task_number:2
            });

            const botReply = { text: res.data.response, sender: "bot" };
            setMessages((prev) => [...prev, botReply]);
        } catch (error) {
            setMessages((prev) => [...prev, { text: "❌ Error fetching response.", sender: "bot" }]);
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
                task_number: 2, // Task 2
                final_answer: finalAnswer.trim(),
            });
            router.push("/task3"); // Redirect to Task 3
        } catch (error) {
            console.error("Error submitting final answer:", error);
            alert("❌ Failed to save final answer. Please try again.");
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-gray-800 shadow-md">
                <h1 className="text-xl font-bold">Aletheia</h1>
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
                    <Image src="/google.svg" alt="Google" width={256} height={256} className="cursor-pointer" />
                </a>
            </div>

            {/* Task Info */}
            <div className="px-6 py-4 bg-gray-700 text-center">
                <h2 className="text-lg font-semibold">{taskTitle}</h2>
                <p className="text-sm text-gray-300 mt-1">{taskDescription}</p>
            </div>

            {/* Chat Window */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`max-w-lg px-4 py-2 rounded-xl text-sm shadow ${
                            msg.sender === "user"
                                ? "ml-auto bg-blue-600 text-white text-right"
                                : "mr-auto bg-gray-700 text-left"
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}
                {isLoading && <div className="text-sm text-gray-400 animate-pulse">AI is typing...</div>}
                <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-gray-800 flex items-center">
                <input
                    className="flex-1 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Type your question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    disabled={isLoading}
                />
                <button
                    className={`ml-3 px-4 py-2 rounded-lg text-white ${
                        isLoading ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    onClick={sendMessage}
                    disabled={isLoading}
                >
                    {isLoading ? "..." : "Send"}
                </button>
            </div>

            {/* Final Answer Input */}
            <div className="p-4 bg-gray-900 flex gap-2 justify-center items-center">
                <input
                    className="flex-1 p-3 rounded-lg bg-gray-700 text-white focus:outline-none"
                    type="text"
                    placeholder="Type your final answer..."
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
