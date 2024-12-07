"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseconfig"; // Firebase configuration
import { useRouter } from "next/navigation"; // Next.js router
import { deleteUser } from "firebase/auth"; // To delete user account from Firebase Auth

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    ownerName: "",
    businessName: "",
    email: "",
    phoneNumber: "",
    businessAddress: "",
    wasteNeeds: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // To handle the deletion process
  const router = useRouter();

  // Get the current logged-in user's UID
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin"); // If not logged in, redirect to Sign In page
      return;
    }
    // Fetch user data from Firestore
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "umkm", user.uid);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const userRef = doc(db, "umkm", user?.uid || "");
      await updateDoc(userRef, formData);

      setSuccess(true);
      setError("");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    }
  };

  // Function to delete user data from Firestore and account from Firebase Auth
  const handleDeleteAccount = async () => {
    try {
      // Confirm before deleting account
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this account? All data will be lost and cannot be recovered!"
      );
      if (!confirmDelete) return;

      // Delete user data from Firestore
      const userRef = doc(db, "umkm", user?.uid || "");
      await deleteDoc(userRef);

      // Delete user account from Firebase Auth
      if (user) {
        await deleteUser(user);
        router.push("/auth/signin"); // Redirect to Sign In page after account deletion
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account. Please try again.");
    }
  };

  return (
    <div>
      {/* Profile title outside of card */}
      <h1 className="text-xl font-semibold mb-5 text-[#0A4635] text-left">
        My Profile
      </h1>

      <div className="p-6 border-[1px] border-[#0A4635]/30 rounded-lg min-h-[100px] text-gray-600">
        <h2 className="text-xl font-semibold text-[#0A4635] mb-6">Profile Details</h2>

        {/* Display user data */}
        {!isEditing ? (
          <div className="space-y-4 text-gray-600">
            <div className="flex justify-between">
              <span className="font-medium text-sm">Owner Name:</span>
              <span className="text-sm">{formData.ownerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-sm">Business Name:</span>
              <span className="text-sm">{formData.businessName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-sm">Email:</span>
              <span className="text-sm">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-sm">Phone Number:</span>
              <span className="text-sm">{formData.phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-sm">Address:</span>
              <span className="text-sm">{formData.businessAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-sm">Waste Needs:</span>
              <span className="text-sm">{formData.wasteNeeds}</span>
            </div>
          </div>
        ) : (
          // Edit user data form
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium">Name:</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Business Name:</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Address:</label>
              <input
                type="text"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Waste Needs:</label>
              <select
                name="wasteNeeds"
                value={formData.wasteNeeds}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              >
                <option value="pre-consumption">Pre-Consumption</option>
                <option value="post-consumption">Post-Consumption</option>
              </select>
            </div>

            {/* Success or error message */}
            {success && (
              <p className="text-green-500 text-sm">Profile updated successfully!</p>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Save button */}
            <button
              type="submit"
              className="w-full bg-[#0A4635] text-white py-2 rounded-md hover:bg-[#086532] transition mt-6"
            >
              Save Changes
            </button>
          </form>
        )}

        {/* Edit and Delete buttons at the bottom, right side */}
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
