"use clients";

import { Sidebar3 } from "@/components/admin-com/sidebar";
import { Header3 } from "@/components/admin-com/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div></div>
      {/* Sidebar */}
      <Sidebar3 />

      {/* Main Content Area */}
      <div className="ml-60 w-screen">
        {/* Header */}
        <Header3 />

        {/* Content from the page */}
        <div className="p-6 h-screen ">
          {children}
        </div>
      </div>
    </div>
  );
}
