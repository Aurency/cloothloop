import { Landingpage } from "./landingpages/page"; // Path relatif dari landing/layout.tsx ke landingpages/page.tsx
import { Footer } from "@/components/landing-com/Footer";

export default function Home() {
  return (
    <div>
      <Landingpage/>
      <Footer/>
    </div>
    
  );
}