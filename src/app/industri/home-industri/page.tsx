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
import { auth, db } from "@/lib/firebaseconfig"; // Firebase configuration
import { useRouter } from "next/navigation";
import AgreementModal from "@/components/agree/AgreementModal";

export default function HomeIndustri() {
  const [umkms, setUmkms] = useState<
    { id: string; businessName: string; wasteNeeds: string }[]
  >([]);
  const [industryCategory, setIndustryCategory] = useState<string | null>(null);
  const [industryName, setIndustryName] = useState<string | null>(null); // Store industry name
  const [selectedUmkmId, setSelectedUmkmId] = useState<string | null>(null); // Store selected UMKM ID
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDonationSuccessful, setIsDonationSuccessful] = useState(false); // Confirmation state
  const router = useRouter();

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
          setIndustryCategory(data?.wasteNeeds || null); // Set wasteNeeds
          setIndustryName(data?.companyName || null); // Set companyName
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
    setSelectedUmkmId(umkmId); // Set selected UMKM ID
    setIsModalOpen(true);
  };

  const handleAcceptAgreement = async () => {
    if (!selectedUmkmId) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User is not logged in");
        return;
      }

      // Fetch UMKM data based on umkmId
      const umkmRef = doc(db, "umkm", selectedUmkmId);
      const umkmDoc = await getDoc(umkmRef);

      if (!umkmDoc.exists()) {
        console.error("UMKM not found");
        return;
      }

      const umkmData = umkmDoc.data();

      // Prepare data for donation
      const donationData = {
        umkmId: selectedUmkmId, // ID of the selected UMKM
        industryId: user.uid, // ID of the industry (user)
        umkmName: umkmData.businessName || "Unknown", // UMKM name
        umkmWasteNeeds: umkmData.wasteNeeds || "Unknown", // UMKM category
        industryName: industryName || "Unknown", // Industry name
        industryWasteNeeds: industryCategory || "Unknown", // Industry category
        status: "Pending", // Initial status of donation
        createdAt: new Date(),
      };

      // Submit the data to Firestore
      await addDoc(collection(db, "donations"), donationData);

      setIsModalOpen(false); // Close the modal
      setIsDonationSuccessful(true); // Show confirmation message

      setTimeout(() => {
        setIsDonationSuccessful(false); // Hide confirmation after 3 seconds
      }, 3000);
    } catch (err) {
      console.error("Error submitting donation:", err);
    }
  };

  return (
    <div>
      {/* Modal for Agreement */}
      <AgreementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccept={handleAcceptAgreement}
      />

      {/* Monthly Donation Graph */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#0A4635] mb-4">
          Grafik Donasi Bulanan
        </h2>
        <div className="flex flex-row md:flex-col items-start gap-6 bg-white rounded-lg  p-4 border-[1px] border-[#0A4635]/30">
          <div className="flex h-[300px] w-full bg-gray-200 items-center justify-center rounded-md">
            {/* Placeholder for graph */}
            <span className="text-gray-600">Graph Placeholder</span>
          </div>

          <div className="flex-1">
            <p className="text-gray-600 mb-4 text-center text-sm">
              Grafik Donasi Bulanan ini menunjukkan total donasi yang terkumpul
              pada setiap bulan. Data ini dapat membantu Anda memahami bagaimana
              masyarakat berkontribusi dan dapat digunakan untuk perencanaan
              lebih lanjut.
            </p>
          </div>   
        </div>
      </div>

      {/* UMKM Recommendations */}
      <div className="mb-8">
        <h1 className="text-xl text-[#0A4635] font-semibold mb-4">
          Rekomendasi UMKM
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
                      Kategori: {umkm.wasteNeeds}
                    </p>
                  </div>
                  <div className="mt-auto flex justify-end">
                    <button
                      onClick={() => handleDonationClick(umkm.id)} // Pass UMKM ID
                      className="px-4 py-2 bg-[#0A4635] text-white text-sm rounded-md hover:bg-gray-700 transition"
                    >
                      Donasi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-500">
            Tidak ada UMKM yang cocok dengan kategori Anda.
          </p>
        )}
      </div>

      {/* Waste Categories */}
      <div>
        <h2 className="text-xl font-semibold text-[#0A4635] mb-4">
          Kategori Limbah
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 ">
          <div className="p-6 rounded-lg border-[1px] border-[#0A4635]/30">
            <h3 className="text-lg font-semibold text-[#0A4635] mb-2">
              Pra-Konsumsi
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Limbah Produksi Serat</li>
              <li>Serat Tekstil Berlebih</li>
              <li>Produk cacat produksi</li>
              <li>Benang dan serat berlebih</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg border-[1px] border-[#0A4635]/30">
            <h3 className="text-lg font-semibold text-[#0A4635] mb-2">
              Pasca-Konsumsi
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Pakaian bekas</li>
              <li>Aksesoris kain yang rusak</li>
              <li>Tekstil yang tidak terpakai</li>
            </ul>
          </div>
        </div>
        <div className="bg-[#0A4635] text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Keterangan Kondisi</h3>
          <p className="text-gray-200">
            Limbah kategori ini dapat didaur ulang untuk mengurangi dampak
            lingkungan.
          </p>
        </div>
      </div>
    </div>
  );
}