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


  useEffect(() => {
    if (!industryId) return;
  
    const donationsQuery = query(
      collection(db, "donations"),
      where("industryId", "==", industryId)
    );
  
    const unsubscribe = onSnapshot(donationsQuery, (snapshot) => {
      const fetchedDonations = snapshot.docs.map((doc) => {
        const donationData = doc.data();
        console.log("Donation Data:", donationData); // Debug log
        return {
          id: doc.id,
          industryName: donationData.industryName || "Unknown",
          wasteCategory: donationData.wasteCategory || "Unknown",
          status: donationData.status || "Pending",
          trackingStatus: donationData.trackingStatus || {
            wastePickUp: false,
            sentToYou: false,
            orderReceived: false,
          },
        };
      });
  
      setDonations(fetchedDonations);
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
    <div className="mt-5 space-y-8">
      {/* Submission Delivery */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Submission Delivery</h2>
        {submissions.filter((submission) => submission.status === "Accepted").length > 0 ? (
          <div className="space-y-5">
            {submissions
              .filter((submission) => submission.status === "Accepted")
              .map((submission) => (
                <div
                  key={submission.id}
                  className="p-4 border border-[#0A4635]/30 rounded-lg text-gray-600"
                >
                  <p><strong>UMKM Name:</strong> {submission.umkmName}</p>
                  <p><strong>Category:</strong> {submission.wasteNeeds}</p>
                  <div className="flex justify-around mt-4">
                    <div className="flex flex-col items-center">
                      <FaBox
                        className={`text-xl ${getTrackingStatusColor(submission.trackingStatus.wastePickUp)}`}
                      />
                      <p className="text-sm mt-1">Waste Pick Up</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <FaTruck
                        className={`text-xl ${getTrackingStatusColor(submission.trackingStatus.sentToYou)}`}
                      />
                      <p className="text-sm mt-1">Waste Shipping</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <FaCheckCircle
                        className={`text-xl ${getTrackingStatusColor(submission.trackingStatus.orderReceived)}`}
                      />
                      <p className="text-sm mt-1">Waste Received</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500">No submission deliveries available.</p>
        )}
      </div>

      {/* Donation Delivery */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Donation Delivery</h2>
        {donations.filter((donation) => donation.status === "Donation Confirmed").length > 0 ? (
          <div className="space-y-5">
            {donations
              .filter((donation) => donation.status === "Donation Confirmed")
              .map((donation) => (
                <div
                  key={donation.id}
                  className="p-4 border border-[#0A4635]/30 rounded-lg text-gray-600"
                >
                  <p><strong>Industry Name:</strong> {donation.industryName}</p>
                  <p><strong>Category:</strong> {donation.wasteCategory}</p>
                  <div className="flex justify-around mt-4">
                    <div className="flex flex-col items-center">
                      <FaBox
                        className={`text-xl ${getTrackingStatusColor(donation.trackingStatus.wastePickUp)}`}
                      />
                      <p className="text-sm mt-1">Waste Pick Up</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <FaTruck
                        className={`text-xl ${getTrackingStatusColor(donation.trackingStatus.sentToYou)}`}
                      />
                      <p className="text-sm mt-1">Waste Shipping</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <FaCheckCircle
                        className={`text-xl ${getTrackingStatusColor(donation.trackingStatus.orderReceived)}`}
                      />
                      <p className="text-sm mt-1">Waste Received</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500">No donation deliveries available.</p>
        )}
      </div>
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
      <h1 className="text-xl font-semibold mb-2 text-[#0A4635] text-left">
        Activity
      </h1>

      <div className="relative flex space-x-4 border-b border-[#0A4635]/30">
        {["submission", "delivery", "history"].map((tab) => (
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

      <div className="mt-4">{renderContent()}</div>
    </div>
  );
}