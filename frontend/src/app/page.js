"use client";
import Link from "next/link";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Particles from "react-tsparticles";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Typewriter } from "react-simple-typewriter";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden flex flex-col lg:flex-row items-center justify-center px-4 lg:px-20 py-10 gap-10">
      {/* Background Image with Gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1 }}
          animate={{ scale: 1.4 }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
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

      {/* Particle Animation */}
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

      {/* Left Section: Hero Text and Buttons */}
      <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2 space-y-6">
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to <span className="text-pink-500">Aletheia</span>
        </motion.h1>

        <motion.h2
          className="text-base sm:text-lg text-gray-300 max-w-md leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <Typewriter
            words={[
              "An AI assistant for a research study by UMBC",
              "An AI assistant for a research study by UMBC",
              "An AI assistant for a research study by UMBC",
            ]}
            loop
            cursor
            cursorStyle="|"
            typeSpeed={50}
            deleteSpeed={30}
            delaySpeed={2000}
          />
        </motion.h2>

        <motion.div
          className="flex flex-col sm:flex-row items-center lg:justify-start gap-4 w-full max-w-xs"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
        >
          <Link href="/signup" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-3 text-lg font-semibold rounded-xl bg-pink-600 hover:bg-pink-700 transition shadow-md">
              Get Started
            </button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-3 text-lg font-semibold rounded-xl bg-white text-black hover:bg-gray-200 transition shadow-md">
              Sign In
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Right Section: About Aletheia Card */}
      <div className="relative z-10 flex justify-center items-center w-full lg:w-1/2 px-6">
        <Tilt
          tiltMaxAngleX={5}
          tiltMaxAngleY={5}
          glareEnable={true}
          glareMaxOpacity={0.2}
          className="w-full max-w-md"
        >
          <motion.div
            className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl px-6 py-8 shadow-xl hover:shadow-pink-500/30 transition duration-500"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-3 text-white text-center">
              About Aletheia
            </h2>
            <p className="text-gray-300 text-sm sm:text-base text-center leading-relaxed">
              Aletheia is an AI assistant designed to study and enhance the
              understanding of human-AI interaction.
            </p>
          </motion.div>
        </Tilt>
      </div>
    </div>
  );
}
