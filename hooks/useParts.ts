import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";

export interface Part {
  id: string;
  name: string;
  brand: string;
  price: string;
  stock: number;
  category: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PartsResponse {
  parts: Part[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const useParts = (page = 1, limit = 10, search = "", category = "") => {
  return useQuery({
    queryKey: ["parts", page, limit, search, category],
    queryFn: async () => {
      const params: any = { page, limit };

      if (search.trim()) params.q = search;
      //   if (category.trim()) params.category = category;

      const { data } = await api.get<{ success: boolean; data: PartsResponse }>(
        "/parts",
        { params }
      );

      return data.data;
    },
    staleTime: 60000,
  });
};

export const usePartById = (id: string) => {
  return useQuery({
    queryKey: ["part", id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Part }>(
        `/parts/${id}`
      );
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreatePart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post("/parts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      toast.success("Part created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create part");
    },
  });
};

export const useUpdatePart = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const { data } = await api.put(`/parts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["part", id] });
      }
      toast.success("Part updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update part");
    },
  });
};

export const useDeletePart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/parts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      toast.success("Part deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete part");
    },
  });
};
