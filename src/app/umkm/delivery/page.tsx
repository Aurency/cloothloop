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
  const [donations, setDonations] = useState<{
    id: string;
    industryName: string;
    wasteCategory: string;
    subCategory: string;
    weight: number;
    wasteImage: string;
    status: string;
    trackingStatus: {
      wastePickUp: boolean;
      sentToYou: boolean;
      orderReceived: boolean;
    };
  }[]>([]);
  const [history, setHistory] = useState<{
    type: string;
    industryName: string;
    wasteCategory: string;
    message: string;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDonations = async () => {
      try {
        const donationsQuery = query(collection(db, "donations"));
        const donationsSnapshot = await getDocs(donationsQuery);
        const donationsData = donationsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            industryName: data.industryName || "",
            wasteCategory: data.wasteCategory || "",
            subCategory: data.subCategory || "",
            weight: data.weight || 0,
            wasteImage: data.wasteImage || "",
            status: data.status || "",
            trackingStatus: data.trackingStatus || {
              wastePickUp: false,
              sentToYou: false,
              orderReceived: false,
            },
          };
        });

        setDonations(donationsData);
      } catch (err) {
        console.error("Error fetching donations:", err);
      }
    };

    fetchSubmissions();
    fetchDonations();
  }, []);

  const getTrackingStatusColor = (status: boolean) => {
    return status ? "text-green-500" : "text-gray-500";
  };

  // Filter data for Delivery tab
  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.status === "Accepted" && !submission.trackingStatus.orderReceived
  );

  const filteredDonations = donations.filter(
    (donation) => donation.status === "Donation Confirmed" && !donation.trackingStatus.orderReceived
  );

  // Move completed submissions and donations to History
  const updateHistoryData = () => {
    const completedSubmissions = submissions.filter(
      (submission) => submission.trackingStatus.orderReceived
    );

    const completedDonations = donations.filter(
      (donation) => donation.trackingStatus.orderReceived
    );

    const allHistory = [
      ...completedSubmissions.map((submission) => ({
        type: "Submission",
        industryName: submission.industryCompanyName,
        wasteCategory: submission.industryWasteNeeds,
        message: "✅ Delivery successfully completed! Congrats, you have successfully received your waste.",
      })),
      ...completedDonations.map((donation) => ({
        type: "Donation",
        industryName: donation.industryName,
        wasteCategory: donation.wasteCategory,
        message: "✅ Delivery successfully completed! Congrats, you have successfully received your waste.",
      })),
    ];

    setHistory(allHistory);
  };

  // Function to handle the removal of items from the Delivery tab
  const removeFromDelivery = () => {
    const updatedSubmissions = submissions.filter(
      (submission) => !submission.trackingStatus.orderReceived
    );

    const updatedDonations = donations.filter(
      (donation) => !donation.trackingStatus.orderReceived
    );

    setSubmissions(updatedSubmissions);
    setDonations(updatedDonations);
  };

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
            {/* Submission Delivery */}
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-gray-800">Submission Delivery</h2>
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
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No confirmed submissions found.</p>
              )}
            </div>

            {/* Donation Delivery */}
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-gray-800">Donation Delivery</h2>
              {filteredDonations.length > 0 ? (
                <div className="flex flex-col space-y-5 mt-5">
                  {filteredDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="p-4 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600"
                    >
                      <p className="text-sm mb-2">
                        <strong>Industry:</strong> {donation.industryName}
                      </p>
                      <p className="text-sm mb-2">
                        <strong>Category:</strong> {donation.wasteCategory}
                      </p>
                      <p className="text-sm mb-2">
                        <strong>Status:</strong>{" "}
                        <span className="font-semibold text-green-500">
                          {donation.status}
                        </span>
                      </p>

                      {/* Tracking Status */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center justify-between space-x-14">
                          <div className="flex flex-col items-center">
                            <FaBox
                              className={`text-xl ${getTrackingStatusColor(
                                donation.trackingStatus.wastePickUp
                              )}`}
                            />
                            <p className="text-sm mt-2">Waste Pick Up</p>
                          </div>

                          <div className="flex flex-col items-center">
                            <FaTruck
                              className={`text-xl ${getTrackingStatusColor(
                                donation.trackingStatus.sentToYou
                              )}`}
                            />
                            <p className="text-sm mt-2">Waste Shipping</p>
                          </div>

                          <div className="flex flex-col items-center">
                            <FaCheckCircle
                              className={`text-xl ${getTrackingStatusColor(
                                donation.trackingStatus.orderReceived
                              )}`}
                            />
                            <p className="text-sm mt-2">Waste Received</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No confirmed donations found.</p>
              )}
            </div>
          </div>
        );

      case "history":
        return (
          <div>
            {history.length > 0 ? (
              <div className="flex flex-col space-y-5 mt-5">
                <h2 className="text-lg font-semibold text-gray-800">History</h2>
                <div>
                  {/* Submission History */}
                  <h3 className="text-md font-semibold text-gray-700">Submissions</h3>
                  {history.filter(entry => entry.type === "Submission").map((entry, index) => (
                    <div
                      key={index}
                      className="p-4 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600"
                    >
                      <p className="text-sm mb-2">
                        <strong>Industry Name:</strong> {entry.industryName}
                      </p>
                      <p className="text-sm mb-2">
                        <strong>Waste Category:</strong> {entry.wasteCategory}
                      </p>
                      <p className="text-sm mb-2">
                        <strong>Message:</strong> {entry.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  {/* Donation History */}
                  <h3 className="text-md font-semibold text-gray-700">Donations</h3>
                  {history.filter(entry => entry.type === "Donation").map((entry, index) => (
                    <div
                      key={index}
                      className="p-4 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600"
                    >
                      <p className="text-sm mb-2">
                        <strong>Industry Name:</strong> {entry.industryName}
                      </p>
                      <p className="text-sm mb-2">
                        <strong>Waste Category:</strong> {entry.wasteCategory}
                      </p>
                      <p className="text-sm mb-2">
                        <strong>Message:</strong> {entry.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-lg text-gray-500">No completed deliveries found.</p>
            )}
          </div>
        );

      case "donations":
        return (
          <div>
            {donations.length > 0 ? (
              <div className="flex flex-col space-y-5 mt-5">
                {donations.map((donation) => (
                  <div
                    key={donation.id}
                    className="p-4 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600"
                  >
                    <p className="text-sm mb-2">
                      <strong>Industry Name:</strong> {donation.industryName}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Waste Category:</strong> {donation.wasteCategory}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Sub Category:</strong> {donation.subCategory}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Weight:</strong> {donation.weight} kg
                    </p>
                    {donation.wasteImage && (
                      <img
                        src={donation.wasteImage}
                        alt="Waste"
                        className="w-full h-32 object-cover rounded-md"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg text-gray-500">No donations found.</p>
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
        {["submission", "donations", "delivery", "history"].map((tab) => (
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