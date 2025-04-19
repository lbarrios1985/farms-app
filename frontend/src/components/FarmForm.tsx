import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Farm } from '../types';

interface FarmFormProps {
  farm?: Farm;
  onClose: () => void;
}

interface FarmFormData {
  name: string;
  location: string;
  size: number;
  productionType: string;
}

export function FarmForm({ farm, onClose }: FarmFormProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<FarmFormData>({
    defaultValues: farm ? {
      name: farm.name,
      location: farm.location,
      size: farm.size,
      productionType: farm.productionType.join(', '),
    } : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data: FarmFormData) => {
      const farmData = {
        ...data,
        productionType: data.productionType.split(',').map(type => type.trim()),
      };
      
      return farm
        ? api.updateFarm(farm._id, farmData)
        : api.createFarm(farmData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {farm ? 'Edit Farm' : 'Create Farm'}
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
                Location
              </label>
              <input
                {...register('location', { required: 'Location is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Size (hectares)
              </label>
              <input
                type="number"
                {...register('size', {
                  required: 'Size is required',
                  min: { value: 0, message: 'Size must be positive' },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.size && (
                <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Production Types (comma-separated)
              </label>
              <input
                {...register('productionType', { required: 'Production types are required' })}
                placeholder="dairy, crops, livestock"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.productionType && (
                <p className="mt-1 text-sm text-red-600">{errors.productionType.message}</p>
              )}
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
