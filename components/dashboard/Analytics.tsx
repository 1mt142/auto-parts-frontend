"use client";

import { useParts } from "@/hooks/useParts";

export default function Analytics() {
  const { data } = useParts(1, 100);

  const totalValue =
    data?.parts.reduce(
      (sum, part) => sum + parseFloat(part.price) * part.stock,
      0
    ) || 0;

  const avgPrice = data?.parts.length
    ? data.parts.reduce((sum, part) => sum + parseFloat(part.price), 0) /
      data.parts.length
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <p className="text-blue-100 text-sm mb-1">Total Inventory Value</p>
          <p className="text-3xl font-bold">${totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <p className="text-green-100 text-sm mb-1">Average Part Price</p>
          <p className="text-3xl font-bold">${avgPrice.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <p className="text-purple-100 text-sm mb-1">Total Stock Items</p>
          <p className="text-3xl font-bold">
            {data?.parts.reduce((sum, part) => sum + part.stock, 0) || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
