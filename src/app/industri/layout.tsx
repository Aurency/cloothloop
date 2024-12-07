"use clients";

import { Sidebar2 } from "@/components/industri-com/sidebar";
import { Header2 } from "@/components/industri-com/header";
import Chatbot from "@/components/Chatbot/chatbot";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar2 />

      {/* Main Content Area */}
      <div className="ml-60 w-full">
        {/* Header */}
        <Header2 />

        {/* Content from the page */}
        <div className="p-6 h-full">
          <Chatbot/>
          {children}
        </div>
      </div>
    </div>
  );
}
