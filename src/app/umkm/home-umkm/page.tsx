"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, getDoc, addDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseconfig"; // Firebase configuration
import { useRouter } from "next/navigation";
import AgreementModal from "@/components/agree/AgreementModal";

export default function HomeUMKM() {
  const [industries, setIndustries] = useState<{
    id: string;
    companyName: string;
    wasteNeeds: string;
  }[]>([]);
  const [userCategory, setUserCategory] = useState<string | null>(null);
  const [userBusinessName, setUserBusinessName] = useState<string | null>(null); // Store business name
  const [selectedIndustryId, setSelectedIndustryId] = useState<string | null>(null); // Store selected industry ID
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false); // Confirmation state
  const [showCompleteProfileMessage, setShowCompleteProfileMessage] = useState(false); // Show profile completion message
  const router = useRouter();

  const fetchIndustries = async (category: string) => {
    try {
      const industriesQuery = query(
        collection(db, "industri"),
        where("wasteNeeds", "==", category)
      );
      const industriesSnapshot = await getDocs(industriesQuery);
      const industriesData = industriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; companyName: string; wasteNeeds: string }[];

      setIndustries(industriesData);
    } catch (err) {
      console.error("Error fetching industries:", err);
    }
  };

  useEffect(() => {
    const fetchUserCategoryAndBusinessName = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push("/auth/signin");
          return;
        }

        const userRef = doc(db, "umkm", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserCategory(data?.wasteNeeds || null); // Set wasteNeeds
          setUserBusinessName(data?.businessName || null); // Set businessName

          // Check if profile is incomplete
          if (!data?.businessName || !data?.wasteNeeds) {
            setShowCompleteProfileMessage(true);
          }
        } else {
          console.error("User data not found");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserCategoryAndBusinessName();
  }, [router]);

  useEffect(() => {
    if (userCategory) {
      fetchIndustries(userCategory);
    }
  }, [userCategory]);

  const handlePengajuanClick = (industryId: string) => {
    setSelectedIndustryId(industryId); // Set selected industry ID
    setIsModalOpen(true);
  };

  const handleAcceptAgreement = async () => {
    if (!selectedIndustryId) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User is not logged in");
        return;
      }

      // Ambil data industri berdasarkan industryId
      const industryRef = doc(db, "industri", selectedIndustryId);
      const industryDoc = await getDoc(industryRef);

      if (!industryDoc.exists()) {
        console.error("Industry not found");
        return;
      }

      const industryData = industryDoc.data();

      // Prepare data for submission
      const submissionData = {
        industryId: selectedIndustryId, // ID of the selected industry
        umkmId: user.uid, // ID of the UMKM (user)
        umkmName: userBusinessName || "Unknown", // UMKM name (businessName from user data)
        wasteNeeds: userCategory || "Unknown", // UMKM category (wasteNeeds from user data)
        industryCompanyName: industryData.companyName || "Unknown", // Company name from industry
        industryWasteNeeds: industryData.wasteNeeds || "Unknown", // Waste needs from industry
        status: "Pending", // Initial status of submission
        createdAt: new Date(),
      };

      // Submit the data to Firestore
      await addDoc(collection(db, "submission"), submissionData);

      setIsModalOpen(false); // Close the modal
      setIsSubmissionSuccessful(true); // Show confirmation message

      setTimeout(() => {
        setIsSubmissionSuccessful(false); // Hide confirmation after 3 seconds
      }, 3000);
    } catch (err) {
      console.error("Error submitting application:", err);
    }
  };

  return (
    <div className="min-h-screen">
      <AgreementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccept={handleAcceptAgreement}
      />

      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#0A4635]">Welcome to ClothLoop</h2>
        <p className="mt-4 text-lg text-gray-600">
          This is your home page! Start using the app and explore the features.
        </p>
      </div>

      {/* Profile Completion Message */}
      {showCompleteProfileMessage && (
        <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded-md shadow-md">
          <p>
            Your profile is incomplete. Please complete your information in the{" "}
            <span
              onClick={() => router.push("/umkm/profile")}
              className="underline text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              profile section
            </span>.
          </p>
        </div>
      )}

      {/* Confirmation Message */}
      {isSubmissionSuccessful && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md shadow-md">
          Submission successfully submitted!
        </div>
      )}

      {/* Industry Information */}
      <h1 
      className="text-xl text-[#0A4635] font-semibold mb-6">
        Industry Information
        </h1>

      {/* Industry Grid */}
      {industries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry) => (
            <div
              key={industry.id}
              className="p-4 bg-white rounded-lg flex flex-col min-h-[200px] border-[1px] border-[#0A4635]/30"
            >
              <div className="flex flex-col h-full">
                <div>
                  <h1 className="text-[#0A4635] font-semibold">{industry.companyName}</h1>
                  <p className="text-sm text-gray-600">
                    <strong className="font-semibold">Category:</strong>{" "}
                    {industry.wasteNeeds}
                  </p>
                </div>

                {/* Move Submission button to the bottom right */}
                <div className="mt-auto flex justify-end">
                  <button
                    onClick={() => handlePengajuanClick(industry.id)} // Pass industry ID
                    className="px-4 py-2 bg-[#0A4635] text-white text-sm rounded-md hover:bg-gray-700 transition"
                  >
                    Submission
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-500">
        No industry matches your category.<br />
        <span className="text-sm text-gray-400">You must complete your profile.</span>
      </p>
      )}
    </div>
  );
}
