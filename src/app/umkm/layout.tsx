"use clients";

import { Sidebar } from "@/components/umkm-com/sidebar";
import { Header } from "@/components/umkm-com/header";
import Chatbot from "@/components/Chatbot/chatbot";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-60 w-full">
        {/* Header */}
        <Header />
        <Chatbot/>

        {/* Content from the page */}
        <div className="p-6 h-full bg-white">
      
          {children}
        </div>
      </div>
    </div>
  );
}
