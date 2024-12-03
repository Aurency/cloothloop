"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation"; // Next.js router
import { auth, db } from "@/lib/firebaseconfig"; // Ensure Firebase is properly configured
import { doc, setDoc } from "firebase/firestore"; // Firestore setup
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
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveUserDataToFirestore = async (uid: string, data: any) => {
    const userRef = doc(db, "industri", uid);
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

      // Save user data to Firestore with 'role: industry'
      await saveUserDataToFirestore(user.uid, {
        ...formData,
        uid: user.uid,
        role: "industri", // Adding the industry role
        createdAt: new Date().toISOString(),
      });

      setSuccess(true);
      setError("");

      // Redirect to industry page
      router.push("/industri"); // Replace with the actual industry page URL
    } catch (err) {
      setError("Registration failed. Please check your details.");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user data to Firestore with 'role: industry'
      await saveUserDataToFirestore(user.uid, {
        email: user.email,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber || "",
        provider: "google",
        role: "industri", // Adding the industry role
        uid: user.uid,
        createdAt: new Date().toISOString(),
      });

      setSuccess(true);
      setError("");

      // Redirect to industry page
      router.push("/industri"); // Replace with the actual industry page URL
    } catch (err) {
      setError("Failed to sign up with Google.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F2E8D8]">
      <h1 className="text-4xl font-bold text-[#0A4635] mb-8">Industry Registration</h1>
      <form
        onSubmit={handleSignUp}
        className="bg-white p-8 rounded shadow-md max-w-lg w-full"
      >
        {/* Company Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter your company name"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4635]"
          />
        </div>

        {/* Business License Number */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Business License Number</label>
          <input
            type="text"
            name="businessLicenseNumber"
            value={formData.businessLicenseNumber}
            onChange={handleChange}
            placeholder="Enter your license number"
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
          href="/signin"
          className="text-blue-500 underline hover:text-blue-700"
        >
          Log in here
        </Link>
      </div>
    </div>
  );
}
