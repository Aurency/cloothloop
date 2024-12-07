"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";

export default function CourierPage() {
  const [submissions, setSubmissions] = useState<{
    id: string;
    umkmName: string;
    umkmAddress: string; // Alamat UMKM
    industryCompanyName: string;
    industryAddress: string; // Alamat Industri
    wasteNeeds: string;
    status: string;
    trackingStatus: {
      wastePickUp: boolean;
      sentToYou: boolean;
      orderReceived: boolean;
    };
  }[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const acceptedQuery = query(
        collection(db, "submission"),
        where("status", "==", "Accepted") // Hanya ambil status "Accepted"
      );

      const unsubscribe = onSnapshot(acceptedQuery, async (snapshot) => {
        const submissionsData = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data();

            // Ambil data dari koleksi "umkm" dan "industri"
            const umkmRef = doc(db, "umkm", data.umkmId); // Referensi dokumen UMKM
            const industryRef = doc(db, "industri", data.industryId); // Referensi dokumen Industri

            // Ambil snapshot untuk kedua referensi
            const umkmSnapshot = await getDoc(umkmRef);
            const industrySnapshot = await getDoc(industryRef);

            // Ambil alamat dari snapshot dokumen UMKM dan Industri
            const umkmAddress = umkmSnapshot.exists()
              ? umkmSnapshot.data().businessAddress || "Unknown"
              : "Unknown";
            const industryAddress = industrySnapshot.exists()
              ? industrySnapshot.data().businessAddress || "Unknown"
              : "Unknown";

            // Update submission dengan alamat langsung
            await setDoc(
              doc(db, "submission", docSnapshot.id), // Menggunakan doc() untuk merujuk pada dokumen submission
              {
                ...data,
                umkmAddress,
                industryAddress,
              },
              { merge: true } // Merge data, tidak menimpa data yang sudah ada
            );

            return {
              id: docSnapshot.id,
              umkmName: data.umkmName || "Unknown",
              umkmAddress,
              industryCompanyName: data.industryCompanyName || "Unknown",
              industryAddress,
              wasteNeeds: data.wasteNeeds || "Unknown",
              status: data.status || "",
              trackingStatus: data.trackingStatus || {
                wastePickUp: false,
                sentToYou: false,
                orderReceived: false,
              },
            };
          })
        );

        setSubmissions(submissionsData);
      });

      return () => unsubscribe();
    };

    fetchSubmissions();
  }, []);

  const handleTrackingUpdate = async (
    submissionId: string,
    step: "wastePickUp" | "sentToYou" | "orderReceived",
    value: boolean
  ) => {
    try {
      const submissionRef = doc(db, "submission", submissionId);

      // Update Firestore
      await updateDoc(submissionRef, {
        [`trackingStatus.${step}`]: value,
      });

      // Update local state
      setSubmissions((prev) =>
        prev.map((submission) =>
          submission.id === submissionId
            ? {
                ...submission,
                trackingStatus: {
                  ...submission.trackingStatus,
                  [step]: value,
                },
              }
            : submission
        )
      );
    } catch (error) {
      console.error("Error updating tracking status:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start space-y-8">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-[#0A4635]">Courier Tracking</h1>

      {/* Tracking Card */}
      {submissions.length > 0 ? (
        submissions.map((submission) => (
          <div
            key={submission.id}
            className="p-4 bg-white rounded-lg shadow-md mb-4"
          >
            <p className="text-sm mb-2">
              <strong>From:</strong> {submission.industryCompanyName} (
              {submission.industryAddress})
            </p>
            <p className="text-sm mb-2">
              <strong>To:</strong> {submission.umkmName} (
              {submission.umkmAddress})
            </p>
            <p className="text-sm mb-2">
              <strong>Category:</strong> {submission.wasteNeeds}
            </p>
            <p className="text-sm mb-4">
              <strong>Status:</strong>{" "}
              <span className="text-green-500 font-semibold">
                {submission.status}
              </span>
            </p>

            {/* Tracking Steps */}
            <div className="flex flex-col space-y-4">
              {/* Waste Pick Up */}
              <div className="flex items-center space-x-4">
                <p className="text-sm font-medium">Waste Pick Up</p>
                <button
                  onClick={() =>
                    handleTrackingUpdate(
                      submission.id,
                      "wastePickUp",
                      true
                    )
                  }
                  className={`px-3 py-1 rounded-md text-xs ${
                    submission.trackingStatus.wastePickUp
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600 hover:bg-green-400"
                  }`}
                  disabled={submission.trackingStatus.wastePickUp}
                >
                  {submission.trackingStatus.wastePickUp
                    ? "✔ Confirmed"
                    : "Confirm"}
                </button>
              </div>

              {/* Sent to You */}
              <div className="flex items-center space-x-4">
                <p className="text-sm font-medium">Sent to You</p>
                <button
                  onClick={() =>
                    handleTrackingUpdate(
                      submission.id,
                      "sentToYou",
                      true
                    )
                  }
                  className={`px-3 py-1 rounded-md text-xs ${
                    submission.trackingStatus.sentToYou
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600 hover:bg-green-400"
                  }`}
                  disabled={!submission.trackingStatus.wastePickUp || submission.trackingStatus.sentToYou}
                >
                  {submission.trackingStatus.sentToYou
                    ? "✔ Confirmed"
                    : "Confirm"}
                </button>
              </div>

              {/* Order Received */}
              <div className="flex items-center space-x-4">
                <p className="text-sm font-medium">Order Received</p>
                <button
                  onClick={() =>
                    handleTrackingUpdate(
                      submission.id,
                      "orderReceived",
                      true
                    )
                  }
                  className={`px-3 py-1 rounded-md text-xs ${
                    submission.trackingStatus.orderReceived
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600 hover:bg-green-400"
                  }`}
                  disabled={
                    !submission.trackingStatus.sentToYou ||
                    submission.trackingStatus.orderReceived
                  }
                >
                  {submission.trackingStatus.orderReceived
                    ? "✔ Confirmed"
                    : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-lg text-gray-500">No accepted submissions found.</p>
      )}
    </div>
  );
}
