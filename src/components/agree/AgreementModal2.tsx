import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebaseconfig";

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (data: { subCategory: string; wasteImage: File | null; weight: number }) => void;
  umkmId: string;
  industryId: string;
}

const AgreementModal2 = ({
  isOpen,
  onClose,
  onAccept,
  umkmId,
  industryId
}: AgreementModalProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [subCategory, setSubCategory] = useState<string>("");
  const [wasteImage, setWasteImage] = useState<File | null>(null);
  const [weight, setWeight] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!wasteImage || !subCategory || !isChecked || weight <= 0) {
      alert("Please complete all the requirements and ensure valid donation weight.");
      return false;
    }
    return true;
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("File format must be JPEG or PNG.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB.");
        return;
      }
      setWasteImage(file);
    } else {
      setWasteImage(null);
    }
  };

  const handleWeightChange = (value: string) => {
    // Remove non-numeric characters except decimal point
    const cleanedValue = value.replace(/[^\d.]/g, '');
    
    // Parse the cleaned value
    const numericValue = parseFloat(cleanedValue);
    
    // Set weight if it's a valid positive number
    if (!isNaN(numericValue) && numericValue >= 0) {
      setWeight(numericValue);
    } else if (cleanedValue === '') {
      setWeight(0);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `donations/${industryId}/${wasteImage!.name}`);
      const snapshot = await uploadBytes(storageRef, wasteImage!);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Simpan data ke Firestore
      const donationsRef = collection(db, "donations");
      await addDoc(donationsRef, {
        umkmId,
        industryId,
        subCategory,
        weight, // Simpan berat donasi
        wasteImage: imageUrl,
        createdAt: new Date().toISOString()
      });

      // Panggil onAccept dengan data file asli
      onAccept({
        weight,
        subCategory,
        wasteImage,
      });

      alert("Donation successfully submitted!");
      onClose();
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Agreement</h2>
        <p className="mb-4 text-sm text-gray-600">
          Dengan melanjutkan, Anda setuju dengan syarat dan ketentuan berikut:
          <br />
          - Anda bertanggung jawab atas pengajuan yang diajukan.
          <br />
          - Informasi yang diberikan harus sesuai fakta.
        </p>

        <div className="mb-4">
          <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-1">
            Sub-Category
          </label>
          <select
            id="subCategory"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value="" disabled>
              Pilih Sub-Kategori
            </option>
            <option value="Utuh">Utuh</option>
            <option value="Cacat">Cacat</option>
            <option value="Mikro">Mikro</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="wasteImage" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Waste Image
          </label>
          <input
            id="wasteImage"
            type="file"
            accept="image/*"
            className="w-full"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Donation Weight (Kg)
          </label>
          <input
            id="weight"
            type="number"
            step="0.01"
            min="0"
            placeholder="Enter weight in Kg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={weight}
            onChange={(e) => handleWeightChange(e.target.value)}
          />
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="agreement"
            className="mr-2"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <label htmlFor="agreement" className="text-sm">
            Saya setuju dengan syarat dan ketentuan
          </label>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isChecked || !subCategory || !wasteImage || weight <= 0 || isSubmitting}
            className={`px-4 py-2 rounded-md ${
              isChecked && subCategory && wasteImage && weight > 0 && !isSubmitting
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgreementModal2;