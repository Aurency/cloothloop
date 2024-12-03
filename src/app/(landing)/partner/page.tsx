import Link from 'next/link';

export default  function Partner() {
  return (
    <div className="flex justify-center items-center bg-[#F2E8D8] h-[88vh]">
      <div className="max-w-4xl w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* UMKM Section */}
        <div className="bg-white p-6 rounded-[24px] shadow-lg ">
          <h2 className="text-3xl font-bold text-[#0A4635] mb-4">UMKM</h2>
          <p className="text-lg text-[#0A4635] mb-8">
            ClothLoop adalah platform untuk membantu UMKM dalam mengelola limbah tekstil.
            Bergabunglah untuk mendapatkan manfaat dari kolaborasi ini!
          </p>
          <Link href="/auth/signup-umkm" className="px-6 py-2 mt-4 text-lg font-medium text-[#0A4635] bg-[#FFEA7F] hover:bg-[#fcde49] rounded-[24px]">
            Gabung
          </Link>
        </div>

        {/* Industri Section */}
        <div className="bg-white p-6 rounded-[24px] shadow-lg ">
          <h2 className="text-3xl font-bold text-[#0A4635] mb-4">Industri</h2>
          <p className="text-lg text-[#0A4635] mb-8">
            ClothLoop juga melayani industri yang ingin mengelola limbah tekstil dalam
            skala besar. Bergabunglah untuk berpartisipasi dalam solusi ramah lingkungan.
          </p>
          <Link href="/auth/signup-industri" className="px-6 py-2 mt-4 text-lg font-medium text-[#0A4635] bg-[#FFEA7F] hover:bg-[#fcde49] rounded-[24px]"> 
            Gabung
          </Link>
        </div>
      </div>
    </div>
  );
}
