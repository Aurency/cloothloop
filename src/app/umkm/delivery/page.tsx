"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseconfig";
import { FaBox, FaTruck, FaCheckCircle } from "react-icons/fa";

export default function DeliveryPage() {
  const [activeTab, setActiveTab] = useState("submission");
  const [submissions, setSubmissions] = useState<{
    id: string;
    industryCompanyName: string;
    industryWasteNeeds: string;
    status: string;
    trackingStatus: {
      wastePickUp: boolean;
      sentToYou: boolean;
      orderReceived: boolean;
    };
  }[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("User is not logged in.");
          return;
        }

        const submissionsQuery = query(
          collection(db, "submission"),
          where("umkmId", "==", user.uid)
        );

        const submissionsSnapshot = await getDocs(submissionsQuery);
        const submissionsData = submissionsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            industryCompanyName: data.industryCompanyName || "",
            industryWasteNeeds: data.industryWasteNeeds || "",
            status: data.status || "",
            trackingStatus: data.trackingStatus || {
              wastePickUp: false,
              sentToYou: false,
              orderReceived: false,
            },
          };
        });

        setSubmissions(submissionsData);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
    };

    fetchSubmissions();
  }, []);

  const getTrackingStatusColor = (status: boolean) => {
    return status ? "text-green-500" : "text-gray-500";
  };

  // Filter data untuk tab Delivery
  const filteredSubmissions = submissions.filter(
    (submission) => submission.status === "Accepted" && !submission.trackingStatus.orderReceived
  );

  // Redirect ke History jika semua kartu selesai
  useEffect(() => {
    if (filteredSubmissions.length === 0 && activeTab === "delivery") {
      setActiveTab("history");
    }
  }, [filteredSubmissions, activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "submission":
        return (
          <div>
            {submissions.length > 0 ? (
              <div className="flex flex-col space-y-5 mt-5">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="p-4 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600"
                  >
                    <p className="text-sm mb-2">
                      <strong>UMKM Name:</strong> {submission.industryCompanyName}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Category:</strong> {submission.industryWasteNeeds}
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg text-gray-500">No submissions found.</p>
            )}
          </div>
        );

      case "delivery":
        return (
          <div>
            {filteredSubmissions.length > 0 ? (
              <div className="flex flex-col space-y-5 mt-5">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="p-4 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600"
                  >
                    <p className="text-sm mb-2">
                      <strong>Industry:</strong> {submission.industryCompanyName}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Category:</strong> {submission.industryWasteNeeds}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Status:</strong>{" "}
                      <span className="font-semibold text-green-500">
                        {submission.status}
                      </span>
                    </p>

                    {/* Progress Tracking */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center justify-between space-x-14">
                        <div className="flex flex-col items-center">
                          <FaBox
                            className={`text-xl ${getTrackingStatusColor(
                              submission.trackingStatus.wastePickUp
                            )}`}
                          />
                          <p className="text-sm mt-2">Waste Pick Up</p>
                        </div>

                        <div className="flex flex-col items-center">
                          <FaTruck
                            className={`text-xl ${getTrackingStatusColor(
                              submission.trackingStatus.sentToYou
                            )}`}
                          />
                          <p className="text-sm mt-2">Waste Shipping</p>
                        </div>

                        <div className="flex flex-col items-center">
                          <FaCheckCircle
                            className={`text-xl ${getTrackingStatusColor(
                              submission.trackingStatus.orderReceived
                            )}`}
                          />
                          <p className="text-sm mt-2">Waste Received</p>
                        </div>
                      </div>

                      {/* Congrats Message */}
                      {submission.trackingStatus.orderReceived && (
                        <p className="text-green-500 text-sm font-semibold mt-10">
                          🎉 Congratulations! Your waste order has been successfully
                          received!
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No accepted deliveries.</p>
            )}
          </div>
        );

      case "history":
        return (
          <div>
            {submissions.length > 0 ? (
              <div className="flex flex-col space-y-5 mt-5">
                {submissions
                  .filter((submission) => submission.trackingStatus.orderReceived)
                  .map((submission) => (
                    <div
                      key={submission.id}
                      className="p-4 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600"
                    >
                      <p className="text-sm mb-2">
                        <strong>Industry:</strong> {submission.industryCompanyName}
                      </p>
                      <p className="text-sm mb-2">
                        <strong>Category:</strong> {submission.industryWasteNeeds}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <FaCheckCircle className="text-green-500 text-xl" />
                        <p className="text-sm font-semibold text-green-500">
                          Delivery successfully completed!
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-lg text-gray-500">No completed orders found in history.</p>
            )}
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
