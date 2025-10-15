"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [userId, setUserId] = useState<string | null>(null);
  const [job, setJob] = useState({
    title: "",
    company: "",
    status: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
      else setUserId(user.uid);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!userId || !id) return;

    const fetchJob = async () => {
      try {
        const docRef = doc(db, "users", userId, "jobs", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJob(docSnap.data() as any);
        } else {
          alert("Job not found!");
          router.push("/dashboard");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };

    fetchJob();
  }, [userId, id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !id) return;

    try {
      const docRef = doc(db, "users", userId, "jobs", id as string);
      await updateDoc(docRef, job);
      toast.success("Job updated successfully.");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed updated job. Try again");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-800 mb-5">Edit Job</h1>

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          value={job.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="company"
          value={job.company}
          onChange={handleChange}
          placeholder="Company"
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
        />
        <select
          name="status"
          value={job.status}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <textarea
          name="notes"
          value={job.notes}
          onChange={handleChange}
          placeholder="Notes..."
          rows={4}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
