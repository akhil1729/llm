"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/login"); // After 5 seconds, move to login (or homepage)
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
                <h2 className="text-4xl font-bold mb-4">🎉 Thank You!</h2>
                <p className="text-lg mb-6">We appreciate your participation in this study.</p>
                <p className="text-sm text-gray-400">Redirecting you shortly...</p>
            </div>
        </div>
    );
}
