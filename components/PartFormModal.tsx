"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partSchema, PartSchema } from "@/utils/validation";
import { useCreatePart, useUpdatePart, Part } from "@/hooks/useParts";
import { X, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface PartFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Part | null;
  mode?: "create" | "edit";
}

export default function PartFormModal({
  isOpen,
  onClose,
  initialData,
  mode = "create",
}: PartFormModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { mutate: createPart, isPending: isCreating } = useCreatePart();
  const { mutate: updatePart, isPending: isUpdating } = useUpdatePart(
    initialData?.id || ""
  );

  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PartSchema>({
    resolver: zodResolver(partSchema),
  });

  // Reset form and image when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          brand: initialData.brand,
          price: parseFloat(initialData.price),
          stock: initialData.stock,
          category: initialData.category,
          description: initialData.description,
        });
        setImagePreview(initialData.image_url || null);
      } else {
        reset({
          name: "",
          brand: "",
          price: 0,
          stock: 0,
          category: "",
          description: "",
        });
        setImagePreview(null);
      }
      setImageFile(null);
    } else {
      reset();
      setImageFile(null);
      setImagePreview(initialData?.image_url || null);
    }
  }, [isOpen, initialData, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(initialData?.image_url || null);
  };

  const onSubmit = async (data: PartSchema) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });

    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (mode === "create") {
      createPart(formData, {
        onSuccess: () => {
          reset();
          setImageFile(null);
          setImagePreview(null);
          onClose();
        },
      });
    } else if (initialData?.id) {
      updatePart(
        { id: initialData.id, formData },
        {
          onSuccess: () => {
            reset();
            setImageFile(null);
            setImagePreview(null);
            onClose();
          },
        }
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "create" ? "Add New Part" : "Edit Part"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                {...register("name")}
                disabled={isPending}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Brake Pad Set"
              />
              {errors.name && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand *
              </label>
              <input
                type="text"
                {...register("brand")}
                disabled={isPending}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Brembo"
              />
              {errors.brand && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.brand.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price")}
                disabled={isPending}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                placeholder="125.50"
              />
              {errors.price && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                {...register("stock")}
                disabled={isPending}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                placeholder="45"
              />
              {errors.stock && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                {...register("category")}
                disabled={isPending}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select Category</option>
                <option value="Brakes">Brakes</option>
                <option value="Engine">Engine</option>
                <option value="Suspension">Suspension</option>
                <option value="Electrical">Electrical</option>
                <option value="Transmission">Transmission</option>
                <option value="Cooling">Cooling</option>
              </select>
              {errors.category && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Part description..."
              rows={3}
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image {mode === "edit" && "(Optional)"}
            </label>

            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-bl hover:bg-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
              <Upload size={20} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                {imageFile ? imageFile.name : "Click to upload image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isPending}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, WebP up to 1MB
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : mode === "create" ? (
                "Create Part"
              ) : (
                "Update Part"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
