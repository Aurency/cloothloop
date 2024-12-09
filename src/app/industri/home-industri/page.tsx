"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebaseconfig";
import { useRouter } from "next/navigation";
import AgreementModal2 from "@/components/agree/AgreementModal2";
import MonthlyDonationChart from "@/components/chart/MonthlyDonationChart";

export default function HomeIndustri() {
  const [umkms, setUmkms] = useState<
    {
      id: string;
      businessName: string;
      wasteNeeds: string;
    }[]
  >([]);
  const [industryCategory, setIndustryCategory] = useState<string | null>(null);
  const [industryName, setIndustryName] = useState<string | null>(null);
  const [businessAddress, setBusinessAddress] = useState<string | null>(null);
  const [selectedUmkmId, setSelectedUmkmId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDonationSuccessful, setIsDonationSuccessful] = useState(false);
  const router = useRouter();

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `donations/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const fetchUmkms = async (category: string) => {
    try {
      const umkmsQuery = query(
        collection(db, "umkm"),
        where("wasteNeeds", "==", category)
      );
      const umkmsSnapshot = await getDocs(umkmsQuery);
      const umkmsData = umkmsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; businessName: string; wasteNeeds: string }[];

      setUmkms(umkmsData);
    } catch (err) {
      console.error("Error fetching UMKM data:", err);
    }
  };

  useEffect(() => {
    const fetchIndustryCategoryAndName = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push("/auth/signin");
          return;
        }

        const industryRef = doc(db, "industri", user.uid);
        const industryDoc = await getDoc(industryRef);

        if (industryDoc.exists()) {
          const data = industryDoc.data();
          setIndustryCategory(data?.wasteNeeds || null);
          setIndustryName(data?.companyName || null);
          setBusinessAddress(data?.businessAddress || null);
        } else {
          console.error("Industry data not found");
        }
      } catch (err) {
        console.error("Error fetching industry data:", err);
      }
    };

    fetchIndustryCategoryAndName();
  }, [router]);

  useEffect(() => {
    if (industryCategory) {
      fetchUmkms(industryCategory);
    }
  }, [industryCategory]);

  const handleDonationClick = (umkmId: string) => {
    setSelectedUmkmId(umkmId);
    setTimeout(() => setIsModalOpen(true), 0);
  };

  const handleAcceptAgreement2 = async (data: {
    subCategory: string;
    wasteImage: File | null;
    weight: number;
  }) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      if (!selectedUmkmId) {
        console.error("UMKM ID not selected");
        return;
      }

      const umkmRef = doc(db, "umkm", selectedUmkmId);
      const umkmDoc = await getDoc(umkmRef);
      if (!umkmDoc.exists()) {
        console.error("UMKM not found");
        return;
      }

      const industryRef = doc(db, "industri", user.uid);
      const industryDoc = await getDoc(industryRef);
      if (!industryDoc.exists()) {
        console.error("Industry not found");
        return;
      }

      const umkmData = umkmDoc.data();
      const industryData = industryDoc.data();

      let wasteImageUrl = "No image provided";
      if (data.wasteImage) {
        wasteImageUrl = await uploadImageToStorage(data.wasteImage);
      }

      const donationData = {
        industryId: user.uid,
        industryName: industryData?.companyName || "Unknown",
        businessAddress: industryData?.businessAddress || "Unknown",
        wasteCategory: industryData?.wasteNeeds || "Unknown",
        umkmId: selectedUmkmId,
        umkmName: umkmData?.businessName || "Unknown",
        wasteNeeds: umkmData?.wasteNeeds || "Unknown",
        umkmAddress: umkmData?.businessAddress || "Unknown",
        subCategory: data.subCategory,
        wasteImage: wasteImageUrl,
        weight: data.weight || 0,
        createdAt: new Date(),
        status: "Donation Confirmed",
      };

      await addDoc(collection(db, "donations"), donationData);

      setIsModalOpen(false);
      setIsDonationSuccessful(true);

      setTimeout(() => {
        setIsDonationSuccessful(false);
      }, 3000);
    } catch (err) {
      console.error("Error submitting donation:", err);
    }
  };

  return (
    <div>
      {isModalOpen && (
        <AgreementModal2
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAccept={handleAcceptAgreement2}
          umkmId={selectedUmkmId!}
          industryId={auth.currentUser?.uid || ""}
        />
      )}

      {isDonationSuccessful && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md shadow-md">
          <p className="text-lg font-bold">Donation successfully submitted!</p>
          <p className="text-sm">Thank you for your contribution.</p>
        </div>
      )}

      {/* Monthly Donation Graph */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#0A4635] mb-4">
          Monthly Donation Chart
        </h2>
        <div className="flex flex-col md:flex-row items-start gap-6 bg-white rounded-lg shadow-md p-4">
          <div className="flex-1">
            <p className="text-gray-700 text-justify mb-4">
              This Monthly Donation Chart illustrates the total donations
              collected each month. The data provides valuable insights into
              community contributions and helps in planning future initiatives.
              Use this information to track progress and identify potential
              areas for improvement in donation activities.
            </p>
          </div>
          <div className="flex-1 h-[200px] bg-gray-200 flex items-center justify-center rounded-md">
            <MonthlyDonationChart />
          </div>
        </div>
      </div>

      {/* UMKM Recommendations */}
      <div className="mb-8">
        <h1 className="text-xl text-[#0A4635] font-semibold mb-4">
          UMKM Recommendations
        </h1>
        {umkms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {umkms.map((umkm) => (
              <div
                key={umkm.id}
                className="p-4 bg-white rounded-lg flex flex-col min-h-[200px] border-[1px] border-[#0A4635]/30"
              >
                <div className="flex flex-col h-full">
                  <div>
                    <h1 className="text-[#0A4635] font-bold">
                      {umkm.businessName}
                    </h1>
                    <p className="text-sm text-gray-600">
                      Category: {umkm.wasteNeeds}
                    </p>
                  </div>
                  <div className="mt-auto flex justify-end">
                    <button
                      onClick={() => handleDonationClick(umkm.id)}
                      className="px-4 py-2 bg-[#0A4635] text-white text-sm rounded-md hover:bg-gray-700 transition"
                    >
                      Donate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-500">
            No UMKM matches your category.
            <br />
            <span className="text-sm text-gray-400">
              Please complete your profile to get recommendations.
            </span>
          </p>
        )}
      </div>

      {/* Waste Categories */}
      <div>
        <h2 className="text-2xl font-bold text-[#0A4635] mb-4">
          Waste Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-[#0A4635] mb-2">
              Pre-Consumption
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Fiber Production Waste</li>
              <li>Excess Textile Fibers</li>
              <li>Defective Products</li>
              <li>Excess Yarn and Fibers</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-[#0A4635] mb-2">
              Post-Consumption
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Used Clothing</li>
              <li>Damaged Fabric Accessories</li>
              <li>Unused Textiles</li>
            </ul>
          </div>
        </div>
        <div className="bg-[#0A4635] text-white p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Condition Information</h3>
          <p className="text-gray-200">
            Waste in these categories can be recycled to reduce environmental
            impact.
          </p>
        </div>
      </div>
    </div>
  );
}
