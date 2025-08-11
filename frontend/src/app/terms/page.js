"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";
import { AiOutlineHome, AiOutlineLogout } from "react-icons/ai";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function TermsPage() {
  const [consentGiven, setConsentGiven] = useState(false);
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleProceed = async () => {
    if (!consentGiven) {
      alert("❌ Consent is mandatory to proceed.");
      return;
    }

    const email = localStorage.getItem("email");

    try {
      const response = await fetch(`${API_BASE_URL}/user/consent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          consent_given: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to log consent");

      router.push("/demographics");
    } catch (error) {
      console.error("Consent logging failed:", error);
      alert("Something went wrong while saving your consent.");
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 sm:px-8">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80"></div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full px-4 sm:px-8 md:px-10 py-4 flex flex-wrap justify-between items-center z-20 text-white">
        <div className="text-2xl font-bold tracking-wider">Aletheia</div>
        <div className="flex flex-wrap gap-4 text-base sm:text-lg font-medium mt-2 sm:mt-0">
          <a href="/" className="hover:text-pink-400 flex items-center gap-1">
            <AiOutlineHome /> Home
          </a>
          <a href="/login" className="hover:text-pink-400 flex items-center gap-1">
            <AiOutlineLogout /> Logout
          </a>
        </div>
      </nav>

      {/* Consent Card */}
      <div
        className="relative z-10 w-full max-w-3xl p-6 sm:p-8 md:p-10 bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-pink-400/20 transition duration-500 mt-24 mb-10"
        data-aos="fade-up"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Terms &amp; Conditions</h2>

        {/* Updated Consent Text */}
        <div className="h-96 overflow-y-auto p-4 rounded-lg bg-black/40 border border-gray-700 text-sm sm:text-base text-justify leading-relaxed space-y-4 text-gray-100">
          <p><strong>INFORMED CONSENT FOR PARTICIPATION IN RESEARCH ACTIVITIES</strong></p>
          <p><strong>Study on How Humans Interact with AI Assistants</strong></p>

          <p>
            Thank you for agreeing to participate in our study.
          </p>

          <p>
            Before we start, we’d like you to read the informed consent information below. If you have any
            questions before consenting to this study, please contact <strong>Chielota Uma</strong> at{" "}
            <a href="mailto:cuma1@umbc.edu" className="text-blue-400 underline">cuma1@umbc.edu</a> or{" "}
            <strong>Dr. Shimei Pan</strong> at{" "}
            <a href="mailto:shimei@umbc.edu" className="text-blue-400 underline">shimei@umbc.edu</a>.
          </p>

          <p><strong>Informed consent:</strong></p>

          <p>
            You must be 18 years or older to participate in this study.
          </p>

          <p>
            The purpose of this study is to understand how users interact with AI assistants. I am being asked to
            volunteer because I am an adult that has used an AI assistant (e.g. Chat GPT, Gemini) and have access
            to my own laptop or desktop computer with internet connection. As a participant, I have been given
            access to “Aletheia”, an AI assistant created specifically for this study. After providing my consent, I
            will be asked to complete the study task on my computer. The task will consist of answering three
            questions with the help of Aletheia. After answering the three questions, I will complete a brief survey
            about my experience using Aletheia. The study should take approximately 20 minutes to complete.
          </p>

          <p>
            I have been informed that my participation in this research study is voluntary and that I am free to
            withdraw or discontinue participation at any time. If I withdraw from this research study, I will not be
            penalized in any way for deciding to stop participating. I have been informed that data collected for this
            study will be retained by the investigator and analyzed even if I choose to withdraw from the research. If
            I do choose to withdraw, the investigator may use my information up to the time I decide to withdraw.
          </p>

          <p>
            The risks of participation are minimal, with the highest expected risk being the rare event of a
            confidentiality breach. Risks also involve receiving responses from Aletheia that may contain errors.
          </p>

          <p>
            This study may assist future researchers and developers as they continue to enhance their AI systems. It
            may also benefit future populations as they engage with improved AI assistants.
          </p>

          <p>
            I understand that I will be entered in a raffle for a $50 Amazon gift card by providing my email address
            on the login page before starting the task.
          </p>

          <p>
            Any information learned and collected from this study in which I might be identified will remain
            confidential and will be disclosed ONLY if I give permission. The investigators will attempt to keep my
            personal information, including my name and email, confidential in a separate file protected by a
            password. An identification number will be created for each participant and used instead of my name.
            This identification number will be used to link my study data to my identity, and only the researchers
            associated with the project will have access to my personally identifiable information. To help protect
            my confidentiality, investigators will keep the study information in a designated Box folder that can only
            be accessed with password protected devices.
          </p>

          <p>
            Any access to this folder will be limited to CITI certified individuals on the research team. Published
            data will never include my personally identifiable information.
          </p>

          <p>
            Only the principal investigator and members of the research team will have access to these records. If
            information learned from this study is published, I will not be identified by personal identifiers such as
            my name or email address. By signing this form, however, I allow the research study investigators to
            make my records available to the University of Maryland Baltimore County (UMBC) Institutional
            Review Board (IRB) and regulatory agencies as required to do so by law.
          </p>

          <p>
            The co-investigators have offered to answer all questions regarding my participation in this research
            study. If I have any further questions, I can contact <strong>Chielota Uma</strong> (<a href="mailto:cuma1@umbc.edu" className="text-blue-400 underline">cuma1@umbc.edu</a>) or{" "}
            <strong>Dr. Shimei Pan</strong> (<a href="mailto:shimei@umbc.edu" className="text-blue-400 underline">shimei@umbc.edu</a>).
          </p>

          <p>
            This study has been reviewed and approved by the UMBC Institutional Review Board (IRB). A
            representative of that Board, from the Office of Research Protections and Compliance, is available to
            discuss the review process or my rights as a research participant. Contact information of the Office is
            <span className="whitespace-nowrap"> (410) 455-2737</span> or{" "}
            <a href="mailto:compliance@umbc.edu" className="text-blue-400 underline">compliance@umbc.edu</a>.
          </p>

          <p>
            After reading the consent items, please click “I agree”. Proceed to the next page to get started with the
            study. If you would like to leave the task at any time, please close the web page.
          </p>

          <p>
            I have been informed that I may print out a copy of the consent for myself to keep.
          </p>
        </div>

        {/* Consent Checkbox */}
        <div className="mt-4 flex items-start gap-2 text-sm sm:text-base">
          <input
            type="checkbox"
            id="consent"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="consent" className="text-gray-300">
            I have read and consent to the terms and conditions above.
          </label>
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleProceed}
          className="w-full mt-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
