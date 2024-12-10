"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebaseconfig";
import { FaBox, FaTruck, FaCheckCircle } from "react-icons/fa";

export default function DeliveryPage2() {
  const [activeTab, setActiveTab] = useState("submission");

  const [submissions, setSubmissions] = useState<{
    id: string;
    umkmName: string;
    wasteNeeds: string;
    status: string;
    trackingStatus: {
      wastePickUp: boolean;
      sentToYou: boolean;
      orderReceived: boolean;
    };
  }[]>([]);

  const [donations, setDonations] = useState<{
    id: string;
    industryName: string;
    wasteCategory: string;
    status: string;
    trackingStatus: {
      wastePickUp: boolean;
      sentToYou: boolean;
      orderReceived: boolean;
    };
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
          setIndustryId(industryDoc.id);
        } else {
          console.error("Industry data not found.");
        }
      } catch (error) {
        console.error("Error fetching industry ID:", error);
      }
    };

    fetchIndustryId();
  }, []);

  // Mengambil data submission dari Firestore berdasarkan industryId
  useEffect(() => {
    if (!industryId) return;

    const submissionQuery = query(
      collection(db, "submission"),
      where("industryId", "==", industryId)
    );

    const unsubscribe = onSnapshot(submissionQuery, (snapshot) => {
      const fetchedSubmissions = snapshot.docs.map((doc) => {
        const submissionData = doc.data();
        return {
          id: doc.id,
          umkmName: submissionData.umkmName || "Unknown",
          wasteNeeds: submissionData.wasteNeeds || "Unknown",
          status: submissionData.status || "Pending",
          trackingStatus: submissionData.trackingStatus || {
            wastePickUp: false,
            sentToYou: false,
            orderReceived: false,
          },
        };
      });

      setSubmissions(fetchedSubmissions);
    });

    return () => unsubscribe();
  }, [industryId]);

  // Mengubah status submission
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

  const getTrackingStatusColor = (status: string | boolean) => {
    if (status === true) return "text-green-500"; // Completed
    if (status === false) return "text-gray-500"; // Rejected
    return "text-gray-500"; // Pending or In Progress
  };

  const renderContent = () => {
    switch (activeTab) {
      case "submission":
        return (
          <div className="mt-5 space-y-5">
            {/* Pending Submissions */}
            <div>
              <h2 className="font-semibold text-lg">Pending Submissions</h2>
              {submissions.filter((submission) => submission.status === "Pending").length > 0 ? (
                submissions
                  .filter((submission) => submission.status === "Pending")
                  .map((submission) => (
                    <div
                      key={submission.id}
                      className="p-4 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600 mb-4"
                    >
                      <p className="text-sm mb-2">
                        <strong>UMKM Name:</strong> {submission.umkmName}
                      </p>
                      <p className="text-sm mb-2">
                        <strong>Category:</strong> {submission.wasteNeeds}
                      </p>
                      <div className="flex justify-end space-x-5 mt-0">
                        <button
                          onClick={() => handleStatusChange(submission.id, "Accepted")}
                          className="px-3 py-1 text-white rounded-md text-sm bg-green-500 hover:bg-green-600"
                        >
                          Agree
                        </button>
                        <button
                          onClick={() => handleStatusChange(submission.id, "Rejected")}
                          className="px-3 py-1 text-white rounded-md text-sm bg-red-500 hover:bg-red-600"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-gray-600">You don't have any pending submissions.</p>
              )}
            </div>

            {/* Accepted Submissions */}
            <div>
              <h2 className="font-semibold text-lg">Accepted Submissions</h2>
              {submissions
                .filter((submission) => submission.status === "Accepted") // Filter accepted
                .map((submission) => (
                  <div
                    key={submission.id}
                    className="p-4 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600 mb-4"
                  >
                    <p className="text-sm mb-2">
                      <strong>UMKM Name:</strong> {submission.umkmName}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Category:</strong> {submission.wasteNeeds}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Status:</strong>{" "}
                      <span className="font-semibold text-green-500">{submission.status}</span>
                    </p>
                  </div>
                ))}
            </div>
          </div>
        );
        case "delivery":
          return (
            <div>
              {/* Pending Deliveries for Submissions */}
              {submissions.filter((submission) => submission.status === "Accepted").length > 0 ? (
                <div className="flex flex-col space-y-5 mt-5">
                  {submissions.filter(
                    (submission) => submission.status === "Accepted" && !submission.trackingStatus.orderReceived
                  ).map((submission) => (
                    <div key={submission.id} className="p-4 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600">
                      <p className="text-sm mb-2"><strong>UMKM Name:</strong> {submission.umkmName}</p>
                      <p className="text-sm mb-2"><strong>Category:</strong> {submission.wasteNeeds}</p>
        
                      {/* Progress Tracking for Submissions */}
                      <div className="flex flex-col items-center space-y-2 mt-5">
                        <div className="flex items-center justify-between space-x-14">
                          <div className="flex flex-col items-center">
                            <FaBox className={`text-xl ${getTrackingStatusColor(submission.trackingStatus.wastePickUp)}`} />
                            <p className="text-sm mt-2">Waste Pick Up</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <FaTruck className={`text-xl ${getTrackingStatusColor(submission.trackingStatus.sentToYou)}`} />
                            <p className="text-sm mt-2">Waste Shipping</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <FaCheckCircle className={`text-xl ${getTrackingStatusColor(submission.trackingStatus.orderReceived)}`} />
                            <p className="text-sm mt-2">Waste Received</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-lg text-gray-500">No accepted deliveries for submissions.</p>
              )}
        
              {/* Pending Deliveries for Donations */}
              {donations.filter((donation) => donation.status === "Donation Confirmed").length > 0 ? (
                <div className="flex flex-col space-y-5 mt-5">
                  {donations.filter(
                    (donation) => donation.status === "Donation Confirmed" && !donation.trackingStatus.orderReceived
                  ).map((donation) => (
                    <div key={donation.id} className="p-4 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600">
                      <p className="text-sm mb-2"><strong>Industry Name:</strong> {donation.industryName}</p>
                      <p className="text-sm mb-2"><strong>Category:</strong> {donation.wasteCategory}</p>
        
                      {/* Progress Tracking for Donations */}
                      <div className="flex flex-col items-center space-y-2 mt-5">
                        <div className="flex items-center justify-between space-x-14">
                          <div className="flex flex-col items-center">
                            <FaBox className={`text-xl ${getTrackingStatusColor(donation.trackingStatus.wastePickUp)}`} />
                            <p className="text-sm mt-2">Waste Pick Up</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <FaTruck className={`text-xl ${getTrackingStatusColor(donation.trackingStatus.sentToYou)}`} />
                            <p className="text-sm mt-2">Waste Shipping</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <FaCheckCircle className={`text-xl ${getTrackingStatusColor(donation.trackingStatus.orderReceived)}`} />
                            <p className="text-sm mt-2">Waste Received</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-lg text-gray-500">No pending deliveries for donations.</p>
              )}
            </div>
          );
        
        
          case "history":
            return (
              <div className="flex flex-col space-y-5 mt-5">
                {/* History for Submissions */}
                {submissions.filter((submission) => submission.trackingStatus.orderReceived).map((submission) => (
                  <div key={submission.id} className="p-4 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600">
                    <p className="text-sm mb-2"><strong>UMKM Name:</strong> {submission.umkmName}</p>
                    <p className="text-sm mb-2"><strong>Category:</strong> {submission.wasteNeeds}</p>
                    <p className="text-green-500 font-semibold">
                      ✅ Delivery successfully completed! Congrats, you have successfully sent your waste.
                    </p>
                  </div>
                ))}
          
                {/* History for Donations */}
                {donations.filter((donation) => donation.trackingStatus.orderReceived).map((donation) => (
                  <div key={donation.id} className="p-4 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600">
                    <p className="text-sm mb-2"><strong>Industry Name:</strong> {donation.industryName}</p>
                    <p className="text-sm mb-2"><strong>Category:</strong> {donation.wasteCategory}</p>
                    <p className="text-green-500 font-semibold">
                      ✅ Delivery successfully completed! Congrats, you have successfully donated your waste.
                    </p>
                  </div>
                ))}
              </div>
            );
          

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start space-y-3">
      <h1 className="text-xl font-semibold mb-2 text-[#0A4635] text-left">Activity</h1>
      <div className="relative flex space-x-4 border-b border-[#0A4635]/30 mb-5">
        {["submission", "delivery", "history"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 ${activeTab === tab ? "font-bold text-[#0A4635]" : "text-gray-600"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="mt-5">{renderContent()}</div>
    </div>
  );
}
