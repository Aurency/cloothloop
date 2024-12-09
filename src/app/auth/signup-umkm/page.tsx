"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebaseconfig";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import LocationForm from "@/components/landing-com/LocationForm"; // Import the LocationForm component

export default function SignUpUMKM() {
  const [formData, setFormData] = useState({
    ownerName: "",
    businessName: "",
    email: "",
    phoneNumber: "",
    businessAddress: "",
    lat: null as number | null,
    lng: null as number | null,
    password: "",
    wasteNeeds: "",
  });
  

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (location: { businessAddress: string; lat: number; lng: number }) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      businessAddress: location.businessAddress,
      lat: location.lat,
      lng: location.lng,
    }));
  };

  const saveUserDataToFirestore = async (uid: string, data: any) => {
    const userRef = doc(db, "umkm", uid);
    await setDoc(userRef, data);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validasi lat dan lng
    if (formData.lat === null || formData.lng === null) {
      setError("Location must be specified.");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
  
      // Simpan data pengguna ke Firestore
      await saveUserDataToFirestore(user.uid, {
        ...formData,
        uid: user.uid,
        role: "umkm", // Tetapkan peran UMKM
        createdAt: new Date().toISOString(),
      });
  
      setSuccess(true);
      setError("");
  
      // Redirect ke dashboard UMKM
      router.push("/umkm");
    } catch (err) {
      setError("Registration failed. Please check your details.");
    }
  };  

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Simpan data pengguna ke Firestore
      await saveUserDataToFirestore(user.uid, {
        ownerName: user.displayName || "Google User",
        businessName: "Your Business Name",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        businessAddress: "Address not provided", // Default value if not provided
        lat: null,
        lng: null,
        wasteNeeds: "Not specified",
        uid: user.uid,
        role: "umkm",
        createdAt: new Date().toISOString(),
      });

      router.push("/umkm");
    } catch (err) {
      setError("Failed to sign up with Google. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F2E8D8] py-10">
      <h1 className="text-4xl font-bold text-[#0A4635] mb-8">UMKM Registration</h1>
      <form
        onSubmit={handleSignUp}
        className="bg-white p-8 rounded shadow-md max-w-lg w-full"
      >
        {/* Form fields */}
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
        <label className="block text-gray-700 font-medium mb-2"></label>
          <LocationForm onLocationChange={handleLocationChange} />
          <div className="text-xs text-gray-400 underline mt-1/2">*please direct the pin map to fill the address</div>
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

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">Registration successful!</p>}

        <button type="submit" className="w-full bg-[#0A4635] text-white py-2 rounded-md">
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

      <p className="mt-4 text-sm text-gray-700">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[#0A4635] underline hover:font-semibold">Signin here</Link>
      </p>
    </div>
  );
}
