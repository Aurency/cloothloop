"use client"

import { useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import classNames from 'classnames';


interface UMKMData {
  id: string;
  businessName: string;
  businessAddress: string;
  email: string;
  phoneNumber: string;
  wasteNeeds: string;
  ownerName: string;
  createdAt: Timestamp;
}

interface SubmissionData {
  id: string;
  createdAt: string; // formatted date string
  industryAddress: string;
  industryCompanyName: string;
  industryId: string;
  industryWasteNeeds: string;
  status: string;
  trackingStatus: string; // simplified map to string
  umkmAddress: string;
  umkmId: string;
  umkmName: string;
  wasteNeeds: string;
}

export default function DataUMKM() {
  const [data, setData] = useState<UMKMData[]>([]);
  const [dataSubmissions, setDataSubmissions] = useState<SubmissionData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "umkm"));
        const umkm = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UMKMData[];
        setData(umkm);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchSubmissionData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "submission"));
        const submission = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate().toLocaleString() || "-", // Format createdAt
            trackingStatus: JSON.stringify(data.trackingStatus || {}), // Format trackingStatus
          };
        }) as SubmissionData[];
        setDataSubmissions(submission);
      } catch (error) {
        console.error("Error fetching submission data: ", error);
      }
    };

    fetchSubmissionData();
  }, []);

  const columns: MRT_ColumnDef<UMKMData>[] = [
    { accessorKey: "businessName", header: "Business Name" },
    { accessorKey: "businessAddress", header: "Business Address" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phoneNumber", header: "Phone Number" },
    { accessorKey: "wasteNeeds", header: "Waste Needs" },
  ];

  const columnsSubmissions: MRT_ColumnDef<SubmissionData>[] = [
    { accessorKey: "umkmName", header: "UMKM Name" },
    { accessorKey: "wasteNeeds", header: "Waste Needs" },
    { accessorKey: "umkmAddress", header: "UMKM Address" },
    { accessorKey: "industryCompanyName", header: "Industry Company Name" },
    { accessorKey: "industryAddress", header: "Industry Address" },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ row }) => {
        const status = row.original.status;
        console.log("Status:", status);  // Cek nilai status di console
    
        let statusColor = "text-black"; // Default color
    
        // Pastikan nilai status sesuai dengan kondisi
        if (status && status.toLowerCase() === "pending") {
          statusColor = "text-orange-500"; // Warna orange jika status pending
        } else if (status && status.toLowerCase() === "rejected") {
          statusColor = "text-red-500"; // Warna merah jika status rejected
        } else if (status && status.toLowerCase() === "accepted") {
          statusColor = "text-green-500"; // Warna hijau jika status accepted
        }
    
        return <span className={classNames(statusColor)}>{status}</span>;
      },
    },
    { accessorKey: "industryWasteNeeds", header: "Industry Waste Needs" },
    {
      accessorKey: "trackingStatus",
      header: "Tracking Status",
      Cell: ({ row }) => {
        const trackingStatus = row.original.trackingStatus ? JSON.parse(row.original.trackingStatus) : {};
  
        // Logika untuk menampilkan status berdasarkan nilai trackingStatus
        if (trackingStatus?.wastePickUp === true) {
          return "Telah Dijemput"; // Jika wastePickUp true
        }
        if (trackingStatus?.sentToYou === true) {
          return "Sedang Dikirim"; // Jika sentToYou true
        }
        if (trackingStatus?.orderReceived === true) {
          return "Telah Diterima"; // Jika orderReceived true
        }
        if (trackingStatus?.orderReceived === false) {
          return "Belum Diterima"; // Jika orderReceived false
        }
        if (trackingStatus?.sentToYou === false) {
          return "Belum Dikirim"; // Jika sentToYou false
        }
        if (trackingStatus?.wastePickUp === false) {
          return "Belum Dijemput"; // Jika wastePickUp false
        }
  
        return "Status Tidak Diketahui"; // Default jika tidak ada kondisi yang terpenuhi
      },
    },
    { accessorKey: "createdAt", header: "Created At" },
  ];
  


    return (
      <div>
        <div className="pb-10 border-b-4 w-full border-[#0A4635]/30">
          <h2 className="text-2xl font-semibold text-[#0A4635]">Data UMKM</h2>
          <div className="mt-3">
            <MaterialReactTable
              columns={columns}
              data={data}
              enableColumnFilters
              enableSorting
              enablePagination
            />
          </div>
        </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#0A4635] mt-6">Data Submissions</h2>
        <div className="mt-3 mb-6">
          <MaterialReactTable
            columns={columnsSubmissions}
            data={dataSubmissions}
            enableColumnFilters
            enableSorting
            enablePagination
          />
        </div>
      </div>

    </div>
    );
  }
  