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

export default function HomeIndustri() {
  const [umkms, setUmkms] = useState<{
    id: string;
    businessName: string;
    wasteNeeds: string;
  }[]>([]);
  const [industryCategory, setIndustryCategory] = useState<string | null>(null);
  const [industryName, setIndustryName] = useState<string | null>(null);
  const [businessAddress, setBusinessAddress] = useState<string | null>(null);
  const [selectedUmkmId, setSelectedUmkmId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDonationSuccessful, setIsDonationSuccessful] = useState(false);
  const router = useRouter();

  // Fungsi untuk mengunggah gambar ke Firebase Storage
  const uploadImageToStorage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `donations/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  // Fetch UMKM berdasarkan kategori industri
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

  // Fetch data industri (kategori, nama, dan alamat)
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

  // Fetch UMKM ketika kategori industri diperbarui
  useEffect(() => {
    if (industryCategory) {
      fetchUmkms(industryCategory);
    }
  }, [industryCategory]);

  // Saat tombol donasi ditekan, pilih UMKM dan buka modal
  const handleDonationClick = (umkmId: string) => {
    setSelectedUmkmId(umkmId);
    setTimeout(() => setIsModalOpen(true), 0); // Pastikan state sudah diperbarui sebelum membuka modal
  };

  // Fungsi untuk menyimpan donasi ke Firestore
  const handleAcceptAgreement2 = async (data: { subCategory: string; wasteImage: File | null; weight: number }) => {
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

      // Fetch data UMKM
      const umkmRef = doc(db, "umkm", selectedUmkmId);
      const umkmDoc = await getDoc(umkmRef);
      if (!umkmDoc.exists()) {
        console.error("UMKM not found");
        return;
      }

      // Fetch data industri
      const industryRef = doc(db, "industri", user.uid);
      const industryDoc = await getDoc(industryRef);
      if (!industryDoc.exists()) {
        console.error("Industry not found");
        return;
      }

      const umkmData = umkmDoc.data();
      const industryData = industryDoc.data();

      // Upload gambar ke Firebase Storage jika ada
      let wasteImageUrl = "No image provided";
      if (data.wasteImage) {
        wasteImageUrl = await uploadImageToStorage(data.wasteImage);
      }

      // Siapkan data donasi
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

      // Simpan data ke koleksi donations
      await addDoc(collection(db, "donations"), donationData);

      // Tutup modal dan tampilkan pesan sukses
      setIsModalOpen(false);
      setIsDonationSuccessful(true);

      // Sembunyikan pesan sukses setelah 3 detik
      setTimeout(() => {
        setIsDonationSuccessful(false);
      }, 3000);
    } catch (err) {
      console.error("Error submitting donation:", err);
    }
  };

  return (
    <div>
      {/* Modal for Agreement */}
      {isModalOpen && (
        <AgreementModal2
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAccept={handleAcceptAgreement2}
          umkmId={selectedUmkmId!}
          industryId={auth.currentUser?.uid || ""}
        />
      )}

      {/* Donation Confirmation */}
      {isDonationSuccessful && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md shadow-md">
          <p className="text-lg font-bold">Donation successfully submitted!</p>
          <p className="text-sm">Thank you for your participation.</p>
        </div>
      )}

      {/* UMKM Recommendations */}
      <div className="mb-8">
        <h1 className="text-xl text-[#0A4635] font-semibold mb-4">
          UMKM Recommendation
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
            <span className="text-sm text-gray-400">You must complete your profile.</span>
          </p>
        )}
      </div>
    </div>
  );
}
