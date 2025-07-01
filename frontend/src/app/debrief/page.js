"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { AiOutlineHome, AiOutlineLogout } from "react-icons/ai";

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
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Background Image */}
      <img
        src="/ai-bg.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80"></div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full px-10 py-4 flex justify-between items-center z-20 text-white">
        <div className="text-2xl font-bold tracking-wider">Aletheia</div>
        <div className="flex space-x-6 text-lg font-medium">
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
        className="relative z-10 max-w-3xl w-full p-10 bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-green-500/20 transition duration-500"
        data-aos="zoom-in"
      >
        <h2 className="text-4xl font-bold mb-4 text-center drop-shadow-lg">
          Thank You!
        </h2>
        <p className="text-lg mb-4 text-center">
          We appreciate your participation in this study.
        </p>

        <div className="text-left space-y-4 text-sm">
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
            Since the Questor chatbot may have introduced deliberate errors as
            part of the study, we have provided the correct answers to the
            questions below for your reference:
          </p>

          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Question 1:</strong> The Sykes-Picot Agreement of 1916
              divided Ottoman lands between which two powers? <br />
              <span className="text-green-400">Answer: Britain and France</span>
            </li>
            <li>
              <strong>Question 2:</strong> Which of the following sets is not a
              group under addition? Integers, real numbers, or natural numbers? <br />
              <span className="text-green-400">Answer: Natural numbers</span>
            </li>
            <li>
              <strong>Question 3:</strong> If a non-Hermitian operator has real
              eigenvalues, what specific symmetry may be present? <br />
              <span className="text-green-400">
                Answer: It may possess PT-symmetry (parity-time symmetry)
              </span>
            </li>
          </ul>

          <p>
            If you have any questions about this study, please contact us at{" "}
            <span className="text-blue-400">@email</span>.
          </p>

          <p>
            Additional resources on the trustworthiness of AI chatbots can be
            found here:{" "}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              links
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
