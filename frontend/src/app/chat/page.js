"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function ChatPage() {
    const [messages, setMessages] = useState([{ text: "Hello! How can I assist you today?", sender: "bot" }]);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(true);
    const router = useRouter();

    let logoutTimer;

    // Function to reset the inactivity timer
    const resetTimer = () => {
        clearTimeout(logoutTimer);
        logoutTimer = setTimeout(() => {
            logoutUser();
        }, INACTIVITY_LIMIT);
    };

    // Function to log out user
    const logoutUser = () => {
        localStorage.removeItem("token"); // Remove token
        alert("You have been logged out due to inactivity.");
        router.push("/login"); // Redirect to login page
    };

    // Detect user interactions and reset timer
    useEffect(() => {
        resetTimer(); // Start timer initially
        document.addEventListener("mousemove", resetTimer);
        document.addEventListener("keydown", resetTimer);
        document.addEventListener("click", resetTimer);

        return () => {
            clearTimeout(logoutTimer);
            document.removeEventListener("mousemove", resetTimer);
            document.removeEventListener("keydown", resetTimer);
            document.removeEventListener("click", resetTimer);
        };
    }, []);

    // Send user message
    const sendMessage = async () => {
        if (!input.trim()) return;
        const newMessages = [...messages, { text: input, sender: "user" }];
        setMessages(newMessages);
        setHistory([...history, { text: input, sender: "user" }]);
        setInput("");

        try {
            const res = await axios.post(`${API_BASE_URL}/chat`, { message: input });
            setMessages([...newMessages, { text: res.data.response, sender: "bot" }]);
            setHistory([...history, { text: res.data.response, sender: "bot" }]);
        } catch (error) {
            setMessages([...newMessages, { text: "Error fetching response.", sender: "bot" }]);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Chat History Panel */}
            <div className={`bg-gray-800 p-4 transition-all duration-300 ${isHistoryOpen ? "w-1/5" : "w-0"} overflow-hidden`}>
                <button onClick={() => setIsHistoryOpen(!isHistoryOpen)} className="text-white mb-4">
                    {isHistoryOpen ? "Close ◀" : "Open ▶"}
                </button>
                {isHistoryOpen && (
                    <div className="overflow-y-auto h-full">
                        <h2 className="text-white text-lg font-semibold">Chat History</h2>
                        {history.map((msg, index) => (
                            <div key={index} className={`p-2 my-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500" : "bg-gray-700"} text-white`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Chat Main Panel */}
            <div className="flex-1 flex flex-col bg-gray-900 text-white">
                <div className="p-4 text-center text-xl font-bold bg-gray-800">AI Chat</div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {messages.map((msg, index) => (
                        <div key={index} className={`p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 self-end" : "bg-gray-700 self-start"}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>

                {/* Input Box */}
                <div className="p-4 bg-gray-800 flex">
                    <input 
                        className="flex-1 p-2 rounded-lg bg-gray-700 text-white"
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button className="ml-2 bg-blue-500 p-2 rounded-lg" onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}