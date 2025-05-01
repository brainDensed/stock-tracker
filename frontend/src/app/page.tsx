"use client"

import Navbar from "@/components/layout/navbar";
import { useFetchNews } from "@/hooks/queries";

export default function Home() {
      const { data: news, isLoading, isError } = useFetchNews();
      if (isLoading) return <p className="text-center mt-10">Loading news...</p>;
      if (isError) return <p className="text-center mt-10 text-red-500">Failed to load news.</p>;
    
      console.log("news", news?.data);
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
        <div className="text-center px-6 py-10 bg-white shadow-lg rounded-2xl max-w-xl">
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">Welcome to Stock Tracker 📈</h1>
          <p className="text-gray-700 mb-6">
            Track your investments, get market alerts, and manage your portfolio with ease.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition">
              Get Started
            </button>
            <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-300 transition">
              Learn More
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
