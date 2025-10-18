"use client";

import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import PartsManagement from "@/components/dashboard/PartsManagement";
import Analytics from "@/components/dashboard/Analytics";
import Profile from "@/components/dashboard/Profile";

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-gray-100 mt-16">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-auto p-8">
          {activeTab === "overview" && <DashboardOverview />}
          {activeTab === "parts" && <PartsManagement />}
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "profile" && <Profile user={user} />}
        </main>
      </div>
    </>
  );
}
