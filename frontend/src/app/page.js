"use client";
import Link from "next/link";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Particles from "react-tsparticles";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="relative flex flex-col md:flex-row min-h-screen text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
  className="absolute inset-0 z-0 overflow-hidden"
  initial={{ scale: 1 }}
  animate={{ scale: 1.4 }}
  transition={{
    duration: 5,
    repeat: Infinity,
    repeatType: "loop",
    ease: "linear"
  }}
>
  <img
    src="/ai-bg.avif"
    alt="Background"
    className="w-full h-full object-cover brightness-90"
  />
  <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027]/40 via-[#203a43]/40 to-[#2c5364]/40" />
</motion.div>

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

      {/* Left Content with Animation */}
      <motion.div
        className="relative z-10 w-full md:w-1/2 flex flex-col justify-center items-start px-4 sm:px-8 md:px-16 py-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-xl">
          Welcome to <span className="text-pink-500">Aletheia</span>
        </h1>
        <h2 className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6">
          <Typewriter
            words={[
              "An AI assistant for a research study by UMBC",
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
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <Link href="/signup">
            <button className="px-6 py-3 rounded-xl text-lg font-semibold bg-pink-600 hover:bg-pink-700 transition shadow-lg w-full sm:w-auto">
              Get Started
            </button>
          </Link>
          <Link href="/login">
            <button className="px-6 py-3 rounded-xl text-lg font-semibold bg-white text-black hover:bg-gray-200 transition shadow-lg w-full sm:w-auto">
              Sign In
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Right Glass Card with Tilt & Animation */}
      <Tilt
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
        glareEnable={true}
        glareMaxOpacity={0.2}
        className="relative z-10 w-full md:w-1/2 flex items-center justify-center px-4 sm:px-8 md:px-10 py-8 md:py-0"
      >
        <motion.div
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-lg shadow-2xl hover:shadow-pink-500/30 transition duration-500"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            About Aletheia
          </h2>
          <p className="text-gray-200 text-sm sm:text-base text-center">
            Aletheia is an AI-powered assistant designed to study and enhance the
            understanding of AI trustworthiness and human-AI interaction.
          </p>
        </motion.div>
      </Tilt>
    </div>
  );
}
