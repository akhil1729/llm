"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineHome } from "react-icons/ai";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SurveyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    trust_answers: "",
    verify_needed: "",
    comfort_communication: "",
    reuse_chatbot: "",
    comments: "",
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("email");
    if (!email) {
      toast.error("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/survey`, {
        email,
        ...form,
      });
      toast.success("✅ Survey submitted!");
      setTimeout(() => {
        router.push("/debrief");
      }, 1000);
    } catch (error) {
      console.error("Survey submission error:", error);
      toast.error("Failed to submit survey. Please try again.");
    }
  };

  const options = [
    "Strongly Disagree",
    "Somewhat Disagree",
    "Neutral",
    "Somewhat Agree",
    "Strongly Agree",
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white bg-black overflow-hidden px-4 sm:px-8">
      {/* Background Image */}
      <img
        src="/ai-bg.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80" />

      {/* Toast */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar theme="dark" />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full px-4 sm:px-8 md:px-10 py-4 flex flex-wrap justify-between items-center z-20 text-white">
        <div className="text-2xl font-bold tracking-wider">Aletheia</div>
        <div className="flex flex-wrap gap-4 text-sm sm:text-lg font-medium mt-2 sm:mt-0">
          <Link href="/" className="hover:text-pink-400 flex items-center gap-1">
            <AiOutlineHome /> Home
          </Link>
        </div>
      </nav>

      {/* Survey Card */}
      <div
        className="relative z-10 w-full max-w-4xl p-6 sm:p-8 md:p-10 bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-green-500/20 transition duration-500 mt-24 mb-10"
        data-aos="zoom-in"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center drop-shadow-lg">Exit Survey</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm sm:text-base text-gray-300 mb-2">
            Based on your experience performing the tasks using Aletheia, please indicate how much you agree with the following statements:
          </p>

          {[
            { label: "I trust the answers I received from Aletheia", name: "trust_answers" },
            { label: "I felt that I needed to verify the accuracy of the answers received from Aletheia", name: "verify_needed" },
            { label: "I feel comfortable with the way Aletheia communicates with me", name: "comfort_communication" },
            { label: "I will use Aletheia again if it is available", name: "reuse_chatbot" },
          ].map((q) => (
            <div key={q.name} className="space-y-1">
              <span className="block font-medium mb-1">{q.label}</span>
              <div className="flex flex-wrap justify-between gap-2 bg-gray-900 p-3 rounded-lg">
                {options.map((opt) => (
                  <label key={opt} className="flex flex-col items-center text-xs sm:text-sm space-y-1 w-[48%] sm:w-auto">
                    <input
                      type="radio"
                      name={q.name}
                      value={opt}
                      required
                      onChange={handleChange}
                      className="accent-green-500"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <label className="block">
            <span className="font-medium">Additional comments (optional)</span>
            <textarea
              name="comments"
              onChange={handleChange}
              className="w-full p-3 mt-1 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="3"
            />
          </label>

          <button
            type="submit"
            className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 py-3 rounded-lg text-white font-bold shadow-lg transition"
          >
            Submit Survey
          </button>
        </form>
      </div>
    </div>
  );
}
