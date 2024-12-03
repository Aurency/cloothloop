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
      <div className="ml-64 w-full">
        {/* Header */}
        <Header />

        {/* Content from the page */}
        <div className="p-6">
          <Chatbot/>
          {children}
        </div>
      </div>
    </div>
  );
}
