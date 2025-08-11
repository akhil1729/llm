"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";
import { AiOutlineHome, AiOutlineLogin } from "react-icons/ai";

export default function InstructionsPage() {
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleContinue = () => {
    const taskMap = {
      1: "/chat",
      2: "/task2",
      3: "/task3",
    };

    const shuffled = [1, 2, 3].sort(() => 0.5 - Math.random());
    const pathOrder = shuffled.map((num) => taskMap[num]);

    localStorage.setItem("taskOrder", JSON.stringify(pathOrder));
    router.push(pathOrder[0]);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white bg-black overflow-hidden px-4 sm:px-8">
      <img
        src="/ai-bg.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80" />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full px-4 sm:px-8 md:px-10 py-4 flex flex-wrap justify-between items-center z-20 text-white">
        <div className="text-2xl font-bold tracking-wider">Aletheia</div>
        <div className="flex flex-wrap gap-4 text-sm sm:text-lg font-medium mt-2 sm:mt-0">
          <a href="/" className="hover:text-pink-400 flex items-center gap-1">
            <AiOutlineHome /> Home
          </a>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="hover:text-pink-400 flex items-center gap-1"
          >
            <AiOutlineLogin /> Logout
          </button>
        </div>
      </nav>

      {/* Instructions Card */}
      <div
        className="relative z-10 w-full max-w-3xl p-6 sm:p-8 md:p-10 bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-green-400/20 transition duration-500 mt-24 mb-10"
        data-aos="fade-up"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Study Instructions</h2>
        <p className="text-base sm:text-lg mb-4 leading-relaxed text-gray-300">
          In this study, you will interact with <strong>Aletheia</strong>, a ChatGPT-like chatbot, to find answers to specific questions. As with ChatGPT, Aletheia's responses may not always be accurate. You may verify the answers with Google if unsure.
        </p>
        <p className="text-base sm:text-lg mb-6 leading-relaxed text-gray-300">
          You will complete <strong>three tasks</strong>. In each task, your goal is to find the correct answer to a question using either Aletheia or Google. On average, the study takes about <strong>20 minutes</strong> to complete.
        </p>
        <button
          onClick={handleContinue}
          className="w-full py-3 rounded font-bold text-white bg-green-500 hover:bg-green-600 transition duration-300"
        >
          Continue to Task
        </button>
      </div>
    </div>
  );
}
