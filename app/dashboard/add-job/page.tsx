"use client";

import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";

export default function AddJobPage() {
  const [job, setJob] = useState({
    title: "",
    company: "",
    status: "Applied",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe(); // cleanup when unmounts
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return alert("Please log in first.");

    setLoading(true);
    try {
      await addDoc(collection(db, "users", userId, "jobs"), {
        ...job,
        createdAt: new Date(),
      });
      toast.success("Job added successfully.");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error adding job:", error);
      toast.error("Failed to add job. Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Job</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Job Title</label>
          <input
            type="text"
            value={job.title}
            onChange={(e) => setJob({ ...job, title: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Company</label>
          <input
            type="text"
            value={job.company}
            onChange={(e) => setJob({ ...job, company: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Status</label>
          <select
            value={job.status}
            onChange={(e) => setJob({ ...job, status: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Notes</label>
          <textarea
            value={job.notes}
            onChange={(e) => setJob({ ...job, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Adding..." : "Add Job"}
        </button>
      </form>
    </div>
  );
}
