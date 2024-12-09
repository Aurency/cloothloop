"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Untuk membaca data dari Firestore
import { auth, db } from "@/lib/firebaseconfig"; // Firebase konfigurasi
import Link from "next/link"; // Untuk navigasi
import { useRouter } from "next/navigation";

export default function SignInAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Fungsi untuk mendapatkan role admin dari Firestore berdasarkan UID
  const getRoleAndRedirect = async (uid: string) => {
    try {
      // Cek data pengguna di koleksi "admin"
      const adminDoc = await getDoc(doc(db, "admin", uid));
      if (adminDoc.exists() && adminDoc.data().role === "admin") {
        router.push("/admin"); // Redirect ke halaman Admin
        return;
      }

      // Jika data tidak ditemukan atau role tidak cocok
      setError("Role tidak ditemukan atau Anda bukan admin.");
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
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const userId = userCredential.user.uid;
      await getRoleAndRedirect(userId);
    } catch (err) {
      console.error("Error saat login:", err);
      setError("Gagal masuk. Periksa email dan password Anda.");
    }
  };

  return (
    <div
      className="flex flex-col items-center bg-cover justify-center h-screen"
      style={{ backgroundImage: "url('/assets/bg-signin.png')" }}
    >
      <h1 className="text-2xl font-medium mb-6 text-white">Admin Sign In</h1>
      <form
        onSubmit={handleSignIn}
        className="bg-white/50 px-6 py-4 rounded-[24px] shadow-md w-96"
      >
        <div className="p-y-3 mt-2">
          {/* Input Email */}
          <div className="mb-4">
            <label className="block text-gray-600 font-normal mb-2">Email</label>
            <input
              type="username"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Input Password */}
          <div className="mb-4">
            <label className="block text-gray-600 font-normal mb-2">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {/* Button Sign In */}
          <button
            type="submit"
            className="w-full bg-[#0A4635] text-white py-2 rounded-full hover:bg-[#086532] transition"
          >
            Sign In
          </button>
        </div>
      </form>

      {/* Link ke Sign Up */}
      <div className="mt-4 text-white font-light">
        <p>Not an admin? Return to partner sign in:</p>
        <Link
          href="/auth/signin"
          className="text-[#568fea] underline hover:text-[#357ae8]"
        >
          Partner Sign In
        </Link>
      </div>
    </div>
  );
}