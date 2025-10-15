"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, PlusCircle, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
    { name: "Add Job", icon: <PlusCircle size={18} />, path: "/dashboard/add-job" },
  ];

  return (
    <aside className="hidden h-screen md:flex flex-col w-[16%] bg-gray-900 text-white p-5 space-y-6">
      <h1 className="text-2xl font-semibold italic text-blue-400 tracking-wide">
        Re<span className="text-white">Track</span>
      </h1>

      <nav className="flex-1">
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                pathname === item.path ? "bg-blue-600" : "hover:bg-gray-800"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-fit mx-auto px-12 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
