"use client";

import SidebarItem from "./sidebar-item";

export default function SidebarNav() {
  return (
    <nav className="p-3 space-y-1">
      <SidebarItem href="/overview" label="Overview" />
      <SidebarItem href="/incidents" label="Incidents" />
      <SidebarItem href="/services" label="Services" />
      <SidebarItem href="/explorer" label="Event Explorer" />
    </nav>
  );
}