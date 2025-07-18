"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AOS from "aos";
import { useEffect } from "react";
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

  const email = localStorage.getItem("email"); // keep consistent with demographics.js

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

    if (!response.ok) {
      throw new Error("Failed to log consent");
    }

    // Success: redirect to demographics
    router.push("/demographics");
  } catch (error) {
    console.error("Consent logging failed:", error);
    alert("Something went wrong while saving your consent.");
  }
};

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80"></div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full px-8 py-4 flex justify-between items-center z-20 text-white">
        <div className="text-2xl font-bold tracking-wider">Aletheia</div>
        <div className="flex space-x-6 text-lg font-medium">
          <a href="/" className="hover:text-pink-400 flex items-center gap-1">
            <AiOutlineHome /> Home
          </a>
          <a
            href="/login"
            className="hover:text-pink-400 flex items-center gap-1"
          >
            <AiOutlineLogout /> Logout
          </a>
        </div>
      </nav>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-3xl p-8 bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-pink-400/20 transition duration-500"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold mb-4 text-center">
          Terms & Conditions
        </h2>

        <div className="h-96 overflow-y-auto p-4 rounded-lg bg-black/40 border border-gray-700 text-sm space-y-4">
          <p>
            Thank you for agreeing to participate in our study.
            <br />
            <br />
            Before we start, we’d like for you to read the informed consent
            information below. Informed consent refers to the voluntary choice
            of an individual to participate in research based on an accurate and
            complete understanding of its purposes, procedures, risks,
            benefits, and alternatives. If you have any questions before
            completing this study, please contact the principal investigator,
            Dr. Shimei Pan, by email at shimeij6@gmail.com.
            <br />
            <br />
            <strong>Informed consent:</strong> You must be of 18 years or older
            to participate in this study. The purpose of this study is to
            analyze how users interact with large language model (LLM)
            hallucinations written in different styles and how these variations
            impact user susceptibility to hallucinated content. I am being asked
            to volunteer because I am an adult that is familiar with LLMs (e.g.
            Chat GPT, Gemini) and have access to my own laptop or desktop
            computer with a proper internet connection. As a participant, I
            have been given access to “Aletheia”, an LLM created specifically
            for this study. After providing my consent, I will be asked to
            complete the study task on my device. The task will consist of
            answering three questions with the help of Aletheia. After
            answering the three questions, I will complete a debriefing survey
            on the last page about my experience using Aletheia and how much I
            trusted its responses. The study should take a maximum of 30 minutes
            to complete.
            <br />
            <br />
            I have been informed that my participation in this research study is
            voluntary and that I am free to withdraw or discontinue
            participation at any time. If I withdraw from this research study,
            I will not be penalized in any way for deciding to stop
            participating. I have been informed that data collected for this
            study will be retained by the investigator and analyzed even if I
            choose to withdraw from the research. If I do choose to withdraw,
            the investigator and I have discussed my withdrawal and the
            investigator may use my information up to the time I decide to
            withdraw.
            <br />
            <br />
            The risks associated with this study involve (1) receiving responses
            from Aletheia that are hallucinated and incorrect, and (2) a loss of
            confidentiality if someone other than the research team gains access
            to the study database.
            <br />
            <br />
            A potential benefit from this study includes gaining a deeper
            understanding of the factors that can influence user acceptance of
            LLM hallucinations. This research may help future populations
            cross-check LLM generated content more often. It may also assist
            future researchers and developers with the creation of LLMs that are
            less likely to hallucinate.
            <br />
            <br />
            I understand that I will be entered in a raffle for a $50 Amazon
            gift card by providing my email address on the login page before
            starting the task.
            <br />
            <br />
            Any information learned and collected from this study in which I
            might be identified will remain confidential and will be disclosed
            ONLY if I give permission. The investigators will attempt to keep
            my personal information confidential. If applicable (1) my name will
            not be included on the surveys and other collected data; (2) a code
            will be placed on the survey and other collected data; (3) through
            the use of an identification key, the researcher will be able to
            link my survey to my identity; and (4) only the researcher will have
            access to the identification key. To help protect my confidentiality
            investigators will keep the study information in a designated Box
            folder that can only be accessed with password protected devices.
            Any access to this folder will be limited to CITI certified
            individuals on the research team. Published data forms will never
            include my email address or identifying information and my data will
            not be shared with any other parties under any circumstance.
            <br />
            <br />
            Only the principal investigator and members of the research team
            will have access to these records. If information learned from this
            study is published, I will not be identified by name. By signing
            this form, however, I allow the research study investigator to make
            my records available to the University of Maryland Baltimore County
            (UMBC) Institutional Review Board (IRB) and regulatory agencies as
            required to do so by law.
            <br />
            <br />
            This study has been reviewed and approved by the UMBC Institutional
            Review Board (IRB). A representative of that Board, from the Office
            of Research Protections and Compliance, is available to discuss the
            review process or my rights as a research participant. Contact
            information of the Office is (410) 455-2737 or
            compliance@umbc.edu.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            id="consent"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
          />
          <label htmlFor="consent">
            I have read and consent to the terms and conditions above.
          </label>
        </div>

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
