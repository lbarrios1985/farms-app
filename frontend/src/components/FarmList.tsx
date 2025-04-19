import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    },
  });

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Farms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {farms?.map((farm) => (
          <div
            key={farm._id}
            className={`bg-white rounded-lg shadow-md p-4 cursor-pointer border-2 ${farm._id === selectedFarmId ? 'border-blue-500' : 'border-transparent'}`}
            onClick={() => onSelectFarm(farm._id)}
          >
            <h3 className="text-xl font-semibold">{farm.name}</h3>
            <p className="text-gray-600">Location: {farm.location}</p>
            <p className="text-gray-600">Size: {farm.size} hectares</p>
            <div className="mt-2">
              <h4 className="font-semibold">Production Types:</h4>
              <div className="flex flex-wrap gap-2">
                {farm.productionType.map((type) => (
                  <span
                    key={type}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditFarm(farm);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate(farm._id);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editFarm && (
        <FarmForm
          farm={editFarm}
          onClose={() => setEditFarm(undefined)}
        />
      )}
    </div>
  );
}
