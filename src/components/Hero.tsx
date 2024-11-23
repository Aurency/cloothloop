
import Link from "next/link";


export const Hero: React.FC = () => {
    return (
            <div className=" flex-col bg-cover bg-center h-[90vh] " style={{ backgroundImage: "url('/assets/bg_lp.png')"}}>
                <div className="flex p-6 items-end h-full">
                    <div className="flex-row justify-start text-[#F2E8D8] md:text-6xl font-semibold h-[30vh]">
                        ndatau apa ini 
                        <br />bagus hm
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
  
       

        /*
            <div>
            <header className="relative bg-cover items-center justify-center min-h-screen" style={{ backgroundImage: "url('/assets/bg_lp.png')" }}>
                <div className="relative z-10 text-center text-white flex flex-col items-center justify-center h-full">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Apa bagus Intinya 
                        <br /> kyk intro Ala ala
                    </h1>
                    </div>
                    <button className="px-6 py-3 mt-4 text-lg font-medium text-white bg-yellow-400 hover:bg-yellow-500 rounded-lg">
                    Gabung
                    </button>
            
            </header>
        </div>
            
            */
    )
}