import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex bg-zinc-950 min-h-screen text-zinc-100 font-sans selection:bg-[#FF1801] selection:text-white">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Top Header Navbar */}
        <TopNavbar />

        {/* Dynamic Nested Route Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Navigation bar at the bottom */}
      <MobileNavigation />
    </div>
  );
}
