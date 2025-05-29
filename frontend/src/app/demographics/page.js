"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from "react-icons/ai";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DemographicsForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    education: "",
    race_ethnicity: [],
    college_major: "",
    chatbot_usage: "",
  });

  const [consent1, setConsent1] = useState(false);

  useEffect(() => {
  AOS.init({ duration: 1000 });

  const storedEmail = localStorage.getItem("email");

  if (!storedEmail) {
    router.push("/login");
  } else {
    setEmail(storedEmail);

    // 🔍 Check if demographics already filled
    axios.get(`${API_BASE_URL}/user/demographics/${storedEmail}`)
      .then((res) => {
        if (res.data && res.data.name) {
          router.push("/chat"); // ✅ Already filled → skip
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          // ⛔ Not filled yet → stay on this page
        } else {
          console.error("Error checking demographics:", err);
        }
      });
  }
}, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const updated = checked
        ? [...prev.race_ethnicity, value]
        : prev.race_ethnicity.filter((v) => v !== value);
      return { ...prev, race_ethnicity: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent1) {
      alert("Please agree to the consent form.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/user/demographics`, {
        email,
        ...form,
        consent1,
      });
      setSubmitted(true);
      setTimeout(() => {
        router.push("/chat");
      }, 1500);
    } catch (err) {
      console.error("Error saving demographics:", err);
      alert("Failed to save demographics.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
        <CheckCircleIcon className="h-24 w-24 text-green-400 mb-4" />
        <h2 className="text-2xl font-bold">Thank you! Redirecting...</h2>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white bg-black overflow-hidden">
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
          <a href="/" className="hover:text-pink-400 flex items-center gap-1">
            <AiOutlineHome /> Home
          </a>
          <a href="/signup" className="hover:text-pink-400 flex items-center gap-1">
            <AiOutlineUserAdd /> Sign Up
          </a>
          <a href="/login" className="hover:text-pink-400 flex items-center gap-1">
            <AiOutlineLogin /> Login
          </a>
        </div>
      </nav>

      {/* Form Card */}
      <div
        className="relative z-10 w-full max-w-4xl p-10 bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-green-400/20 transition duration-500"
        data-aos="zoom-in"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Demographics Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

  <div>
    <label htmlFor="name" className="block text-sm font-semibold mb-1">Full Name</label>
    <input
      id="name"
      name="name"
      type="text"
      onChange={handleChange}
      required
      className="w-full p-3 rounded bg-gray-900 border border-gray-700"
    />
  </div>

  <div className="flex flex-col md:flex-row gap-6">
  <div className="w-full md:w-1/2">
    <label htmlFor="age" className="block text-sm font-semibold mb-1">Age</label>
    <input
      id="age"
      name="age"
      type="number"
      onChange={handleChange}
      required
      className="w-full p-3 rounded bg-gray-900 border border-gray-700"
    />
  </div>

  <div className="w-full md:w-1/2">
    <label htmlFor="gender" className="block text-sm font-semibold mb-1">Gender</label>
    <select
      id="gender"
      name="gender"
      required
      onChange={handleChange}
      className="w-full p-3 rounded bg-gray-900 border border-gray-700"
    >
      <option value="">Select Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
      <option value="prefer_not_to_say">Prefer not to answer</option>
    </select>
  </div>
</div>


  <div>
    <label className="block text-sm font-semibold mb-1">Race/Ethnicity (Check all that apply):</label>
    <div className="text-sm text-gray-300 space-y-1">
      {[
        "White/Caucasian",
        "Black/African American",
        "Asian",
        "Native Hawaiian/Pacific Islander",
        "Latino/Hispanic",
        "Middle-eastern/North African",
      ].map((eth, idx) => (
        <label key={idx} className="block">
          <input
            type="checkbox"
            value={eth}
            checked={form.race_ethnicity.includes(eth)}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          {eth}
        </label>
      ))}
    </div>
  </div>

  <div>
    <label htmlFor="education" className="block text-sm font-semibold mb-1">Education</label>
    <select
      id="education"
      name="education"
      required
      onChange={handleChange}
      className="w-full p-3 rounded bg-gray-900 border border-gray-700"
    >
      <option value="">Select Education Level</option>
      <option value="High school diploma">High school diploma</option>
      <option value="Bachelor’s degree">Bachelor’s degree</option>
      <option value="Master’s or Doctorate degree">Master’s or Doctorate degree</option>
      <option value="Other">Other</option>
    </select>
  </div>

  <div>
    <label htmlFor="college_major" className="block text-sm font-semibold mb-1">College Major</label>
    <select
      id="college_major"
      name="college_major"
      required
      onChange={handleChange}
      className="w-full p-3 rounded bg-gray-900 border border-gray-700"
    >
      <option value="">Select College Major</option>
      <option value="STEM majors">STEM majors</option>
      <option value="Social science and humanities majors">Social science and humanities majors</option>
      <option value="Business and economics majors">Business and economics majors</option>
      <option value="Art and communication majors">Art and communication majors</option>
      <option value="Health and medical majors">Health and medical majors</option>
      <option value="Education majors">Education majors</option>
      <option value="Other majors">Other majors</option>
      <option value="Not applicable">Not applicable</option>
    </select>
  </div>

  <div>
    <label htmlFor="chatbot_usage" className="block text-sm font-semibold mb-1">Chatbot Usage Frequency</label>
    <select
      id="chatbot_usage"
      name="chatbot_usage"
      required
      onChange={handleChange}
      className="w-full p-3 rounded bg-gray-900 border border-gray-700"
    >
      <option value="">How often do you use Chatbots?</option>
      <option value="Several times a day">Several times a day</option>
      <option value="Several times a week">Several times a week</option>
      <option value="Rarely">Rarely</option>
      <option value="Never">Never</option>
    </select>
  </div>

  <div className="text-sm text-gray-300">
    <label>
      <input
        type="checkbox"
        checked={consent1}
        onChange={(e) => setConsent1(e.target.checked)}
        className="mr-2"
      />
      I consent to participate in this research study.
    </label>
  </div>

  <button
    type="submit"
    className={`w-full py-3 rounded font-bold text-white ${
      consent1 ? "bg-green-500 hover:bg-green-600" : "bg-gray-600 cursor-not-allowed"
    }`}
    disabled={!consent1}
  >
    Submit and Continue
  </button>
</form>

      </div>
    </div>
  );
}
