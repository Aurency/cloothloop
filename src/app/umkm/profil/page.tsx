export default function ProfilePage() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start py-10 px-10 ">
        {/* Title */}
        <h1 className="text-4xl font-bold text-[#0A4635] mb-6 text-left">
          Profile Page
        </h1>
  
        {/* User Profile Details */}
        <div className="bg-[#F2E8D8] p-8 rounded-lg shadow-md w-full max-w-screen-lg">
          <h2 className="text-2xl font-semibold text-[#0A4635] mb-6">
            Detail Profil
          </h2>
  
          {/* Profile Information */}
          <div className="text-lg text-[#0A4635] space-y-4">
            <p>
              <span className="font-medium">Nama:</span> John Doe
            </p>
            <p>
              <span className="font-medium">Email:</span> johndoe@example.com
            </p>
            <p>
              <span className="font-medium">Nomor Telepon:</span> +62 812 3456 7890
            </p>
            <p>
              <span className="font-medium">Alamat:</span> Jl. Raya No.123, Jakarta, Indonesia
            </p>
          </div>
  
          {/* Button to Edit Profile */}
          <div className="mt-6 text-center">
            <button className="bg-[#0A4635] text-white py-2 px-6 rounded-md hover:bg-[#086532] transition">
              Edit Profil
            </button>
          </div>
        </div>
      </div>
    );
  }
  