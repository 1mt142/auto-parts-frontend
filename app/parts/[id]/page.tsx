"use client";

import { usePartById } from "@/hooks/useParts";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, formatDate } from "@/utils/format";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function PartDetail({ params }: { params: { id: string } }) {
  const { data: part, isLoading, error } = usePartById(params.id);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="py-8"></div>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  if (error || !part) {
    return (
      <>
        <Navbar />
        <div className="py-8"></div>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-red-600">Part not found</h1>
          <Link href="/" className="mt-4 text-blue-600 hover:underline">
            Back to parts
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="py-8"></div>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft size={20} />
            Back to parts
          </Link>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Image */}
              <div className="flex items-center justify-center bg-gray-100 rounded-lg min-h-96">
                {part.image_url ? (
                  <Image
                    src={part.image_url}
                    alt={part.name}
                    width={400}
                    height={400}
                    className="object-contain"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <p>No image available</p>
                  </div>
                )}
              </div>

              {/* Details */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {part.name}
                </h1>
                <p className="text-lg text-gray-600 mb-4">{part.brand}</p>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-gray-600">Price</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatPrice(part.price)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">Category</p>
                    <p className="text-lg font-medium text-gray-900">
                      {part.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">Stock Status</p>
                    <span
                      className={`inline-block px-4 py-2 rounded-full font-medium ${
                        part.stock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {part.stock > 0
                        ? `${part.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </div>

                  {part.description && (
                    <div>
                      <p className="text-gray-600">Description</p>
                      <p className="text-gray-900">{part.description}</p>
                    </div>
                  )}

                  <div className="text-sm text-gray-500">
                    Last updated: {formatDate(part.updated_at)}
                  </div>
                </div>

                <button
                  disabled={part.stock === 0}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
