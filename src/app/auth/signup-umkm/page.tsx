"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation"; // Next.js router
import { auth, db } from "@/lib/firebaseconfig"; // Ensure Firebase is properly configured
import { doc, setDoc } from "firebase/firestore"; // Firestore setup
import Link from "next/link";

export default function SignUpUMKM() {
  const [formData, setFormData] = useState({
    ownerName: "",
    businessName: "",
    email: "",
    phoneNumber: "",
    businessAddress: "",
    password: "",
    wasteNeeds: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveUserDataToFirestore = async (uid: string, data: any) => {
    const userRef = doc(db, "umkm", uid);
    await setDoc(userRef, data);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Save user data to Firestore
      await saveUserDataToFirestore(user.uid, {
        ...formData,
        uid: user.uid,
        role: "umkm", // Assign the UMKM role
        createdAt: new Date().toISOString(),
      });

      setSuccess(true);
      setError("");

      // Redirect to UMKM dashboard
      router.push("/umkm"); // Replace with the actual UMKM dashboard URL
    } catch (err) {
      setError("Registration failed. Please check your details.");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user data to Firestore
      await saveUserDataToFirestore(user.uid, {
        ownerName: user.displayName || "Google User",
        businessName: "Your Business Name",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        businessAddress: "Address not provided",
        wasteNeeds: "Not specified",
        uid: user.uid,
        role: "umkm", // Assign the UMKM role
        createdAt: new Date().toISOString(),
      });

      // Redirect to UMKM dashboard
      router.push("/umkm"); // Replace with the actual UMKM dashboard URL
    } catch (err) {
      setError("Failed to sign up with Google. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F2E8D8]">
      <h1 className="text-4xl font-bold text-[#0A4635] mb-8">UMKM Registration</h1>
      <form
        onSubmit={handleSignUp}
        className="bg-white p-8 rounded shadow-md max-w-lg w-full"
      >
        {/* Owner Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Owner Name</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4635]"
          />
        </div>

        {/* Business Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Business Name</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Enter your business name"
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
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4635]"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4635]"
          />
        </div>

        {/* Business Address */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Business Address</label>
          <input
            type="text"
            name="businessAddress"
            value={formData.businessAddress}
            onChange={handleChange}
            placeholder="Enter your business address"
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
            placeholder="Enter a password"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4635]"
          />
        </div>

        {/* Waste Needs */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Waste Needs</label>
          <select
            name="wasteNeeds"
            value={formData.wasteNeeds}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4635]"
          >
            <option value="" disabled>Select waste needs</option>
            <option value="pre-consumption">Pre-Consumption</option>
            <option value="post-consumption">Post-Consumption</option>
          </select>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm mb-4">
            Registration successful! Welcome aboard.
          </p>
        )}

        {/* Sign Up Button */}
        <button
          type="submit"
          className="w-full bg-[#0A4635] text-white py-2 rounded-md hover:bg-[#086532] transition"
        >
          Sign Up
        </button>

        {/* Google Sign-Up Button */}
        <button
          onClick={handleGoogleSignUp}
          className="mt-4 w-full bg-[#4285F4] text-white py-2 rounded-md hover:bg-[#357ae8] transition"
        >
          Sign Up with Google
        </button>
      </form>

      {/* Link to Sign In */}
      <div className="mt-6">
        <p>Already have an account?</p>
        <Link
          href="/auth/signin"
          className="text-blue-500 underline hover:text-blue-700"
        >
          Log in here
        </Link>
      </div>
    </div>
  );
}
