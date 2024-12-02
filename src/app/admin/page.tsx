"use client";

import { Homeadmin } from "./home-admin/page"; 
import { Sidebar3 } from "../../components/admin-com/sidebar";

export default  function Home3() {
  return (
    <div>
      <Sidebar3/>
      <Homeadmin/>
    </div>
    
  );
}