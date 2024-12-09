"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseconfig";
import { useRouter } from "next/navigation";
import { deleteUser } from "firebase/auth";
import LocationForm from "@/components/landing-com/LocationForm";

export default function ProfileIndustri() {
  const [formData, setFormData] = useState({
    companyName: "",
    businessLicenseNumber: "",
    email: "",
    phoneNumber: "",
    businessAddress: "",
    wasteNeeds: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "industri", user.uid);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const userRef = doc(db, "industri", user?.uid || "");
      await updateDoc(userRef, formData);

      setSuccess(true);
      setError("");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleLocationChange = async (location: { businessAddress: string; lat: number; lng: number }) => {
    try {
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...location,
      }));

      if (user?.uid) {
        const userRef = doc(db, "industri", user.uid);
        await updateDoc(userRef, location); // Simpan ke Firestore
        setSuccess(true);
        setError("");
      }
    } catch (err) {
      console.error("Error updating location:", err);
      setError("Failed to update location. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this account? All data will be lost and cannot be recovered!"
      );
      if (!confirmDelete) return;

      const userRef = doc(db, "industri", user?.uid || "");
      await deleteDoc(userRef);

      if (user) {
        await deleteUser(user);
        router.push("/auth/signin");
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-5 text-[#0A4635] text-left">
        Industry Profile
      </h1>

      <div className="p-6 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600">
        <h2 className="text-xl font-semibold text-[#0A4635] mb-6">
          Company Details
        </h2>

        {!isEditing ? (
          <div className="space-y-4 text-gray-600">
            {/* Tampilkan data */}
            {Object.entries(formData)
              .filter(([key]) => 
                !["role", "password", "uid", "createdAt", "lat", "lng"].includes(key)
              )
              .map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                  <span className="text-sm">{value || "-"}</span>
                </div>
              ))}
          </div>
        
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="space-y-6"
          >
            <LocationForm onLocationChange={handleLocationChange} />

            {/* Input lainnya */}
            {["companyName", "businessLicenseNumber", "email", "phoneNumber", "wasteNeeds"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium capitalize">{field.replace(/([A-Z])/g, " $1")}:</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field as keyof typeof formData] as string}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none"
                />
              </div>
            ))}

            {success && (
              <p className="text-green-500 text-sm">Profile updated successfully!</p>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#0A4635] text-white py-2 rounded-md hover:bg-[#086532] transition mt-6"
            >
              Save Changes
            </button>
          </form>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#0A4635] text-white py-2 px-4 rounded-md hover:bg-[#086532] transition"
          >
            Edit Profile
          </button>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
