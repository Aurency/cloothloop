import { useState } from "react";

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const AgreementModal = ({ isOpen, onClose, onAccept }: AgreementModalProps) => {
  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Agreement</h2>
        <p className="mb-4 text-sm text-gray-600">
          Dengan melanjutkan, Anda setuju dengan syarat dan ketentuan berikut:
          <br />
          - Anda bertanggung jawab atas pengajuan yang diajukan.
          <br />- Informasi yang diberikan harus sesuai fakta.
        </p>
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
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            disabled={!isChecked}
            className={`px-4 py-2 rounded-md ${
              isChecked
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
