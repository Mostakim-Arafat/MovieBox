"use client";

import React from "react";
import AdminSidebar from "@/Components/Admin/AdminSidebar";
import AdminHeader from "@/Components/Admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <AdminSidebar />
      {/* Main content area — offset by sidebar width */}
      <div className="ml-[240px] flex flex-col min-h-screen transition-all duration-300">
        <AdminHeader />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}