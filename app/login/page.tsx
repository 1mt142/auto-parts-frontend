"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/utils/validation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const setTokens = useAuthStore((state) => state.setTokens);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      setIsLoading(true);

      const response = await api.post("/auth/login", data);
      const { user, accessToken, refreshToken } = response.data.data;

      // Save to Zustand store
      setUser(user);
      setTokens(accessToken, refreshToken);

      // Save tokens to cookies (7 days)
      document.cookie = `accessToken=${accessToken}; path=/; max-age=${
        7 * 24 * 60 * 60
      }`;
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${
        7 * 24 * 60 * 60
      }`;

      toast.success("Login successful");

      // Redirect after showing toast
      setTimeout(() => router.push("/dashboard"), 700);
    } catch (error: any) {
      setTimeout(() => {}, 3000);
      let message = "Login failed";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message === "Network Error") {
        message = "Network error. Please check your connection.";
      } else if (error.response?.status >= 500) {
        message = "Server error. Please try again later.";
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                {...register("email")}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                {...register("password")}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="••••••"
              />
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
