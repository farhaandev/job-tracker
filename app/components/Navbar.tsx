"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo / Brand */}
        <div
          onClick={() => router.push("/dashboard")}
          className="text-2xl font-bold text-blue-600 cursor-pointer select-none"
        >
          Remote<span className="italic text-gray-900">Tracker</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full border shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
