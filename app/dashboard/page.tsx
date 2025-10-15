"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  company: string;
  status: string;
  notes: string;
  createdAt: any;
}

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔐 Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/");
      else setUserId(user.uid);
    });
    return () => unsubscribe();
  }, [router]);

  // 🔥 Fetch jobs in real-time
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "users", userId, "jobs"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData: Job[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Job[];
      setJobs(jobsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 text-lg">
        Loading your jobs...
      </div>
    );
  }

  const handleDelete = async (id: string) => {
  if (!userId) return;
  const confirmDelete = confirm("Are you sure you want to delete this job?");
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "users", userId, "jobs", id));
  } catch (error) {
    console.error("Error deleting job:", error);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto py-10 px-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Job Tracker</h1>
            <p className="text-gray-500 mt-1">Keep track of all your job applications in one place.</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/add-job")}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-blue-700 transition"
          >
            + Add Job
          </button>
        </div>

        {/* Job List Section */}
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-24 text-center">
            <img
              src="/empty-state.svg"
              alt="No Jobs"
              className="w-60 opacity-80"
            />
            <h2 className="text-2xl font-semibold text-gray-700 mt-6">No Jobs Added Yet</h2>
            <p className="text-gray-500 mt-2">
              Click the <span className="font-medium text-blue-600">+ Add Job</span> button to start tracking!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow hover:shadow-lg border border-gray-200 p-5 transition transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                    <p className="text-gray-500">{job.company}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/edit-job/${job.id}`)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <span
                  className={`inline-block mt-3 text-sm font-medium px-3 py-1 rounded-full ${job.status === "Applied"
                      ? "bg-blue-100 text-blue-700"
                      : job.status === "Interview"
                        ? "bg-yellow-100 text-yellow-800"
                        : job.status === "Offer"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {job.status}
                </span>

                {job.notes && (
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{job.notes}</p>
                )}

                <p className="mt-4 text-xs text-gray-400">
                  Added on {new Date(job.createdAt.seconds * 1000).toLocaleDateString()}
                </p>
              </div>

            ))}
          </div>
        )}
      </div>
    </div>
  );
}
