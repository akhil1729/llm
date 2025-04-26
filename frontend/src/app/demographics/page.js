"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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
    try {
      await axios.post(`${API_BASE_URL}/user/demographics`, {
        email,
        ...form
      });
      router.push("/chat");
    } catch (err) {
      console.error("Error saving demographics:", err);
      alert("Failed to save demographics.");
    }
  };

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
          <button type="submit" className="w-full bg-green-500 hover:bg-green-600 py-3 rounded text-white font-bold">
            Submit and Continue
          </button>
        </form>
      </div>
    </div>
  );
}
