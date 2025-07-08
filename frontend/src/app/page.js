"use client";
import Link from "next/link";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Particles from "react-tsparticles";
import { Typewriter } from "react-simple-typewriter";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="relative flex min-h-screen text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/ai-bg.png"
          alt="Background"
          className="w-full h-full object-cover brightness-50"
        />
        {/* Optional overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027]/80 via-[#203a43]/80 to-[#2c5364]/80" />
      </div>

      {/* Particle Background */}
      <Particles
        className="absolute inset-0 z-0"
        options={{
          background: { color: "transparent" },
          particles: {
            number: { value: 80 },
            size: { value: 3 },
            move: { speed: 1 },
            links: { enable: true, color: "#ffffff", distance: 150 },
          },
        }}
      />

      {/* Left Content */}
      <div className="relative z-10 w-1/2 flex flex-col justify-center items-start px-16">
        <h1
          className="text-6xl font-extrabold mb-4 leading-tight drop-shadow-xl"
          data-aos="fade-right"
        >
          Welcome to{" "}
          <span className="text-pink-500">Aletheia</span>
        </h1>
        <h2
          className="text-2xl text-gray-300 mb-6"
          data-aos="fade-right"
          data-aos-delay="200"
        >
          <Typewriter
            words={[
              "An AI assistant for a research study by UMBC",
              "An AI assistant for a research study by UMBC.",
              "An AI assistant for a research study by UMBC.",
            ]}
            loop
            cursor
            cursorStyle="|"
            typeSpeed={50}
            deleteSpeed={30}
            delaySpeed={2000}
          />
        </h2>
        <div className="flex space-x-4" data-aos="fade-right" data-aos-delay="400">
          <Link href="/signup">
            <button className="px-6 py-3 rounded-xl text-lg font-semibold bg-pink-600 hover:bg-pink-700 transition shadow-lg">
              Get Started
            </button>
          </Link>
          <Link href="/login">
            <button className="px-6 py-3 rounded-xl text-lg font-semibold bg-white text-black hover:bg-gray-200 transition shadow-lg">
              Sign In
            </button>
          </Link>
        </div>
      </div>

      {/* Right Glass Card */}
      <div className="relative z-10 w-1/2 flex items-center justify-center px-10">
        <div
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-10 w-full max-w-lg shadow-2xl hover:shadow-pink-500/30 transition duration-500"
          data-aos="fade-left"
        >
          <h2 className="text-3xl font-bold mb-4 text-center">About Aletheia</h2>
          <p className="text-gray-200 text-sm text-center">
            Aletheia is an AI-powered assistant designed to support users in finding information, solving tasks, and exploring knowledge interactively. It blends advanced language models with dynamic response styles to study how people engage with AI, especially in scenarios involving varied tones and occasional deliberate errors to assess trust and perception. Aletheia’s mission is to enhance understanding of AI trustworthiness and human-AI interaction.
          </p>
        </div>
      </div>
    </div>
  );
}
