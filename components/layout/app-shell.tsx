"use client";

import { ReactNode } from "react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex bg-muted/40">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />

        {/* Scroll container */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}