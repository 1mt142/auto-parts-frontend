'use client';

import { useState } from 'react';
import { useParts, useDeletePart } from '@/hooks/useParts';
import { Edit2, Trash2, Plus } from 'lucide-react';
import PartFormModal from '@/components/PartFormModal';
import { formatPrice } from '@/utils/format';
import { Part } from '@/hooks/useParts';
import toast from 'react-hot-toast';

export default function PartsManagement() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const { data, isLoading } = useParts(page, 10);
  const { mutate: deletePart, isPending: isDeleting } = useDeletePart();

  // Handle Add Part
  const handleAddPart = () => {
    setEditingPart(null);
    setIsModalOpen(true);
  };

  // Handle Edit Part
  const handleEditPart = (part: Part) => {
    setEditingPart(part);
    setIsModalOpen(true);
  };

  // Handle Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPart(null);
  };

  // Handle Delete Part
  const handleDeletePart = (partId: string, partName: string) => {
    if (window.confirm(`Are you sure you want to delete "${partName}"?`)) {
      deletePart(partId, {
        onSuccess: () => {
          toast.success('Part deleted successfully');
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || 'Failed to delete part'
          );
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parts Management</h1>
          <p className="text-gray-600 text-sm mt-1">
            Total parts: {data?.pagination.total || 0}
          </p>
        </div>
        <button
          onClick={handleAddPart}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          disabled={isLoading}
        >
          <Plus size={20} />
          Add Part
        </button>
      </div>

      {/* Form Modal */}
      <PartFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingPart}
        mode={editingPart ? 'edit' : 'create'}
      />

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-600">Loading parts...</p>
        </div>
      ) : data?.parts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg">No parts found</p>
          <button
            onClick={handleAddPart}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first part →
          </button>
        </div>
      ) : (
        /* Table */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Brand
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data?.parts.map((part) => (
                  <tr key={part.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {part.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {part.brand}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      {formatPrice(part.price)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          part.stock > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {part.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {part.category}
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-3">
                      <button
                        onClick={() => handleEditPart(part)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletePart(part.id, part.name)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.pagination.pages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
              <p className="text-sm text-gray-600">
                Page {data.pagination.page} of {data.pagination.pages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled={page === data.pagination.pages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}