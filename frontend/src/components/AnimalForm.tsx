import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Animal } from '../types';

interface AnimalFormProps {
  animal?: Animal;
  farmId?: string;
  onClose: () => void;
}

interface AnimalFormData {
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  status: 'healthy' | 'sick' | 'quarantine';
}

export function AnimalForm({ animal, farmId, onClose }: AnimalFormProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<AnimalFormData>({
    defaultValues: animal ? {
      name: animal.name,
      species: animal.species,
      breed: animal.breed,
      birthDate: new Date(animal.birthDate).toISOString().split('T')[0],
      status: animal.status,
    } : {
      status: 'healthy',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: AnimalFormData) => {
      const finalFarmId = animal?.farmId || farmId;
      if (!finalFarmId) {
        throw new Error('Farm ID is required');
      }
      
      const animalData = {
        ...data,
        farmId: finalFarmId,
      };
      
      return animal
        ? api.updateAnimal(animal._id, animalData)
        : api.createAnimal(animalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals', farmId] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {animal ? 'Edit Animal' : 'Add Animal'}
        </h2>
        
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Species
              </label>
              <input
                {...register('species', { required: 'Species is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.species && (
                <p className="mt-1 text-sm text-red-600">{errors.species.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Breed
              </label>
              <input
                {...register('breed', { required: 'Breed is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.breed && (
                <p className="mt-1 text-sm text-red-600">{errors.breed.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Birth Date
              </label>
              <input
                type="date"
                {...register('birthDate', { required: 'Birth date is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.birthDate && (
                <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                {...register('status')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="healthy">Healthy</option>
                <option value="sick">Sick</option>
                <option value="quarantine">Quarantine</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
