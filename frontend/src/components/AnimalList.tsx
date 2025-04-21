import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { Animal } from '../types';
import { AnimalForm } from './AnimalForm';

interface AnimalListProps {
  farmId?: string;
}

export function AnimalList({ farmId }: AnimalListProps) {
  const [editAnimal, setEditAnimal] = useState<Animal>();
  const queryClient = useQueryClient();
  
  const { data: animals, isLoading } = useQuery<Animal[]>({
    queryKey: ['animals', farmId],
    queryFn: () => api.getAnimals(farmId),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteAnimal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals', farmId] });
      toast.success('Animal deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete animal');
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!animals?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No animals found. Add your first animal to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {animals.map((animal) => (
        <div
          key={animal._id}
          className="
            group relative p-4 rounded-md hover:bg-gray-50 transition-colors
          "
        >
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="text-sm font-medium text-gray-900 truncate">{animal.name}</h3>
                <span
                  className={`
                    inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                    ${animal.status === 'healthy'
                      ? 'bg-green-100 text-green-800'
                      : animal.status === 'sick'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }
                  `}
                >
                  {animal.status}
                </span>
              </div>

              <div className="mt-1 flex items-center text-sm text-gray-500">
                <span className="truncate">{animal.species} • {animal.breed}</span>
              </div>

              <div className="mt-1 flex items-center text-xs text-gray-500">
                {new Date(animal.birthDate).toLocaleDateString()}
              </div>
            </div>

            <div className="ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditAnimal(animal)}
                className="mr-2 text-gray-400 hover:text-gray-500"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this animal?')) {
                    deleteMutation.mutate(animal._id);
                  }
                }}
                className="text-gray-400 hover:text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {editAnimal && (
        <AnimalForm
          farmId={farmId!}
          animal={editAnimal}
          onClose={() => setEditAnimal(undefined)}
        />
      )}
    </div>
  );
}
