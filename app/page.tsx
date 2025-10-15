"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Track Your <span className="text-blue-500 italic">Remote Job</span> Applications Effortlessly
        </h1>

        <p className="text-gray-300 text-lg md:text-xl mb-8">
          Stay organized while applying for remote jobs worldwide.  
          Manage applications, statuses, and interviews — all in one dashboard.
        </p>

        <Button
          onClick={handleLogin}
          className="px-6 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all rounded-2xl shadow-lg"
        >
          Get Started →
        </Button>
      </motion.div>
    </main>
  );
}
