"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import AOS from "aos";
import "aos/dist/aos.css";
import { AiOutlineHome, AiOutlineLogin, AiOutlineInfoCircle } from "react-icons/ai";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DemographicsForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ageError, setAgeError] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    identity1: [],
    identity2: [],
    education: "",
    college_major: "",
    chatbot_usage: "",
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      router.push("/login");
    } else {
      setEmail(storedEmail);
      axios.get(`${API_BASE_URL}/user/demographics/${storedEmail}`)
        .then((res) => {
          if (res.data?.name) {
            router.push("/instructions");
          }
        })
        .catch((err) => {
          if (err.response?.status !== 404) {
            console.error("Error checking demographics:", err);
          }
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "age") setAgeError(+value < 18);
    setForm({ ...form, [name]: value });
  };

  const handleMultiSelectChange = (e, field) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const updated = checked
        ? [...prev[field], value]
        : prev[field].filter((v) => v !== value);
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ageError) {
      alert("You must be 18 or older to participate.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/user/demographics`, {
        email,
        ...form,
      });
      setSubmitted(true);
      setTimeout(() => {
        router.push("/instructions");
      }, 1500);
    } catch (err) {
      console.error("Error saving demographics:", err);
      alert("Failed to save demographics.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white px-4">
        <CheckCircleIcon className="h-24 w-24 text-green-400 mb-4" />
        <h2 className="text-2xl font-bold">Thank you! Redirecting...</h2>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white bg-black overflow-hidden">
      <img src="/ai-bg.png" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80"></div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full px-4 sm:px-8 py-4 flex flex-wrap justify-between items-center z-20 text-white">
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

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 md:p-10 bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-green-400/20 transition duration-500 mt-24 mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Demographics Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <label htmlFor="name" className="block text-sm font-semibold mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={handleChange}
                required
                className="w-full p-3 rounded bg-gray-900 border border-gray-700"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label htmlFor="age" className="block text-sm font-semibold mb-1 flex items-center gap-1">
                Age
                <AiOutlineInfoCircle title="You must be at least 18 to participate" />
              </label>
              <input
                id="age"
                name="age"
                type="number"
                onChange={handleChange}
                required
                className={`w-full p-3 rounded bg-gray-900 border ${ageError ? "border-red-500" : "border-gray-700"}`}
              />
              {ageError && <p className="text-red-400 text-sm mt-1">You must be 18 or older to participate.</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Gender Identity (check all that apply)</label>
            <div className="flex flex-wrap gap-4 text-sm text-gray-300">
              {["Male", "Female", "None of the above", "Prefer not to answer"].map((option, idx) => (
                <label key={idx} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    value={option}
                    checked={form.identity1.includes(option)}
                    onChange={(e) => handleMultiSelectChange(e, "identity1")}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Race/Ethnicity (check all that apply)</label>
            <div className="flex flex-wrap gap-4 text-sm text-gray-300">
              {[
                "White/Caucasian",
                "Black/African American",
                "Asian",
                "Native Hawaiian/Pacific Islander",
                "Latino/Hispanic",
                "Middle-eastern/North African",
                "None of the above",
                "Prefer not to answer",
              ].map((option, idx) => (
                <label key={idx} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    value={option}
                    checked={form.identity2.includes(option)}
                    onChange={(e) => handleMultiSelectChange(e, "identity2")}
                  />
                  {option}
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

          <button
            type="submit"
            className="w-full py-3 rounded font-bold text-white bg-green-500 hover:bg-green-600"
          >
            Submit and Continue
          </button>
        </form>
      </div>
    </div>
  );
}
