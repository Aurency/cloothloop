"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Untuk membaca data dari Firestore
import { auth, db } from "@/lib/firebaseconfig"; // Firebase konfigurasi
import Link from "next/link"; // Untuk navigasi
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  // Fungsi untuk mendapatkan role dari koleksi Firestore berdasarkan UID
  const getRoleAndRedirect = async (uid: string) => {
    try {
      // Cek data pengguna di koleksi "umkm"
      const umkmDoc = await getDoc(doc(db, "umkm", uid));
      if (umkmDoc.exists()) {
        router.push("/umkm"); // Redirect ke halaman UMKM
        return;
      }

      // Cek data pengguna di koleksi "industri"
      const industriDoc = await getDoc(doc(db, "industri", uid));
      if (industriDoc.exists()) {
        router.push("/industri"); // Redirect ke halaman Industri
        return;
      }

      // Jika data tidak ditemukan di kedua koleksi
      setError("Role tidak ditemukan. Hubungi admin.");
    } catch (err) {
      console.error("Error saat membaca data pengguna:", err);
      setError("Terjadi kesalahan saat memuat data pengguna.");
    }
  };

  // Fungsi untuk Sign In menggunakan email dan password
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error sebelumnya
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      await getRoleAndRedirect(userId);
    } catch (err) {
      console.error("Error saat login:", err);
      setError("Gagal masuk. Periksa email dan password Anda.");
    }
  };

  // Fungsi untuk Sign In menggunakan Google
  const handleGoogleSignIn = async () => {
    setError(""); // Reset error sebelumnya
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Periksa role dan redirect
      await getRoleAndRedirect(user.uid);
    } catch (err) {
      console.error("Error saat login dengan Google:", err);
      setError("Gagal masuk dengan Google. Coba lagi.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Sign In</h1>
      <form
        onSubmit={handleSignIn}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        {/* Input Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Input Password */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {/* Button Sign In */}
        <button
          type="submit"
          className="w-full bg-[#0A4635] text-white py-2 rounded-md hover:bg-[#086532] transition"
        >
          Sign In
        </button>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="mt-4 w-full bg-[#4285F4] text-white py-2 rounded-md hover:bg-[#357ae8] transition"
        >
          Sign In with Google
        </button>
      </form>

      {/* Link ke Sign Up */}
      <div className="mt-4">
        <p>Don't have an account? Register here:</p>
        <Link
          href="/partner"
          className="text-blue-500 underline hover:text-blue-700"
        >
          Signup
        </Link>
      </div>
    </div>
  );
}
