"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SurveyPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        satisfaction: "",
        ease_of_use: "",
        trustworthiness: "",
        comments: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = localStorage.getItem("email");
        if (!email) {
            alert("Session expired. Please login again.");
            router.push("/login");
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/survey`, {
                email,
                ...form,
            });
            router.push("/thankyou");
        } catch (error) {
            console.error("Survey submission error:", error);
            alert("Failed to submit survey. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-xl">
                <h2 className="text-3xl font-bold mb-6 text-center">User Experience Survey</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block">
                        <span>Overall satisfaction with the AI responses (1-5)</span>
                        <input
                            name="satisfaction"
                            type="number"
                            min="1"
                            max="5"
                            required
                            onChange={handleChange}
                            className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
                        />
                    </label>

                    <label className="block">
                        <span>Ease of using the interface (1-5)</span>
                        <input
                            name="ease_of_use"
                            type="number"
                            min="1"
                            max="5"
                            required
                            onChange={handleChange}
                            className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
                        />
                    </label>

                    <label className="block">
                        <span>Trustworthiness of AI responses (1-5)</span>
                        <input
                            name="trustworthiness"
                            type="number"
                            min="1"
                            max="5"
                            required
                            onChange={handleChange}
                            className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
                        />
                    </label>

                    <label className="block">
                        <span>Additional comments (optional)</span>
                        <textarea
                            name="comments"
                            onChange={handleChange}
                            className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
                            rows="3"
                        />
                    </label>

                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-3 rounded text-white font-bold">
                        Submit Survey
                    </button>
                </form>
            </div>
        </div>
    );
}
