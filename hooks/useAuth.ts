import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuth = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return { isAuthenticated, user };
};
