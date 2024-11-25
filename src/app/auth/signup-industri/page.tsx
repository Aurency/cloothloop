"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseconfig"; // Path alias untuk Firebase config
import Link from "next/link";

export default function SignUpIndustri() {
  const [formData, setFormData] = useState({
    companyName: "",
    businessLicenseNumber: "",
    email: "",
    phoneNumber: "",
    businessAddress: "",
    password: "",
    wasteNeeds: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      setSuccess(true);
      setError("");
    } catch (err) {
      setError("Pendaftaran gagal. Silakan periksa detail Anda.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F2E8D8]">
      <h1 className="text-3xl font-bold text-[#0A4635] mb-6">Industri</h1>
      <form
        onSubmit={handleSignUp}
        className="bg-white p-6 rounded shadow-md max-w-md w-full"
      >
        {/* Nama Perusahaan */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Nama perusahaan
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Ketik disini"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4635]"
          />
        </div>

        {/* Nomor Izin Usaha */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Nomor izin usaha</label>
          <input
            type="text"
            name="businessLicenseNumber"
            value={formData.businessLicenseNumber}
            onChange={handleChange}
            placeholder="Ketik disini"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4635]"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ketik disini"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4635]"
          />
        </div>

        {/* Nomor Telepon */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Nomor telepon
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Ketik disini"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4635]"
          />
        </div>

        {/* Alamat Usaha */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Alamat usaha
          </label>
          <input
            type="text"
            name="businessAddress"
            value={formData.businessAddress}
            onChange={handleChange}
            placeholder="Ketik disini"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4635]"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Ketik disini"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4635]"
          />
        </div>

        {/* Kebutuhan Limbah */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Kebutuhan limbah
          </label>
          <select
            name="wasteNeeds"
            value={formData.wasteNeeds}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4635]"
          >
            <option value="" disabled>
              Pilih kebutuhan limbah
            </option>
            <option value="small">Kebutuhan kecil</option>
            <option value="medium">Kebutuhan sedang</option>
            <option value="large">Kebutuhan besar</option>
          </select>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">Pendaftaran berhasil!</p>}

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-[#0A4635] text-white py-2 rounded-md hover:bg-[#086532] transition"
        >
          Daftar
        </button>
      </form>

      {/* Link ke SignIn */}
      <div className="mt-4">
        <p>Sudah punya akun?</p>
        <Link
          href="/signin"
          className="text-blue-500 underline hover:text-blue-700"
        >
          Masuk disini
        </Link>
      </div>
    </div>
  );
}
