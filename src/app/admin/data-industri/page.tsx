"use client"

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseconfig";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";


interface IndustriData {
  id: string;
  companyName: string;
  businessAddress: string;
  email: string;
  phoneNumber: string;
  wasteNeeds: string;
}

export default function DataIndustri() {
  const [data, setData] = useState<IndustriData[]>([]);

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

  const columns: MRT_ColumnDef<IndustriData>[] = [
    { accessorKey: "companyName", header: "Company Name" },
    { accessorKey: "businessAddress", header: "Business Address" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phoneNumber", header: "Phone Number" },
    { accessorKey: "wasteNeeds", header: "Waste Needs" },
  ];

  return (
    <div className="">
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
  );
}
