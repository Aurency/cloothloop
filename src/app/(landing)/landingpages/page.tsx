import { Hero } from "../../../components/landing-com/Hero"
import Link from "next/link";

export default function Landingpage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div>
        <Hero />
      </div>

      {/* WHO we are */}
      <section className="py-20 bg-[#F2E8D8]">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl font-semibold mb-4 text-green-900">WHO we are</h2>
          <p className="text-gray-600">
          Berawal dari kepedulian terhadap lingkungan dan komitmen untuk mengurangi jejak karbon, kami berfokus pada transformasi limbah tekstil menjadi sesuatu yang bernilai. Dengan teknologi modern dan pendekatan ramah pengguna, ClothLoop memudahkan siapa saja untuk berkontribusi dalam gerakan daur ulang.
          </p>
        </div>
      </section>

      {/* What we do */}
      <section className="bg-[#F2E8D8]">
        <div className="pb-20 bg-[#F2E8D8] container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-semibold text-green-900 mb-4">What we do</h2>
            <p className="text-gray-600">
            ClothLoop hadir sebagai solusi yang menghubungkan industri dan UMKM dalam ekosistem daur ulang tekstil yang berkelanjutan. Kami menjembatani industri yang menghasilkan limbah tekstil dalam skala besar dengan UMKM kreatif yang memiliki kemampuan untuk mengolah dan mengubahnya menjadi produk bernilai tambah. Dengan pendekatan kolaboratif ini, ClothLoop memastikan bahwa limbah tekstil tidak lagi berakhir di tempat pembuangan, melainkan mendapatkan kehidupan baru sebagai produk inovatif dan ramah lingkungan.
            </p>
          </div>
          <div className="bg-[#F2E8D8]">
            <img src="/assets/whatwedo.png" alt="What we do" />
          </div>
        </div>
      </section>

      {/* Textile Waste Section */}
      <section className="py-20 bg-[#0A4635]">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl font-semibold mb-4 text-[#F2E8D8]">What is textile waste?</h2>
          <p className="text-[#F2E8D8]">
          Limbah tekstil merujuk pada bahan atau produk tekstil yang sudah tidak terpakai dan dibuang, baik dari sektor industri maupun konsumsi rumah tangga. Limbah ini bisa berupa sisa-sisa kain, pakaian bekas, atau produk cacat yang tidak lagi memenuhi standar kualitas. Di industri, limbah tekstil biasanya berasal dari proses produksi, seperti sisa pemotongan kain atau bahan yang tidak terpakai. Sementara itu, limbah dari konsumsi adalah pakaian atau barang-barang tekstil rumah tangga yang sudah rusak atau tidak dibutuhkan lagi. Limbah tekstil menjadi masalah lingkungan karena sebagian besar tidak terurai dengan mudah, terutama yang terbuat dari bahan sintetis, yang membutuhkan waktu lama untuk terdegradasi di alam.
          </p>
        </div>
      </section>

      {/* Kategori limbah textile */}
      <section className="bg-[#F2E8D8]">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-green-900 mb-2 py-10 bg-[#F2E8D8]/50">Textile Waste Category</h2>
        </div>

        <div className="bg-[#F2E8D8] container mx-auto mb-8 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="bg-[#F2E8D8] w-[487px] h-auto mx-auto mb-4">
            <img src="/assets/Pra-konsumsi.png" alt="What we do" className="shadow-lg mx-50" />
          </div>
          <div>
            <h2 className="text-4xl font-semibold text-green-900 mb-4">Pra-konsumsi</h2>
            <p className="text-gray-600">
            Pra-konsumsi merujuk pada limbah yang dihasilkan selama tahap produksi barang, sebelum barang tersebut sampai ke konsumen akhir. Dalam konteks tekstil, limbah pra-konsumsi adalah sisa-sisa bahan atau produk yang dihasilkan selama proses pembuatan pakaian atau barang tekstil lainnya, namun belum dijual atau digunakan oleh konsumen. Contohnya termasuk sisa pemotongan kain, bahan yang tidak memenuhi standar kualitas, atau produk cacat dari pabrik. Limbah pra-konsumsi ini biasanya terjadi di sepanjang rantai pasokan industri, mulai dari perancangan, pembuatan, hingga distribusi, dan seringkali dapat didaur ulang atau dimanfaatkan kembali dalam proses produksi berikutnya.
            </p>
          </div>
        </div>

        <div className="bg-[#F2E8D8] container mx-auto md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="bg-[#F2E8D8] w-[487px] h-auto mx-auto mb-4">
            <img src="/assets/pasca-konsumsi.png" alt="What we do" className="shadow-lg mx-50" />
          </div>
          <div>
            <h2 className="text-4xl font-semibold text-green-900 mb-4">Pasca-konsumsi</h2>
            <p className="text-gray-600">
            Pasca-konsumsi merujuk pada limbah yang dihasilkan setelah barang atau produk telah digunakan oleh konsumen. Dalam konteks tekstil, limbah pasca-konsumsi adalah barang-barang tekstil seperti pakaian, seprai, gorden, atau barang rumah tangga lainnya yang sudah tidak digunakan lagi dan dibuang oleh konsumen. Limbah ini bisa berupa pakaian yang sudah rusak, usang, atau tidak lagi sesuai dengan kebutuhan pengguna. Limbah pasca-konsumsi sering menjadi tantangan besar dalam pengelolaan sampah, karena sebagian besar tekstil ini tidak dapat terurai dengan mudah, terutama yang terbuat dari bahan sintetis. Banyak dari limbah ini akhirnya berakhir di tempat pembuangan akhir atau menumpuk di tempat sampah.
            </p>
          </div>
        </div>
      </section>

      {/* Partner with us */}
      <section className="bg-[#F2E8D8] pb-10">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-green-900 py-10 bg-[#F2E8D8]/50">Partner with us</h2>
        </div>

        <div className="justify-between ">
          <div className="flex gap-8 justify-center">
            <Link href="/Login">
              <div className="text-center w-[329px] bg-[#0A4635] rounded-[24px]">
                <img src="/assets/partner1.png" alt="UMKM" className="shadow-md" />
                <h3 className="text-xl font-semibold text-[#F2E8D8] mt-4">UMKM</h3>
                <p className="text-[#F2E8D8] pb-5 mt-1 mx-4">Program untuk membantu dan memberikan dampak bagi UMKM yang ingin mendaur ulang tekstil mereka</p>
              </div>
            </Link>

            <Link href="/Login">
              <div className="text-center w-[329px] bg-[#0A4635] rounded-[24px]">
                <img src="/assets/partner2.png" alt="CSR" className="shadow-md" />
                <h3 className="text-xl font-semibold text-[#F2E8D8] mt-4">CSR</h3>
                <p className="text-[#F2E8D8] pb-5 mt-1 mx-4">Mendukung program CSR dari perusahaan untuk keberlanjutan sosial dan lingkungan yang lebih baik</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
