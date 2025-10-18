"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          🚗 AutoParts
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-blue-100">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="hover:text-blue-100">
                Dashboard
              </Link>
              <span className="text-blue-100">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-100">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          <Menu size={24} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-blue-700 p-4 space-y-2">
          <Link href="/" className="block hover:text-blue-100">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="block hover:text-blue-100">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block hover:text-blue-100">
                Login
              </Link>
              <Link href="/register" className="block hover:text-blue-100">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
