"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebaseconfig"; // Firebase konfigurasi Anda
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from "firebase/firestore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Registrasi komponen Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Tipe data untuk state
interface MonthlyData {
  donations: number[];
  submissions: number[];
  labels: string[];
}

export default function Homeadmin() {
  const [totalUMKM, setTotalUMKM] = useState(0);
  const [totalIndustri, setTotalIndustri] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [monthlyData, setMonthlyData] = useState<MonthlyData>({
    donations: [],
    submissions: [],
    labels: [],
  });

  // Fungsi untuk mengambil data dari Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hitung total dokumen di masing-masing koleksi
        const umkmSnapshot = await getDocs(collection(db, "umkm"));
        const industriSnapshot = await getDocs(collection(db, "industri"));
        const submissionsSnapshot = await getDocs(collection(db, "submissions"));
        const donationsSnapshot = await getDocs(collection(db, "donations"));
  
        setTotalUMKM(umkmSnapshot.size);
        setTotalIndustri(industriSnapshot.size);
        setTotalSubmissions(submissionsSnapshot.size);
        setTotalDonations(donationsSnapshot.size);
  
        // Ambil data bulanan untuk grafik
        const donationsQuery = query(
          collection(db, "donations"), 
          orderBy("createdAt", "desc"), 
          limit(6)
        );
        const submissionsQuery = query(
          collection(db, "submissions"),
          where("status", "==", "Accepted"),
          orderBy("createdAt", "desc"),
          limit(6)
        );
  
        const donationsData = await getDocs(donationsQuery);
        const submissionsData = await getDocs(submissionsQuery);
  
        // Log seluruh data untuk debugging
        console.log("Raw Donations Data:", donationsData.docs.map(doc => ({
          id: doc.id, 
          data: doc.data()
        })));
        console.log("Raw Submissions Data:", submissionsData.docs.map(doc => ({
          id: doc.id, 
          data: doc.data()
        })));
  
        // Proses data donations
        const donationsAmount = donationsData.docs.map((doc) => {
          const data = doc.data();
          console.log("Donation document:", data);
          
          // Pastikan Anda menggunakan field yang benar untuk amount
          return data.amount || 0;
        });
        
        // Proses data submissions
        const submissionsAmount = submissionsData.docs.map((doc) => {
          const data = doc.data();
          console.log("Submission document:", data);
          return 1;
        });
        
        const labels = submissionsData.docs.map((doc) => {
          const data = doc.data();
          const timestamp = data.createdAt;
          
          console.log("Timestamp type:", typeof timestamp);
          console.log("Timestamp value:", timestamp);
  
          // Pastikan konversi timestamp benar
          if (timestamp instanceof Timestamp) {
            const date = timestamp.toDate();
            return `${date.getMonth() + 1}/${date.getFullYear()}`;
          } else if (timestamp && timestamp.toDate) {
            const date = timestamp.toDate();
            return `${date.getMonth() + 1}/${date.getFullYear()}`;
          }
          return "Unknown";
        });
  
        console.log("Final Labels:", labels);
        console.log("Final Donations Amounts:", donationsAmount);
        console.log("Final Submissions Amounts:", submissionsAmount);
  
        // Menyusun data untuk grafik
        setMonthlyData({ 
          donations: donationsAmount, 
          submissions: submissionsAmount, 
          labels 
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  // Data untuk grafik
  const chartData = {
    labels: monthlyData.labels.length > 0 ? monthlyData.labels : ['No Data'],
    datasets: [
      {
        label: "Donations",
        data: monthlyData.donations.length > 0 ? monthlyData.donations : [0],
        backgroundColor: "#4CAF50",
      },
      {
        label: "Submissions",
        data: monthlyData.submissions.length > 0 ? monthlyData.submissions : [0],
        backgroundColor: "#2196F3",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Donations and Submissions Per Month",
      },
    },
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#0A4635]">Welcome to ClothLoop</h2>
      <p className="mt-4 text-lg">
        This is your home page! Start using the app and explore the features.
      </p>

      {/* Statistik */}
      <div className="grid grid-cols-4 gap-4 mt-8 text-[#0A4635]">
        <div className="p-2 border-[2px] flex flex-col border-[#0A4635]/30 rounded-lg shadow-sm text-center px-0">
          <h3 className="text-md font-semibold ">Total User UMKM</h3>
          <p className="text-2xl font-bold ">{totalUMKM}</p>
        </div>
        <div className="p-2 border-[2px] flex flex-col border-[#0A4635]/30 rounded-lg shadow-sm text-center px-0">
          <h3 className="text-md font-semibold">Total User Industri</h3>
          <p className="text-2xl font-bold ">{totalIndustri}</p>
        </div>
        <div className="p-2 border-[2px] flex flex-col border-[#0A4635]/30 rounded-lg shadow-sm text-center px-0">
          <h3 className="text-md font-semibold">Total Submissions</h3>
          <p className="text-2xl font-bold ">{totalSubmissions}</p>
        </div>
        <div className="p-2 border-[2px] flex flex-col border-[#0A4635]/30 rounded-lg shadow-sm text-center px-0">
          <h3 className="text-md font-semibold">Total Donations</h3>
          <p className="text-2xl font-bold ">{totalDonations}</p>
        </div>
      </div>

      {/* Grafik */}
      <div className="mt-8 bg-[#FAF7F1] rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#0A4635] mb-4">Grafik Donations dan Submissions</h3>
        {monthlyData.labels.length > 0 ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <p>Data belum tersedia atau tidak ditemukan.</p>
        )}
      </div>
    </div>
  );
}
