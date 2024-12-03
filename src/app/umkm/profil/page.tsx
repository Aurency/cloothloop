"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseconfig"; // Konfigurasi Firebase
import { useRouter } from "next/navigation"; // Router Next.js
import { deleteUser } from "firebase/auth"; // Untuk menghapus akun pengguna dari Firebase Auth

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    ownerName: "",
    businessName: "",
    email: "",
    phoneNumber: "",
    businessAddress: "",
    wasteNeeds: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Untuk menangani proses penghapusan
  const router = useRouter();

  // Ambil UID pengguna yang sedang login
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin"); // Jika tidak login, arahkan ke halaman Sign In
      return;
    }
    // Ambil data dari Firestore
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "umkm", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setFormData(docSnap.data() as typeof formData);
        } else {
          console.error("No such document!");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const userRef = doc(db, "umkm", user?.uid || "");
      await updateDoc(userRef, formData);

      setSuccess(true);
      setError("");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    }
  };

  // Fungsi untuk menghapus data pengguna dari Firestore dan akun dari Firebase Auth
  const handleDeleteAccount = async () => {
    try {
      // Konfirmasi sebelum menghapus akun
      const confirmDelete = window.confirm(
        "Apakah Anda yakin ingin menghapus akun ini? Semua data akan hilang dan tidak bisa dipulihkan!"
      );
      if (!confirmDelete) return;

      // Hapus data pengguna dari Firestore
      const userRef = doc(db, "umkm", user?.uid || "");
      await deleteDoc(userRef);

      // Hapus akun pengguna dari Firebase Auth
      if (user) {
        await deleteUser(user);
        router.push("/auth/signin"); // Arahkan kembali ke halaman Sign In setelah hapus akun
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white relative">
      {/* Judul My Profile di luar card */}
      <h1 className="text-3xl font-bold mb-2 text-[#0A4635] text-left absolute top-10 left-10">
        My Profile
      </h1>

      <div className="bg-white p-10 rounded-lg shadow-lg max-w-5xl w-full mt-16">
        <h2 className="text-2xl font-bold text-[#0A4635] mb-6">Detail Profil</h2>

        {/* Tampilkan data pengguna */}
        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-lg">Nama:</span>
              <span className="text-lg">{formData.ownerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-lg">Email:</span>
              <span className="text-lg">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-lg">Nomor Telepon:</span>
              <span className="text-lg">{formData.phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-lg">Alamat:</span>
              <span className="text-lg">{formData.businessAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-lg">Kebutuhan Limbah:</span>
              <span className="text-lg">{formData.wasteNeeds}</span>
            </div>
          </div>
        ) : (
          // Form edit data pengguna
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium">Nama:</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Nomor Telepon:</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Alamat:</label>
              <input
                type="text"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Kebutuhan Limbah:</label>
              <select
                name="wasteNeeds"
                value={formData.wasteNeeds}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              >
                <option value="pre-consumption">Pre-Consumption</option>
                <option value="post-consumption">Post-Consumption</option>
              </select>
            </div>

            {/* Pesan sukses atau error */}
            {success && (
              <p className="text-green-500 text-sm">Profil berhasil diperbarui!</p>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Tombol Simpan */}
            <button
              type="submit"
              className="w-full bg-[#0A4635] text-white py-2 rounded-md hover:bg-[#086532] transition mt-6"
            >
              Simpan Perubahan
            </button>
          </form>
        )}

        {/* Tombol Edit dan Hapus di bawah, ujung kanan */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#0A4635] text-white py-2 px-4 rounded-md hover:bg-[#086532] transition"
          >
            Edit Profil
          </button>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
          >
            Hapus Akun
          </button>
        </div>
      </div>
    </div>
  );
}
