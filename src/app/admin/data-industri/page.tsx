"use client"

import { useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import classNames from 'classnames';

interface IndustriData {
  id: string;
  companyName: string;
  businessAddress: string;
  email: string;
  phoneNumber: string;
  wasteNeeds: string;
  businessLicenseNumber: string;
  createdAt: Timestamp;
}

interface DonationData {
  id: string;
  createdAt: string;
  industryId: string;
  industryName: string;
  industryWasteNeeds: string;
  status: string;
  umkmId: string;
  umkmName: string;
  umkmWasteNeeds: string;
}

export default function DataIndustri() {
  const [data, setData] = useState<IndustriData[]>([]);
  const [dataDonations, setDataDonations] = useState<DonationData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "industri"));
        const industries = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as IndustriData[];
        setData(industries);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "donations"));
        const donations = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          
          // Debugging: Cetak data mentah untuk melihat struktur
          console.log("Raw donation document:", doc.id, data);
  
          // Tangani createdAt dengan berbagai kemungkinan
          let formattedCreatedAt = "-";
          if (data.createdAt) {
            if (data.createdAt instanceof Timestamp) {
              // Jika menggunakan Timestamp Firebase
              formattedCreatedAt = data.createdAt.toDate().toLocaleString();
            } else if (typeof data.createdAt === 'object' && data.createdAt !== null) {
              // Jika objek tanggal dari database lain
              formattedCreatedAt = new Date(data.createdAt.seconds * 1000).toLocaleString();
            } else if (typeof data.createdAt === 'string') {
              // Jika string tanggal
              formattedCreatedAt = new Date(data.createdAt).toLocaleString();
            }
          }
  
          return {
            id: doc.id,
            ...data,
            createdAt: formattedCreatedAt,
          };
        }) as DonationData[];
        
        setDataDonations(donations);
      } catch (error) {
        console.error("Error fetching donation data: ", error);
      }
    };
  
    fetchDonationData();
  }, []);
  


  const columns: MRT_ColumnDef<IndustriData>[] = [
    { accessorKey: "companyName", header: "Company Name" },
    { accessorKey: "businessLicenseNumber", header: "Bus. License Num" },
    { accessorKey: "businessAddress", header: "Business Address" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phoneNumber", header: "Phone Number" },
    { accessorKey: "wasteNeeds", header: "Waste Needs" },
    { accessorKey: "createdAt", header: "Created At" },
  ];

  const columnsDonations: MRT_ColumnDef<DonationData>[] = [
    { accessorKey: "industryId", header: "Industry ID" },
    { accessorKey: "industryName", header: "Industry Name" },
    { accessorKey: "industryWasteNeeds", header: "Industry Waste Needs" },
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
    { accessorKey: "umkmId", header: "UMKM ID" },
    { accessorKey: "umkmName", header: "UMKM Name" },
    { accessorKey: "umkmWasteNeeds", header: "UMKM Waste Needs" },
    { accessorKey: "createdAt", header: "Created At" },
  ];
  

  return (
    <div className="">
      <div className="pb-10 border-b-4 w-full border-[#0A4635]/30">
        <h2 className="text-2xl font-semibold text-[#0A4635]">Data Industri</h2>
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
        <h2 className="text-2xl font-semibold text-[#0A4635] mt-8">Data Donations</h2>
        <div className="mt-3">
          <MaterialReactTable
            columns={columnsDonations}
            data={dataDonations}
            enableColumnFilters
            enableSorting
            enablePagination
          />
        </div>
      </div>
    </div>
  );
}
