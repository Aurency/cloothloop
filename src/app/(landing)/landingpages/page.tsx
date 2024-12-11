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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum rem quisquam velit praesentium magni doloribus adipisci voluptatibus, error obcaecati quis reiciendis assumenda, modi animi necessitatibus vel nobis sunt fugiat deleniti?. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam est voluptate porro, voluptatibus praesentium illum accusamus adipisci minima blanditiis at impedit, dignissimos autem itaque. Totam tempora quia vero voluptatem libero?
          </p>
        </div>
      </section>

      {/* What we do */}
      <section className="bg-[#F2E8D8]">
        <div className="pb-20 bg-[#F2E8D8] container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-semibold text-green-900 mb-4">What we do</h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, assumenda voluptate omnis ut accusamus adipisci, eius incidunt, modi facere accusantium ipsam sequi ullam hic officiis id perspiciatis necessitatibus laudantium nulla. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi similique consequatur necessitatibus porro iure tenetur asperiores molestiae magnam ab rem provident optio, unde quos tempore vel assumenda soluta suscipit blanditiis. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut nesciunt ad, fugiat accusantium impedit dolor velit. Sunt possimus voluptatem aliquam totam voluptatum sint illo nobis itaque velit assumenda, quam tenetur?
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
          <h2 className="text-4xl font-semibold mb-4 text-[#F2E8D8]">Apa itu limbah textile?</h2>
          <p className="text-[#F2E8D8]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum rem quisquam velit praesentium magni doloribus adipisci voluptatibus, error obcaecati quis reiciendis assumenda, modi animi necessitatibus vel nobis sunt fugiat deleniti?. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam est voluptate porro, voluptatibus praesentium illum accusamus adipisci minima blanditiis at impedit, dignissimos autem itaque. Totam tempora quia vero voluptatem libero?
          </p>
        </div>
      </section>

      {/* Kategori limbah textile */}
      <section className="bg-[#F2E8D8]">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-green-900 mb-2 py-10 bg-[#F2E8D8]/50">Kategori limbah textile</h2>
        </div>

        <div className="bg-[#F2E8D8] container mx-auto mb-8 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="bg-[#F2E8D8] w-[487px] h-auto mx-auto mb-4">
            <img src="/assets/Pra-konsumsi.png" alt="What we do" className="shadow-lg mx-50" />
          </div>
          <div>
            <h2 className="text-4xl font-semibold text-green-900 mb-4">Pra-konsumsi</h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, assumenda voluptate omnis ut accusamus adipisci, eius incidunt, modi facere accusantium ipsam sequi ullam hic officiis id perspiciatis necessitatibus laudantium nulla. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi similique consequatur necessitatibus porro iure tenetur asperiores molestiae magnam ab rem provident optio, unde quos tempore vel assumenda soluta suscipit blanditiis. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut nesciunt ad, fugiat accusantium impedit dolor velit. Sunt possimus voluptatem aliquam totam voluptatum sint illo nobis itaque velit assumenda, quam tenetur?
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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, assumenda voluptate omnis ut accusamus adipisci, eius incidunt, modi facere accusantium ipsam sequi ullam hic officiis id perspiciatis necessitatibus laudantium nulla. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi similique consequatur necessitatibus porro iure tenetur asperiores molestiae magnam ab rem provident optio, unde quos tempore vel assumenda soluta suscipit blanditiis. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut nesciunt ad, fugiat accusantium impedit dolor velit. Sunt possimus voluptatem aliquam totam voluptatum sint illo nobis itaque velit assumenda, quam tenetur?
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
