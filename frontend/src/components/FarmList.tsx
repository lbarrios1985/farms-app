import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon, ChartBarIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { Farm } from '../types';
import { FarmForm } from './FarmForm';

interface FarmListProps {
  onSelectFarm: (farmId: string) => void;
  selectedFarmId?: string;
}

export function FarmList({ onSelectFarm, selectedFarmId }: FarmListProps) {
  const [editFarm, setEditFarm] = useState<Farm>();
  const queryClient = useQueryClient();
  
  const { data: farms, isLoading } = useQuery<Farm[]>({
    queryKey: ['farms'],
    queryFn: () => api.getFarms(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteFarm(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      if (selectedFarmId === deletedId) {
        onSelectFarm('');
      }
      toast.success('Farm deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete farm');
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!farms?.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Farms Yet</h2>
        <p className="text-gray-600 mb-8">Start by adding your first farm!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Farms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {farms.map((farm) => (
            <motion.div
              key={farm._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className={`
                bg-white rounded-xl shadow-sm hover:shadow-md transition-all
                p-6 cursor-pointer border-2 relative overflow-hidden
                ${farm._id === selectedFarmId ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'}
              `}
              onClick={() => onSelectFarm(farm._id)}
            >
              {farm._id === selectedFarmId && (
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
              )}
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{farm.name}</h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>{farm.location}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  <span>{farm.size} hectares</span>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Production Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {farm.productionType.map((type) => (
                      <span
                        key={type}
                        className="
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors
                        "
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditFarm(farm);
                  }}
                  className="
                    inline-flex items-center px-3 py-2 border border-blue-500 rounded-md
                    text-sm font-medium text-blue-500 bg-white hover:bg-blue-50
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    transition-colors
                  "
                >
                  <PencilIcon className="h-4 w-4 mr-1.5" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this farm?')) {
                      deleteMutation.mutate(farm._id);
                    }
                  }}
                  className="
                    inline-flex items-center px-3 py-2 border border-red-500 rounded-md
                    text-sm font-medium text-red-500 bg-white hover:bg-red-50
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                    transition-colors
                  "
                >
                  <TrashIcon className="h-4 w-4 mr-1.5" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {editFarm && (
          <FarmForm
            farm={editFarm}
            onClose={() => setEditFarm(undefined)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
