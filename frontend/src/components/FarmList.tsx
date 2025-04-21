import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { Farm } from "../types";
import { FarmForm } from "./FarmForm";

interface FarmListProps {
  farms: Farm[];
  selectedFarm: Farm | null;
  onSelectFarm: (farmId: string) => void;
  isLoading: boolean;
}

export function FarmList({
  farms,
  selectedFarm,
  onSelectFarm,
  isLoading,
}: FarmListProps) {
  const [editFarm, setEditFarm] = useState<Farm>();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteFarm(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
      if (selectedFarm?._id === deletedId) {
        onSelectFarm("");
      }
      toast.success("Farm deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete farm");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-indigo-200 border-t-indigo-500"></div>
          <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-3 border-indigo-200 opacity-20"></div>
        </div>
      </div>
    );
  }

  if (!farms?.length) {
    return (
      <div className="text-center py-12 px-4">
        <div className="space-y-4">
          <div className="flex justify-center">
            {/* <svg
              className="h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg> */}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">No farms yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first farm.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {farms.map((farm) => (
        <div
          key={farm._id}
          onClick={() => onSelectFarm(farm._id)}
          className={`
            group relative p-4 rounded-lg cursor-pointer
            border border-transparent
            transition-all duration-200 ease-in-out
            ${
              farm._id === selectedFarm?._id
                ? "bg-indigo-50 border-indigo-200 shadow-sm"
                : "hover:bg-gray-50 hover:border-gray-200"
            }
          `}
        >
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {farm.name}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {farm.size} ha
                </span>
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                Location: {farm.location}
              </div>
              {farm.productionType.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {farm.productionType.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditFarm(farm);
                }}
                className="mr-2 text-gray-400 hover:text-indigo-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-indigo-50"
              >
                <span className="text-sm font-medium">Edit</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Are you sure you want to delete this farm?")) {
                    deleteMutation.mutate(farm._id);
                  }
                }}
                className="text-gray-400 hover:text-red-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-red-50"
              >
                <span className="text-sm font-medium">Delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {editFarm && (
        <FarmForm farm={editFarm} onClose={() => setEditFarm(undefined)} />
      )}
    </div>
  );
}
