"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseconfig";

export default function DeliveryPage2() {
  const [submissions, setSubmissions] = useState<{
    id: string;
    umkmName: string;
    wasteNeeds: string;
    status: string;
  }[]>([]);
  const [industryId, setIndustryId] = useState<string | null>(null);

  // Mendapatkan industryId dari Firestore berdasarkan UID pengguna yang sedang login
  useEffect(() => {
    const fetchIndustryId = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const industryRef = doc(db, "industri", user.uid);
        const industryDoc = await getDoc(industryRef);

        if (industryDoc.exists()) {
          setIndustryId(industryDoc.id); // Menyimpan ID industri ke state
          console.log("Industry ID:", industryDoc.id); // Log untuk debugging
        } else {
          console.error("Industry data not found.");
        }
      } catch (error) {
        console.error("Error fetching industry ID:", error);
      }
    };

    fetchIndustryId();
  }, []);

  // Menangani pengambilan data dari koleksi submission berdasarkan industryId
  useEffect(() => {
    if (!industryId) return;

    const submissionQuery = query(
      collection(db, "submission"),
      where("industryId", "==", industryId)
    );

    const unsubscribe = onSnapshot(submissionQuery, (snapshot) => {
      console.log("Query snapshot:", snapshot); // Log untuk melihat apakah data ada di snapshot
      const fetchedSubmissions = snapshot.docs.map((doc) => {
        const submissionData = doc.data();
        return {
          id: doc.id,
          umkmName: submissionData.umkmName || "Unknown", // Menampilkan nama UMKM
          wasteNeeds: submissionData.wasteNeeds || "Unknown", // Menampilkan kategori waste
          status: submissionData.status || "Pending", // Menampilkan status submission
        };
      });

      if (fetchedSubmissions.length === 0) {
        console.log("No submissions found for this industryId.");
      }

      setSubmissions(fetchedSubmissions);
    });

    return () => unsubscribe();
  }, [industryId]);

  // Menangani perubahan status submission
  const handleStatusChange = async (submissionId: string, status: "Accepted" | "Rejected") => {
    try {
      const submissionRef = doc(db, "submission", submissionId);
      await updateDoc(submissionRef, { status });

      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((submission) =>
          submission.id === submissionId ? { ...submission, status } : submission
        )
      );

      console.log(`Submission ${submissionId} updated to ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start space-y-8">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-[#0A4635] text-left">Activity</h1>

      {/* Card 1: Submission */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold text-[#0A4635] mb-4">Submission</h2>

        {submissions.length > 0 ? (
          submissions.map((submission) => (
            <div key={submission.id} className="p-4 mb-4 bg-white rounded-lg shadow">
              <p className="text-sm mb-2">
                <strong>UMKM Name:</strong> {submission.umkmName}
              </p>
              <p className="text-sm mb-2">
                <strong>Category:</strong> {submission.wasteNeeds}
              </p>
              <p className="text-sm mb-4">
                <strong>Status:</strong> {submission.status}
              </p>

              {/* Tombol di bawah kanan */}
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => handleStatusChange(submission.id, "Accepted")}
                  className={`px-3 py-1 text-white rounded-md hover:bg-green-600 text-xs ${
                    submission.status === "Accepted" 
                      ? "bg-green-500" 
                      : submission.status === "Rejected" 
                      ? "bg-gray-300 cursor-not-allowed" 
                      : "bg-green-500"
                  }`}
                  disabled={submission.status === "Rejected"}
                >
                  Agree
                </button>
                <button
                  onClick={() => handleStatusChange(submission.id, "Rejected")}
                  className={`px-3 py-1 text-white rounded-md hover:bg-red-600 text-xs ${
                    submission.status === "Rejected" 
                      ? "bg-red-500" 
                      : submission.status === "Accepted" 
                      ? "bg-gray-300 cursor-not-allowed" 
                      : "bg-red-500"
                  }`}
                  disabled={submission.status === "Accepted"}
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No submissions available.</p>
        )}
      </div>

      {/* Card 2: Delivery */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold text-[#0A4635] mb-4">Delivery</h2>
        <div className="text-sm text-gray-600 space-y-4">
          <p>
            <span className="font-medium">Recipient Name:</span> John Doe
          </p>
          <p>
            <span className="font-medium">Delivery Address:</span> Jl. Raya No.123, Jakarta, Indonesia
          </p>
          <p>
            <span className="font-medium">Estimated Delivery Time:</span> 2-3 Business Days
          </p>
        </div>
      </div>

      {/* Card 3: History */}
      <div className="bg-white p-6 rounded-md shadow-md w-full">
        <h2 className="text-xl font-semibold text-[#0A4635] mb-4">History</h2>
        <p className="text-sm text-gray-600">View your previous orders and delivery history.</p>
      </div>
    </div>
  );
}
