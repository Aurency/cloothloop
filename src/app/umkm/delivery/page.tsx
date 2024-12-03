import Link from "next/link";

export default function DeliveryPage() {
  return (
    <div className="min-h-screen flex flex-col justify-start py-10 px-10">
      {/* Title */}
      <h1 className="text-4xl font-bold text-[#0A4635] mb-6 text-left">
        Delivery
      </h1>

      {/* Description */}
      <p className="text-lg mb-8 text-left text-[#0A4635]">
        Halaman ini adalah untuk pengiriman barang. Anda dapat mengelola pengiriman 
        dan melihat status terkini dari pesanan Anda.
      </p>

      {/* Informasi Pengiriman */}
      <div className="bg-[#F2E8D8] p-8 rounded-lg shadow-md w-full max-w-screen-lg">
        <h2 className="text-2xl font-semibold text-[#0A4635] mb-6">
          Detail Pengiriman
        </h2>

        {/* Details */}
        <div className="text-lg text-[#0A4635] space-y-4">
          <p>
            <span className="font-medium">Nama Penerima:</span> John Doe
          </p>
          <p>
            <span className="font-medium">Alamat Pengiriman:</span> Jl. Raya No.123, Jakarta, Indonesia
          </p>
          <p>
            <span className="font-medium">Estimasi Waktu Pengiriman:</span> 2-3 Hari Kerja
          </p>
        </div>
      </div>
    </div>
  );
}
