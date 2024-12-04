"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseconfig"; // Firebase configuration
import { useRouter } from "next/navigation";
import AgreementModal from "@/components/agree/AgreementModal";

export default function Homeumkm() {
  const [industries, setIndustries] = useState<{
    id: string;
    companyName: string;
    wasteNeeds: string;
  }[]>([]);
  const [userCategory, setUserCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    const fetchUserCategory = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push("/auth/signin");
          return;
        }

        const userRef = doc(db, "umkm", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUserCategory(userDoc.data()?.wasteNeeds || null);
        } else {
          console.error("User data not found");
        }
      } catch (err) {
        console.error("Error fetching user category:", err);
      }
    };

    fetchUserCategory();
  }, [router]);

  useEffect(() => {
    if (userCategory) {
      fetchIndustries(userCategory);
    }
  }, [userCategory]);

  const handlePengajuanClick = () => {
    setIsModalOpen(true);
  };

  const handleAcceptAgreement = () => {
    setIsModalOpen(false);
    router.push("/form-pengajuan"); // Redirect to submission form
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
        <h2 className="text-2xl font-semibold text-[#0A4635]">Welcome to ClothLoop</h2>
        <p className="mt-4 text-lg text-gray-600">
          This is your home page! Start using the app and explore the features.
        </p>
      </div>

      {/* Industry Information */}
      <h1 className="text-2xl text-[#0A4635] font-semibold mb-6">Industry Information</h1>

      {/* Industry Grid */}
      {industries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry) => (
            <div
              key={industry.id}
              className=" p-4 bg-white rounded-lg shadow-md flex flex-col min-h-[200px]"
            >
              <div className="flex flex-col h-full">
                <div>
                  <h1 className="text-[#0A4635] font-bold">{industry.companyName}</h1>
                  <p className="text-sm text-gray-600">
                    Category: {industry.wasteNeeds}
                  </p>
                </div>

                {/* Move Submission button to the bottom right */}
                <div className="mt-auto flex justify-end">
                  <button
                    onClick={handlePengajuanClick}
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
        <p className="text-lg text-gray-500">No industry matches your category.</p>
      )}
    </div>
  );
}
