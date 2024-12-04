"use client"

import { useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";


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

export default function DataUMKM() {
  const [data, setData] = useState<UMKMData[]>([]);

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

  const columns: MRT_ColumnDef<UMKMData>[] = [
    { accessorKey: "businessName", header: "Business Name" },
    { accessorKey: "businessAddress", header: "Business Address" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phoneNumber", header: "Phone Number" },
    { accessorKey: "wasteNeeds", header: "Waste Needs" },
  ];


    return (
      <div className="">
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
    );
  }
  