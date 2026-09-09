"use client";

import React, { useState } from "react";
import AdminSidebar from "@/Components/Admin/AdminSidebar";
import AdminHeader from "@/Components/Admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* Responsive Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        desktopCollapsed={desktopCollapsed}
        onToggleDesktopCollapse={() => setDesktopCollapsed(!desktopCollapsed)}
      />

      {/* Main content area — dynamic margin based on breakpoint and desktop collapse state */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ml-0 ${
          desktopCollapsed ? "lg:ml-[72px]" : "lg:ml-[240px]"
        }`}
      >
        <AdminHeader onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}