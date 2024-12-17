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
  const [donations, setDonations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"onGoing" | "completed">("onGoing");

  // Fetch data from Firestore
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

    const fetchDonations = async () => {
      const donationQuery = query(
        collection(db, "donations"),
        where("status", "==", "Donation Confirmed")
      );

      const unsubscribe = onSnapshot(donationQuery, async (snapshot) => {
        const donationsData = await Promise.all(
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
              industryName: data.industryName || "Unknown",
              industryAddress,
              wasteCategory: data.wasteCategory || "Unknown",
              status: data.status || "",
              trackingStatus: data.trackingStatus || {
                wastePickUp: false,
                sentToYou: false,
                orderReceived: false,
              },
            };
          })
        );

        setDonations(donationsData);
      });

      return () => unsubscribe();
    };

    fetchSubmissions();
    fetchDonations();
  }, []);

  const handleTrackingUpdate = async (
    type: "submission" | "donation",
    id: string,
    step: "wastePickUp" | "sentToYou" | "orderReceived",
    value: boolean
  ) => {
    try {
      const ref = doc(db, type === "submission" ? "submission" : "donations", id);

      await updateDoc(ref, {
        [`trackingStatus.${step}`]: value,
      });

      if (type === "submission") {
        setSubmissions((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  trackingStatus: {
                    ...item.trackingStatus,
                    [step]: value,
                  },
                }
              : item
          )
        );
      } else {
        setDonations((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  trackingStatus: {
                    ...item.trackingStatus,
                    [step]: value,
                  },
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating tracking status:", error);
    }
  };

  const renderTrackingCard = (item: any, type: "submission" | "donation") => (
    <div
      key={item.id}
      className="p-4 rounded-lg shadow-sm mb-4 border-[1px] border-[#0A4635]/30"
    >
      <p className="text-sm mb-2">
        <strong>From:</strong> {type === "submission" ? item.industryCompanyName : item.industryName} (
        {item.industryAddress})
      </p>
      <p className="text-sm mb-2">
        <strong>To:</strong> {item.umkmName} ({item.umkmAddress})
      </p>
      <p className="text-sm mb-2">
        <strong>Category:</strong> {type === "submission" ? item.wasteNeeds : item.wasteCategory}
      </p>
      <p className="text-sm">
        <strong>Status:</strong>{" "}
        <span
          className={
            item.trackingStatus.orderReceived
              ? "text-green-500 font-semibold"
              : "text-gray-600 font-medium"
          }
        >
          {item.trackingStatus.orderReceived ? "Completed" : item.status}
        </span>
      </p>

      {activeTab === "onGoing" && (
        <div className="flex flex-col space-y-4">
          {/* Waste Pick Up */}
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium">Waste Pick Up</p>
            <button
              onClick={() =>
                handleTrackingUpdate(type, item.id, "wastePickUp", true)
              }
              className={`px-3 py-1 rounded-md text-xs ${
                item.trackingStatus.wastePickUp
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600 hover:bg-green-400"
              }`}
              disabled={item.trackingStatus.wastePickUp}
            >
              {item.trackingStatus.wastePickUp ? "✔ Confirmed" : "Confirm"}
            </button>
          </div>

          {/* Sent to You */}
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium">Sent to You</p>
            <button
              onClick={() =>
                handleTrackingUpdate(type, item.id, "sentToYou", true)
              }
              className={`px-3 py-1 rounded-md text-xs ${
                item.trackingStatus.sentToYou
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600 hover:bg-green-400"
              }`}
              disabled={!item.trackingStatus.wastePickUp || item.trackingStatus.sentToYou}
            >
              {item.trackingStatus.sentToYou ? "✔ Confirmed" : "Confirm"}
            </button>
          </div>

          {/* Order Received */}
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium">Order Received</p>
            <button
              onClick={() =>
                handleTrackingUpdate(type, item.id, "orderReceived", true)
              }
              className={`px-3 py-1 rounded-md text-xs ${
                item.trackingStatus.orderReceived
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600 hover:bg-green-400"
              }`}
              disabled={!item.trackingStatus.sentToYou || item.trackingStatus.orderReceived}
            >
              {item.trackingStatus.orderReceived ? "✔ Completed" : "Confirm"}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col space-y-8 p-6">
      <h1 className="text-xl font-semibold text-[#0A4635]">Tracking</h1>

      {/* Tabs */}
      <div className="flex space-x-8 mb-8">
        {["onGoing", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "onGoing" | "completed")}
            className={`relative text-lg font-medium text-[#0A4635] ${
              activeTab === tab ? "font-semibold" : ""
            }`}
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
      <div className="flex flex-col space-y-8">
        {/* On Going Tracking */}
        <div>
          {activeTab === "onGoing" && (
            <>
              {submissions.filter(
                (submission) => !submission.trackingStatus.orderReceived
              ).length > 0 ? (
                submissions
                  .filter((submission) => !submission.trackingStatus.orderReceived)
                  .map((submission) =>
                    renderTrackingCard(submission, "submission")
                  )
              ) : (
                <p>No submissions to display.</p>
              )}
              

              {donations.filter(
                (donation) => !donation.trackingStatus.orderReceived
              ).length > 0 ? (
                donations
                  .filter((donation) => !donation.trackingStatus.orderReceived)
                  .map((donation) =>
                    renderTrackingCard(donation, "donation")
                  )
              ) : (
                <p>No donations to display.</p>
              )}
            </>
          )}
        </div>

        {/* Completed Tracking */}
        <div>
          {activeTab === "completed" && (
            <>
              {submissions.filter(
                (submission) => submission.trackingStatus.orderReceived
              ).length > 0 ? (
                submissions
                  .filter((submission) => submission.trackingStatus.orderReceived)
                  .map((submission) =>
                    renderTrackingCard(submission, "submission")
                  )
              ) : (
                <p>No submissions to display.</p>
              )}

              {donations.filter(
                (donation) => donation.trackingStatus.orderReceived
              ).length > 0 ? (
                donations
                  .filter((donation) => donation.trackingStatus.orderReceived)
                  .map((donation) =>
                    renderTrackingCard(donation, "donation")
                  )
              ) : (
                <p>No donations to display.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
