/** @type {import('next').NextConfig} */
const nextConfig = {};
export default {
    env: {
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000",
    },
  };
  
