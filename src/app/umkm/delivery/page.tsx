"use client"
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";
import Link from "next/link";

export default function DeliveryPage() {
  const [submissions, setSubmissions] = useState<
    {
      id: string;
      industryCompanyName: string;
      industryWasteNeeds: string;
      status: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const submissionsSnapshot = await getDocs(collection(db, "submission"));
        const submissionsData = submissionsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            industryCompanyName: data.industryCompanyName || "",
            industryWasteNeeds: data.industryWasteNeeds || "",
            status: data.status || "",
          };
        });
        setSubmissions(submissionsData);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-start space-y-8">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-[#0A4635] text-left">
        Activity
      </h1>

      {/* Card 1: Submission */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold text-[#0A4635] mb-4">Submission</h2>

        {submissions.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="p-4 bg-white rounded-lg shadow min-h-[100px]">
                <p className="text-sm mb-2">
                  <strong>UMKM Name:</strong> {submission.industryCompanyName}
                </p>
                <p className="text-sm mb-2">
                  <strong>Category:</strong> {submission.industryWasteNeeds}
                </p>
                <p className="text-sm mb-4">
                  <strong>Status:</strong> {submission.status}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-500">No submissions found.</p>
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
        <p className="text-sm text-gray-600">
          View your previous orders and delivery history.
        </p>
      </div>
    </div>
  );
}
