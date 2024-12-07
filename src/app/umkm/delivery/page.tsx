"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseconfig";
import { FaBox, FaTruck, FaCheckCircle } from "react-icons/fa";

export default function DeliveryPage() {
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

  const [industryDeliveries, setIndustryDeliveries] = useState<{
    id: string;
    umkmName: string;
    wasteCategory: string;
    status: string;
    trackingStatus: {
      wastePickUp: boolean;
      sentToYou: boolean;
      orderReceived: boolean;
    };
  }[]>([]);

  // Fetch submissions for the logged-in UMKM (User)
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("User is not logged in.");
          return;
        }

        // Query for submissions filtered by "umkmId"
        const submissionsQuery = query(
          collection(db, "submission"),
          where("umkmId", "==", user.uid) // Filter based on UMKM ID
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

  // Fetch deliveries for the logged-in Industry (User)
  useEffect(() => {
    const fetchIndustryDeliveries = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("User is not logged in.");
          return;
        }

        // Query for deliveries filtered by "industryId"
        const industryQuery = query(
          collection(db, "submission"),
          where("industryId", "==", user.uid) // Filter based on Industry ID
        );

        const industrySnapshot = await getDocs(industryQuery);
        const industryData = industrySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            umkmName: data.umkmName || "Unknown UMKM",
            wasteCategory: data.industryWasteNeeds || "N/A",
            status: data.status || "Pending",
            trackingStatus: data.trackingStatus || {
              wastePickUp: false,
              sentToYou: false,
              orderReceived: false,
            },
          };
        });

        setIndustryDeliveries(industryData);
      } catch (err) {
        console.error("Error fetching industry deliveries:", err);
      }
    };

    fetchIndustryDeliveries();
  }, []);

  // Function to determine the color for the progress stage
  const getTrackingStatusColor = (status: boolean) => {
    return status ? "text-green-500" : "text-gray-500";
  };

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
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      submission.status === "Rejected"
                        ? "text-red-500"
                        : submission.status === "Accepted"
                        ? "text-green-500"
                        : "text-gray-600"
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

      {/* Card 2: Delivery */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold text-[#0A4635] mb-4">Delivery</h2>

        {submissions.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {/* Filter only accepted submissions */}
            {submissions
              .filter((submission) => submission.status === "Accepted")
              .map((submission) => (
                <div key={submission.id} className="p-4 bg-white rounded-lg shadow min-h-[100px]">
                  <p className="text-sm mb-2">
                    <strong>Industry:</strong> {submission.industryCompanyName}
                  </p>
                  <p className="text-sm mb-2">
                    <strong>Category:</strong> {submission.industryWasteNeeds}
                  </p>
                  <p className="text-sm mb-4">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`font-semibold ${
                        submission.status === "Accepted"
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {submission.status}
                    </span>
                  </p>

                  {/* Progress Tracking */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center justify-between space-x-8">
                      <div className="flex flex-col items-center">
                        <FaBox className={`text-xl ${getTrackingStatusColor(submission.trackingStatus.wastePickUp)}`} />
                        <p className="text-sm">Waste Pick Up</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <FaTruck className={`text-xl ${getTrackingStatusColor(submission.trackingStatus.sentToYou)}`} />
                        <p className="text-sm">Waste Shipping</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <FaCheckCircle className={`text-xl ${getTrackingStatusColor(submission.trackingStatus.orderReceived)}`} />
                        <p className="text-sm">Waste Received</p>
                      </div>
                    </div>

                    {/* Congrats Message */}
                    {submission.trackingStatus.orderReceived && (
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

      {/* Card 3: Industry Delivery */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold text-[#0A4635] mb-4">
          Industry Deliveries
        </h2>

        {industryDeliveries.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {industryDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="p-4 bg-white rounded-lg shadow min-h-[100px]"
              >
                <p className="text-sm mb-2">
                  <strong>UMKM Name:</strong> {delivery.umkmName}
                </p>
                <p className="text-sm mb-2">
                  <strong>Category:</strong> {delivery.wasteCategory}
                </p>
                <p className="text-sm mb-4">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      delivery.status === "Rejected"
                        ? "text-red-500"
                        : delivery.status === "Accepted"
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {delivery.status}
                  </span>
                </p>

                {/* Progress Tracking */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center justify-between space-x-8">
                    <div className="flex flex-col items-center">
                      <FaBox
                        className={`text-xl ${getTrackingStatusColor(
                          delivery.trackingStatus.wastePickUp
                        )}`}
                      />
                      <p className="text-sm">Waste Pick Up</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <FaTruck
                        className={`text-xl ${getTrackingStatusColor(
                          delivery.trackingStatus.sentToYou
                        )}`}
                      />
                      <p className="text-sm">Waste Shipping</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <FaCheckCircle
                        className={`text-xl ${getTrackingStatusColor(
                          delivery.trackingStatus.orderReceived
                        )}`}
                      />
                      <p className="text-sm">Order Received</p>
                    </div>
                  </div>

                  {/* Congrats Message */}
                  {delivery.trackingStatus.orderReceived && (
                    <p className="text-green-500 text-sm font-semibold">
                      🎉 Waste delivery successfully completed!
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-500">No deliveries found for the industry.</p>
        )}
      </div>
    </div>
  );
}
