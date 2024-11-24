import Link from "next/link";

export const Hero: React.FC = () => {
  return (
    <div
      className="flex-col bg-cover bg-center h-[90vh]"
      style={{ backgroundImage: "url('/assets/bg_lp.png')" }}
    >
      <div className="flex p-6 items-end h-full">
        <div className="flex-row justify-start text-[#F2E8D8] md:text-6xl font-semibold">
          <p>Apa bagus intinya?</p>
          <p>Kayak intro ala-ala!</p>
          <div>
            <Link href="/login">
              <button className="px-10 py-2 mt-4 text-lg font-medium text-[#0A4635] bg-[#FFEA7F] hover:bg-[#fcde49] rounded-[24px]">
                Gabung
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
