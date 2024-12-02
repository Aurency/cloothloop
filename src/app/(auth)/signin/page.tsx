"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Untuk membaca data dari Firestore
import { auth, db } from "@/lib/firebaseconfig"; // Menggunakan alias path
import Link from "next/link"; // Untuk navigasi

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirectUrl, setRedirectUrl] = useState(""); // URL tujuan untuk redirect

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Sign in pengguna
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid; // Mendapatkan UID pengguna

      // Ambil data pengguna dari Firestore berdasarkan UID
      const userDoc = await getDoc(doc(db, "users", userId));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User Data: ", userData); // Log untuk memeriksa data pengguna
        const role = userData?.role; // Ambil role pengguna dari Firestore dan pastikan ada

        // Tentukan URL berdasarkan role
        if (role === "UMKM") {
          setRedirectUrl("/dashboard-umkm"); // Arahkan ke dashboard UMKM
        } else if (role === "industri") {
          setRedirectUrl("/dashboard-industri"); // Arahkan ke dashboard Industri
        } else {
          setError("Role tidak valid atau tidak ditemukan. Hubungi admin.");
        }
      } else {
        setError("Data pengguna tidak ditemukan.");
      }
    } catch (err) {
      console.error("Error saat login:", err);
      setError("Gagal masuk. Periksa email dan password Anda.");
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
      </form>

      {/* Redirect Message */}
      {redirectUrl && (
        <div className="mt-4">
          <p className="text-green-500 text-sm">Sign-in successful!</p>
          <Link
            href={redirectUrl}
            className="text-blue-500 underline hover:text-blue-700"
          >
            Go to your dashboard
          </Link>
        </div>
      )}

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