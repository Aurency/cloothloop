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
} from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";

export default function CourierPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"onGoing" | "completed">("onGoing");

  // Fetch submissions from Firestore
  useEffect(() => {
    const fetchSubmissions = async () => {
      const acceptedQuery = query(
        collection(db, "submission"),
        where("status", "==", "Accepted")
      );

      const unsubscribe = onSnapshot(acceptedQuery, async (snapshot) => {
        const submissionsData = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data();
            const umkmRef = doc(db, "umkm", data.umkmId);
            const industryRef = doc(db, "industri", data.industryId);

            const umkmSnapshot = await getDoc(umkmRef);
            const industrySnapshot = await getDoc(industryRef);

            const umkmAddress = umkmSnapshot.exists()
              ? umkmSnapshot.data().businessAddress || "Unknown"
              : "Unknown";
            const industryAddress = industrySnapshot.exists()
              ? industrySnapshot.data().businessAddress || "Unknown"
              : "Unknown";

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
        ...(step === "orderReceived" && value && { status: "Completed" }), // Update status to Completed if orderReceived is true
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
                ...(step === "orderReceived" && value && { status: "Completed" }),
              }
            : submission
        )
      );
    } catch (error) {
      console.error("Error updating tracking status:", error);
    }
  };

  // Filter submissions based on active tab
  const filteredSubmissions = submissions.filter((submission) => {
    const { orderReceived } = submission.trackingStatus;
    return activeTab === "onGoing" ? !orderReceived : orderReceived;
  });

  return (
    <div className="min-h-screen flex flex-col space-y-8 p-6">
      <h1 className="text-xl font-semibold text-[#0A4635]">Tracking</h1>

      {/* Tabs */}
        <div className="relative flex space-x-4 border-b border-[#0A4635]/30 ">
        {(["onGoing", "completed"] as const).map((tab) => (
            <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 relative ${
                activeTab === tab
                ? "font-bold text-[#0A4635]"
                : "font-medium text-gray-600"
            } hover:text-[#0A4635] transition-all duration-300 ease-in-out`}
            >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span
                className={`absolute left-0 bottom-0 w-full h-[2px] ${
                activeTab === tab
                    ? "bg-[#0A4635] scale-x-100"
                    : "bg-transparent scale-x-0"
                } transform transition-all duration-300 ease-in-out`}
            />
            </button>
        ))}
        </div>



      {/* Tracking Cards */}
      <div>
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="p-4 rounded-lg shadow-sm mb-4 border-[1px] border-[#0A4635]/30"
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
                <span
                  className={
                    submission.status === "Completed"
                      ? "text-green-500 font-semibold"
                      : "text-green-500 font-semibold"
                  }
                >
                  {submission.status}
                </span>
              </p>

              {activeTab === "onGoing" && (
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
                      disabled={
                        !submission.trackingStatus.wastePickUp ||
                        submission.trackingStatus.sentToYou
                      }
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
              )}
            </div>
          ))
        ) : (
          <p className="text-lg text-gray-500">No submissions found.</p>
        )}
      </div>
    </div>
  );
}
