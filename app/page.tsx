"use client";

import { useState } from "react";
import { useParts } from "@/hooks/useParts";
import PartCard from "@/components/PartCard";
import Navbar from "@/components/Navbar";
import { Search, Filter } from "lucide-react";

const CATEGORIES = ["All", "Brakes", "Engine", "Suspension", "Electrical"];

export default function Home() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useParts(page, 10, search, category);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat === "All" ? "" : cat);
    setPage(1);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="py-8"></div>
        <section className="bg-blue-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">Auto Parts Inventory</h1>
            <p className="text-blue-100">
              Find quality auto parts for your vehicle
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search & Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search parts by name, brand or category..."
                  value={search}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Filter size={20} />
                Filters
              </button>
            </div>

            {/* Categories */}
            {/* <div
              className={`mt-4 flex gap-2 flex-wrap ${
                !showFilters && "hidden md:flex"
              }`}
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full font-medium transition ${
                    (cat === "All" && !category) || category === cat
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div> */}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading parts...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              Failed to load parts. Please try again later.
            </div>
          )}

          {/* Parts Grid */}
          {data && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {data.parts.map((part) => (
                  <PartCard key={part.id} part={part} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 bg-gray-200 disabled:opacity-50 rounded hover:bg-gray-300"
                >
                  Previous
                </button>

                {Array.from({ length: data.pagination.pages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 rounded ${
                      page === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === data.pagination.pages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-gray-200 disabled:opacity-50 rounded hover:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
