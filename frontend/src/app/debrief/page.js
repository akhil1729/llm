"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { AiOutlineHome, AiOutlineLogout } from "react-icons/ai";
import { FaYoutube, FaMedium } from "react-icons/fa";
import { BsFileEarmarkText } from "react-icons/bs";

export default function DebriefPage() {
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden px-4 sm:px-8">
      {/* Background Image */}
      <img
        src="/ai-bg.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80"></div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full px-4 sm:px-8 md:px-10 py-4 flex flex-wrap justify-between items-center z-20 text-white">
        <div className="text-2xl font-bold tracking-wider">Aletheia</div>
        <div className="flex flex-wrap gap-4 text-sm sm:text-lg font-medium mt-2 sm:mt-0">
          <Link href="/" className="hover:text-pink-400 flex items-center gap-1">
            <AiOutlineHome /> Home
          </Link>
          <button
            onClick={handleLogout}
            className="hover:text-pink-400 flex items-center gap-1"
          >
            <AiOutlineLogout /> Logout
          </button>
        </div>
      </nav>

      {/* Debrief Card */}
      <div
        className="relative z-10 w-full max-w-3xl p-6 sm:p-8 md:p-10 bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-green-500/20 transition duration-500 mt-24 mb-10"
        data-aos="zoom-in"
      >
        <h2 className="text-2xl sm:text-4xl font-bold mb-4 text-center drop-shadow-lg">
          Thank You!
        </h2>
        <p className="text-base sm:text-lg mb-6 text-center">
          We appreciate your participation in this study.
        </p>

        <div className="text-justify space-y-6 text-sm sm:text-base text-gray-200 leading-relaxed">
          <p>
            <strong>The goal of this study</strong> is to understand how people
            interact with AI assistants such as ChatGPT, Gemini, and others,
            particularly in cases where the assistants generate hallucinated
            responses (responses that appear credible but are factually
            incorrect). We also examine whether changes in the information
            presentation style influence one’s acceptance of these hallucinated
            responses.
          </p>

          <p>
            Since Aletheia may have introduced deliberate errors as part of the
            study, we have provided the correct answers to the questions below
            for your reference:
          </p>

          {/* Styled Answer Cards */}
          <div className="space-y-4">
            <div className="bg-black/40 p-4 rounded-lg border-l-4 border-green-400 shadow-inner">
              <p className="font-semibold text-white mb-1">
                <strong>Question:</strong> The Sykes-Picot Agreement of 1916
                divided Ottoman lands between which two powers?
              </p>
              <p className="text-green-400">Answer: Britain and France</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border-l-4 border-green-400 shadow-inner">
              <p className="font-semibold text-white mb-1">
                <strong>Question:</strong> Which of the following sets is not a
                group under addition? Integers, real numbers, or natural
                numbers?
              </p>
              <p className="text-green-400">Answer: Natural numbers</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border-l-4 border-green-400 shadow-inner">
              <p className="font-semibold text-white mb-1">
                <strong>Question:</strong> If a non-Hermitian operator has real
                eigenvalues, what specific symmetry may be present?
              </p>
              <p className="text-green-400">
                Answer: It may possess PT-symmetry (parity-time symmetry)
              </p>
            </div>
          </div>

          <p>
            If you have any questions about this study, please contact us at{" "}
            <span className="text-blue-400 underline">shimei@umbc.edu</span> or{" "}
            <span className="text-blue-400 underline">cuma1@umbc.edu</span>.
          </p>

          <p className="mt-4">
            📚 Additional resources on the trustworthiness of AI Assistants:
          </p>

          <ul className="space-y-3 mt-2">
            <li className="flex items-center gap-3">
              <FaYoutube className="text-red-500 text-xl" />
              <a
                href="https://www.youtube.com/watch?v=cfqtFvWOfg0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline hover:text-blue-300 transition"
              >
                Understanding Hallucinations in LLMs – YouTube
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FaMedium className="text-white text-xl" />
              <a
                href="https://medium.com/@nirdiamant21/llm-hallucinations-explained-8c76cdd82532"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline hover:text-blue-300 transition"
              >
                LLM Hallucinations Explained – Medium Article
              </a>
            </li>
            <li className="flex items-center gap-3">
              <BsFileEarmarkText className="text-white text-xl" />
              <a
                href="https://dl.acm.org/doi/pdf/10.1145/3703155"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline hover:text-blue-300 transition"
              >
                ACM Research Paper on LLM Hallucinations
              </a>
            </li>
          </ul>

          {/* Creative Closing Note */}
          <div className="mt-10 text-center">
            <p className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-red-400 via-red-400 to-red-400 bg-clip-text text-transparent drop-shadow-md animate-pulse">
               You can now logout or exit the study 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
