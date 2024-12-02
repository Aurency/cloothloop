"use clients";

import { Sidebar2 } from "@/components/industri-com/sidebar";
import { Header2 } from "@/components/industri-com/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar2 />

      {/* Main Content Area */}
      <div className="ml-64 w-full">
        {/* Header */}
        <Header2 />

        {/* Content from the page */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
