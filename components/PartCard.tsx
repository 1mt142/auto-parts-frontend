"use client";

import { Part } from "@/hooks/useParts";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/utils/format";
import { ShoppingCart } from "lucide-react";

export default function PartCard({ part }: { part: Part }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative w-full h-48 bg-gray-200">
        {part.image_url ? (
          <Image
            src={part.image_url}
            alt={part.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
            No Image
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {part.name}
        </h3>
        <p className="text-sm text-gray-600">{part.brand}</p>

        <div className="mt-3 flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(part.price)}
          </span>
          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              part.stock > 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {part.stock > 0 ? `${part.stock} in stock` : "Out of stock"}
          </span>
        </div>

        <Link
          href={`/parts/${part.id}`}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          View Details
        </Link>
      </div>
    </div>
  );
}
