"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebaseconfig";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { doc, setDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State untuk efek loading
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true); // Mulai loading
    try {
      // Buat akun pengguna di Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Dapatkan UID pengguna
      const userId = userCredential.user.uid;

      // Simpan data pengguna ke Firestore
      await setDoc(doc(db, "users", userId), {
        fullName: fullName,
        email: email,
        role: "user", // Tambahkan role otomatis sebagai "user"
        createdAt: new Date(),
      });

      toast.success("Account created successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      // Redirect ke halaman utama setelah 3 detik
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err: any) {
      console.error("Error creating account:", err.message);
      toast.error(`Error creating account: ${err.message}`, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  return (
    <div
      className="relative flex min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/signup.jpg')" }}
    >
      {/* Toast Notification */}
      <ToastContainer />

      {/* Left Section */}
      <div className="flex-1 flex items-center justify-center bg-black bg-opacity-50">
        <h1 className="text-6xl font-bold text-white">Create Your Account!</h1>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center bg-black bg-opacity-50">
        <form className="w-full max-w-md space-y-6" onSubmit={handleSignUp}>
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-white"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter Your Full Name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Your Email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter Your Password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute top-1/2 bottom-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white"
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm Your Password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute top-1/2 bottom-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FiEyeOff size={20} />
              ) : (
                <FiEye size={20} />
              )}
            </button>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`w-full px-4 py-2 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#143F6B] hover:bg-blue-700"
              }`}
              disabled={isLoading} // Tombol dinonaktifkan saat loading
            >
              {isLoading ? "Processing..." : "Sign Up"}
            </button>
          </div>

          <div className="text-sm text-center mt-4 text-white">
            Already have an account?{" "}
            <a
              href="/auth/sign-in"
              className="font-medium text-blue-400 hover:underline"
            >
              Sign In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
