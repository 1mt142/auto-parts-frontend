"use client";

import { useParts } from "@/hooks/useParts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DashboardOverview() {
  const { data } = useParts(1, 100);

  const categoryStats =
    data?.parts.reduce((acc: any, part) => {
      const existing = acc.find((item: any) => item.category === part.category);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ category: part.category, count: 1 });
      }
      return acc;
    }, []) || [];

  const priceStats = [
    {
      range: "Under $100",
      count: data?.parts.filter((p) => parseFloat(p.price) < 100).length || 0,
    },
    {
      range: "$100-$300",
      count:
        data?.parts.filter(
          (p) => parseFloat(p.price) >= 100 && parseFloat(p.price) < 300
        ).length || 0,
    },
    {
      range: "Over $300",
      count: data?.parts.filter((p) => parseFloat(p.price) >= 300).length || 0,
    },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total Parts</p>
          <p className="text-3xl font-bold text-blue-600">
            {data?.pagination.total || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Categories</p>
          <p className="text-3xl font-bold text-green-600">
            {categoryStats.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">In Stock</p>
          <p className="text-3xl font-bold text-orange-600">
            {data?.parts.filter((p) => p.stock > 0).length || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Out of Stock</p>
          <p className="text-3xl font-bold text-red-600">
            {data?.parts.filter((p) => p.stock === 0).length || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Parts by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Price Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priceStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, count }) => `${range}: ${count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {priceStats.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
