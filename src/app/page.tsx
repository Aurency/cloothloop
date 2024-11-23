import { Navbar } from "@/components/Navbar";
import { Landingpage } from "./pages/Landingpage";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Landingpage/>
      <Footer/>
    </div>
    
  );
}