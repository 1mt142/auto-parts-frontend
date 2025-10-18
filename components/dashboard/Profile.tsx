"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogOut, User as UserIcon } from "lucide-react";

export default function Profile({ user }: { user: any }) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    // ✅ REMOVE FROM ZUSTAND
    logout();

    // ✅ REMOVE FROM COOKIES
    document.cookie = "accessToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";

    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>

      <div className="bg-white rounded-lg shadow p-8 max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <UserIcon size={40} className="text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600 text-sm">Name</p>
            <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Role</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">
              {user?.role}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
