"use client";

import { LayoutDashboard, Package, BarChart3, User } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "parts", label: "Parts", icon: Package },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold">Dashboard</h2>
      </div>

      <nav className="space-y-2 px-4">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === id
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
