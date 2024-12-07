import { useState } from "react";

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (data: { subCategory: string; wasteImage: File | null }) => void;
}

const AgreementModal = ({ isOpen, onClose, onAccept }: AgreementModalProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [subCategory, setSubCategory] = useState<string>(""); // Dropdown state
  const [wasteImage, setWasteImage] = useState<File | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Agreement</h2>
        <p className="mb-4 text-sm text-gray-600">
          Dengan melanjutkan, Anda setuju dengan syarat dan ketentuan berikut:
          <br />
          - Anda bertanggung jawab atas pengajuan yang diajukan.
          <br />- Informasi yang diberikan harus sesuai fakta.
        </p>

        {/* Dropdown for Sub-Category */}
        <div className="mb-4">
          <label
            htmlFor="subCategory"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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

        {/* Upload Waste Image */}
        <div className="mb-4">
          <label
            htmlFor="wasteImage"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Upload Waste Image
          </label>
          <input
            id="wasteImage"
            type="file"
            accept="image/*"
            className="w-full"
            onChange={(e) => setWasteImage(e.target.files?.[0] || null)}
          />
        </div>

        {/* Agreement Checkbox */}
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

        {/* Action Buttons */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => onAccept({ subCategory, wasteImage })}
            disabled={!isChecked || !subCategory || !wasteImage}
            className={`px-4 py-2 rounded-md ${
              isChecked && subCategory && wasteImage
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgreementModal;
