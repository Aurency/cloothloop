"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebaseconfig";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import LocationForm from "@/components/landing-com/LocationForm"; // Import the LocationForm component

export default function SignUpIndustri() {
  const [formData, setFormData] = useState({
    companyName: "",
    businessLicenseNumber: "",
    email: "",
    phoneNumber: "",
    businessAddress: "",
    lat: null as number | null, // Add lat to store location latitude
    lng: null as number | null, // Add lng to store location longitude
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
    try {
      const userRef = doc(db, "industri", uid);
      await setDoc(userRef, data);
      console.log("User data saved to Firestore successfully:", data);
    } catch (error) {
      console.error("Error saving user data to Firestore:", error);
      throw new Error("Failed to save user data.");
    }
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
  
      // Save user data to Firestore with 'role: industry'
      await saveUserDataToFirestore(user.uid, {
        ...formData,
        uid: user.uid,
        role: "industri", // Adding the industry role
        createdAt: new Date().toISOString(),
      });
  
      setSuccess(true);
      setError(""); // Clear any previous error
      console.log("User created and data saved:", formData);
  
      // Redirect to industry page
      router.push("/industri");
    } catch (err) {
      console.error("Error during sign-up:", err);
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
        businessAddress: "Address not provided",
        lat: null,
        lng: null,
        provider: "google",
        role: "industri", // Adding the industry role
        uid: user.uid,
        createdAt: new Date().toISOString(),
      });
  
      setSuccess(true);
      setError(""); // Clear any previous error
      router.push("/industri");
    } catch (err) {
      console.error("Failed to sign up with Google:", err);
      setError("Failed to sign up with Google.");
    }
  };  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F2E8D8] py-10">
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

        {/* Business Address Location Form Component */}
        <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Businesse Address</label>
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

      <div className="mt-4 text-sm text-[#0A4635]">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[#0A4635] underline hover:font-semibold">
          Signin here
        </Link>
      </div>
    </div>
  );
}
