"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebase";

export default function DashboardNavbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  return (
    <header className="flex justify-between items-center bg-white shadow p-4 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>

      {user && (
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-700">{user.displayName}</p>
          {user.photoURL && (
            <Image
              src={user.photoURL}
              alt="User avatar"
              width={38}
              height={38}
              className="rounded-full border"
            />
          )}
        </div>
      )}
    </header>
  );
}
