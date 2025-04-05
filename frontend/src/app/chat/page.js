"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes

export default function ChatPage() {
    const [messages, setMessages] = useState([
        { text: "Hello! How can I assist you today?", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(true);

    const logoutTimer = useRef(null);
    const chatEndRef = useRef(null);
    const router = useRouter();

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const resetTimer = () => {
        clearTimeout(logoutTimer.current);
        logoutTimer.current = setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            alert("You have been logged out due to inactivity.");
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
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const email = localStorage.getItem("email");
        if (!email) {
            alert("User email not found. Please login again.");
            router.push("/login");
            return;
        }

        const userMessage = { text: input, sender: "user" };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setHistory((prev) => [...prev, userMessage]);
        setInput("");

        try {
            const res = await axios.post(`${API_BASE_URL}/chat`, {
                email,
                message: input.trim(),
            });
            const botReply = { text: res.data.response, sender: "bot" };
            setMessages((prev) => [...prev, botReply]);
            setHistory((prev) => [...prev, botReply]);
        } catch (error) {
            const errorReply = { text: "Error fetching response.", sender: "bot" };
            setMessages((prev) => [...prev, errorReply]);
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-900 to-black text-white">
            {/* Chat History Panel */}
            <div className={`transition-all duration-300 ${isHistoryOpen ? "w-1/4" : "w-0"} overflow-hidden bg-gray-800 p-4`}>
                <button
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                    className="text-white text-sm mb-2"
                >
                    {isHistoryOpen ? "Close ◀" : "Open ▶"}
                </button>
                {isHistoryOpen && (
                    <div className="overflow-y-auto h-full pr-2">
                        <h2 className="text-white text-lg font-semibold mb-2">Chat History</h2>
                        {history.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-2 my-2 rounded-lg text-sm shadow ${
                                    msg.sender === "user" ? "bg-blue-500 text-right" : "bg-gray-700"
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Chat Panel */}
            <div className="flex-1 flex flex-col">
                <div className="p-4 text-center text-xl font-bold bg-gray-800 shadow">CHAT UI</div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`max-w-lg px-4 py-2 rounded-xl text-sm shadow ${
                                msg.sender === "user"
                                    ? "ml-auto bg-blue-600 text-white text-right"
                                    : "mr-auto bg-gray-700 text-left"
                            }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-4 bg-gray-800 flex items-center">
                    <input
                        className="flex-1 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        className="ml-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                        onClick={sendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
