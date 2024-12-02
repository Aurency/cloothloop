"use client";

import { Homeumkm } from "./home-umkm/page"; 
import { Sidebar } from "../../components/umkm-com/sidebar";

export default  function Home2() {
  return (
    <div>
      <Sidebar/>
      <Homeumkm/>
    </div>
    
  );
}