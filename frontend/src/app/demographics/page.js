"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CheckCircleIcon } from "@heroicons/react/24/solid"; // ✅ Need heroicons installed

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DemographicsForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    education: "",
    ethnicity: "",
    race: "",
    social_class: "",
    country: "",
    city: ""
  });

  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      router.push("/login");
    } else {
      setEmail(storedEmail);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent1 || !consent2) {
      alert("Please agree to both consent forms to proceed.");
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/user/demographics`, {
        email,
        ...form,
        consent1,
        consent2
      });
      setSubmitted(true);
      setTimeout(() => {
        router.push("/chat");
      }, 1500); // 1.5 seconds pause after showing green check
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Demographics Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input name="first_name" placeholder="First Name" onChange={handleChange} required className="p-2 rounded bg-gray-700 text-white" />
            <input name="last_name" placeholder="Last Name" onChange={handleChange} required className="p-2 rounded bg-gray-700 text-white" />
          </div>
          <input name="age" type="number" placeholder="Age" onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 text-white" />
          <input name="gender" placeholder="Gender" onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 text-white" />
          <input name="education" placeholder="Education (Bachelors/Masters...)" onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 text-white" />
          <input name="ethnicity" placeholder="Ethnicity" onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 text-white" />
          <input name="race" placeholder="Race" onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 text-white" />
          <select name="social_class" onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 text-white">
            <option value="">Select Social Class</option>
            <option value="upper">Upper</option>
            <option value="middle">Middle</option>
            <option value="lower">Lower</option>
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input name="country" placeholder="Country" onChange={handleChange} required className="p-2 rounded bg-gray-700 text-white" />
            <input name="city" placeholder="City" onChange={handleChange} required className="p-2 rounded bg-gray-700 text-white" />
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-2 text-sm text-gray-300 mt-4">
            <div>
              <input
                type="checkbox"
                id="consent1"
                checked={consent1}
                onChange={(e) => setConsent1(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="consent1">
                I consent to participate in this research study.
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="consent2"
                checked={consent2}
                onChange={(e) => setConsent2(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="consent2">
                I consent to the storage and analysis of my data.
              </label>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded font-bold ${consent1 && consent2 ? "bg-green-500 hover:bg-green-600" : "bg-gray-600 cursor-not-allowed"}`}
            disabled={!consent1 || !consent2}
          >
            Submit and Continue
          </button>
        </form>
      </div>
    </div>
  );
}
