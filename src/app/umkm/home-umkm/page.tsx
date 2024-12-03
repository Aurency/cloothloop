export function Homeumkm() {
  // Dummy data sementara (ganti dengan data dari Firebase)
  const industries = [
    { id: 1, companyName: "Alsa Company", wasteNeeds: "Pra Konsumsi" },
    { id: 2, companyName: "Alsa Company", wasteNeeds: "Pra Konsumsi" },
    { id: 3, companyName: "Alsa Shop", wasteNeeds: "Pasca Konsumsi" },
    { id: 4, companyName: "Alsa Company", wasteNeeds: "Pra Konsumsi" },
    { id: 5, companyName: "Alsa Company", wasteNeeds: "Pra Konsumsi" },
    { id: 6, companyName: "Alsa Company", wasteNeeds: "Pra Konsumsi" },
  ];

  return (
    <div className="min-h-screen p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0A4635]">Welcome to ClothLoop</h2>
        <p className="mt-4 text-lg">
          This is your home page! Start using the app and explore the features.
        </p>
      </div>

      {/* Informasi Industri */}
      <h1 className="text-2xl font-bold mb-6">Informasi Industri</h1>

      {/* Grid Informasi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.map((industry) => (
          <div
            key={industry.id}
            className="border border-gray-300 p-4 rounded-md shadow-md flex flex-col min-h-[200px]"
          >
            {/* Flex Container for Text and Button */}
            <div className="flex justify-between items-center h-full">
              <div>
                {/* Nama Industri */}
                <h2 className="text-[#0A4635] font-bold">{industry.companyName}</h2>

                {/* Kategori Limbah */}
                <p className="text-sm text-[#0A4635]">
                  Kategori: {industry.wasteNeeds}
                </p>
              </div>

              {/* Tombol Donasi */}
              <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition">
                Donasi
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
