"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseconfig";
import { FaBox, FaTruck, FaCheckCircle } from "react-icons/fa"; // Import icons

export default function DeliveryPage2() {
  const [activeTab, setActiveTab] = useState("submission");

  const [submissions, setSubmissions] = useState<{
    id: string;
    umkmName: string;
    wasteNeeds: string;
    status: string;
    trackingStatus: {
      wastePickUp:  boolean;
      sentToYou: boolean;
      orderReceived:  boolean;
    };
    hidden?: boolean; // Menambahkan properti untuk menyembunyikan UI
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
      const fetchedSubmissions = snapshot.docs.map((doc) => {
        const submissionData = doc.data();
        return {
          id: doc.id,
          umkmName: submissionData.umkmName || "Unknown",
          wasteNeeds: submissionData.wasteNeeds || "Unknown",
          status: submissionData.status || "Pending",
          trackingStatus: submissionData.trackingStatus || { wastePickUp: "Pending", sentToYou: "Pending", orderReceived: "Pending" },
        };
      });

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
          submission.id === submissionId
            ? { ...submission, status, hidden: status === "Rejected" }
            : submission
        )
      );

      console.log(`Submission ${submissionId} updated to ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getTrackingStatusColor = (status: string | boolean) => {
    if (status === true) return "text-green-500"; // Completed
    if (status === false) return "text-red-500"; // Rejected
    return status === "Pending" ? "text-gray-500" : "text-gray-500"; // Pending or In Progress
  };

  const renderContent = () => {
    switch (activeTab) {
      case "submission":
        return (
          <div className="mt-5 space-y-5" >
            {submissions.length > 0 ? (
                submissions.map(
                  (submission) =>
                    !submission.hidden && ( // Hanya render jika tidak tersembunyi
                      <div key={submission.id} className="p-4 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600 mb-4">
                        <p className="text-sm mb-2">
                          <strong>UMKM Name:</strong> {submission.umkmName}
                        </p>
                        <p className="text-sm mb-2">
                          <strong>Category:</strong> {submission.wasteNeeds}
                        </p>
                        <p className="text-sm">
                          <strong>Status:</strong>{" "}
                          <span
                            className={`font-semibold ${
                              submission.status === "Rejected"
                                ? "text-red-600"
                                : submission.status === "Accepted"
                                ? "text-green-500"
                                : "text-orange-500"
                            }`}
                          >
                            {submission.status}
                          </span>
                        </p>

                        {/* Kondisional rendering untuk tombol atau teks Complete */}
                        {submission.status === "Accepted" ? (
                          <p className="text-green-500 text-sm font-semibold mt-2">Complete ✅</p>
                        ) : (
                          <div className="flex justify-end space-x-5 mt-0">
                            <button
                              onClick={() => handleStatusChange(submission.id, "Accepted")}
                              className={`px-3 py-1 text-white rounded-md text-sm ${
                                submission.status === "Pending"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-gray-300 cursor-not-allowed"
                              }`}
                              disabled={submission.status !== "Pending"}
                            >
                              Agree
                            </button>
                            <button
                              onClick={() => handleStatusChange(submission.id, "Rejected")}
                              className={`px-3 py-1 text-white rounded-md text-sm ${
                                submission.status === "Pending"
                                  ? "bg-red-500 hover:bg-red-600"
                                  : "bg-gray-300 cursor-not-allowed"
                              }`}
                              disabled={submission.status !== "Pending"}
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    )
                )
              ) : (
                <p className="text-sm text-gray-600">No submissions available.</p>
              )}
          </div>
        );

      case "delivery":
        return (
          <div>
            {submissions.length > 0 ? (
                <div className="flex flex-col space-y-5 mt-5">
                  {/* Filter only accepted submissions */}
                  {submissions
                    .filter((submission) => submission.status === "Accepted")
                    .map((submission) => (
                      <div 
                      key={submission.id} 
                      className="p-4 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600">
                        <p 
                        className="text-sm mb-2">
                          <strong>UMKM Name:</strong>{" "}
                          {submission.umkmName}
                        </p>
                        <p 
                        className="text-sm mb-2">
                          <strong>Category:</strong>{" "}
                          {submission.wasteNeeds}
                        </p>
                        <p className="text-sm mb-2">
                          <strong>Status:</strong>{" "}
                          <span
                            className={`font-semibold ${
                              submission.status === "Accepted"
                                ? "text-green-500"
                                : "text-orange-500"
                            }`}
                          >
                            {submission.status}
                          </span>
                        </p>

                        {/* Progress Tracking */}
                        <div className="flex flex-col items-center space-y-2">
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

                          {/* Congrats Message */}
                          {submission.trackingStatus.orderReceived === true && (
                            <p className="text-green-500 text-sm font-semibold">
                              🎉 Congratulations! Your waste order has been successfully received!
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
              </div>
            ) : (
              <p className="text-lg text-gray-500">No accepted deliveries found.</p>
            )}
          </div>
        );

      {/*bagian history*/}
      case "history":
        return (
          <div className="flex flex-col space-y-5 mt-5">
            <div className="p-4 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600">
              <h2>History</h2>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start space-y-3">
      <h1
      className="text-xl font-semibold mb-2 text-[#0A4635] text-left">
        Activity</h1>

      <div className="relative flex space-x-4 border-b border-[#0A4635]/30 mb-5">
        {["submission", "delivery", "history"].map((tab) => (
          <button
            key={tab} // Untuk identifikasi unik oleh React
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 relative ${
              activeTab === tab
                ? "font-bold text-[#0A4635]"
                : "font-medium text-gray-600"
            } hover:text-[#0A4635] transition-all duration-300 ease-in-out`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} {/* Capitalize Text */}

            {/* Border-Bottom Animation */}
            <span
              className={`absolute left-0 bottom-0 w-full h-[2px] ${
                activeTab === tab
                  ? "bg-[#0A4635] scale-x-100" // Active tab
                  : "bg-transparent scale-x-0" // Inactive tab
              } transform transition-all duration-300 ease-in-out`}
            />
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-5">{renderContent()}</div>
    </div>
  );
}