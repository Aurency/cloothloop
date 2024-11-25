"use client"

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseconfig"; // Menggunakan alias path
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Untuk menyimpan error

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Signed in successfully!");
      // Tidak langsung redirect, pengguna bisa klik link untuk menuju dashboard
    } catch (err) {
      setError("Error signing in. Please check your credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Sign In</h1>
      <form
        onSubmit={handleSignIn}
        className="bg-white p-6 rounded shadow-md w-80"
      >
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
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-[#0A4635] text-white py-2 rounded-md hover:bg-[#086532] transition"
        >
          Sign In
        </button>
      </form>
      {/* Link untuk navigasi ke dashboard */}
      <div className="mt-4">
        <p>Dont have account ? Register here:</p>
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
