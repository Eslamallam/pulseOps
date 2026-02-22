"use client";

import SidebarNav from "./sidebar-nav";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background flex flex-col">
      <div className="h-14 flex items-center px-4 border-b font-semibold">
        PulseOps
      </div>

      <SidebarNav />
    </aside>
  );
}