import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { Farm } from '../types';

interface FarmFormProps {
  farm?: Farm;
  onClose: () => void;
}

const PRODUCTION_TYPES = [
  { id: 'dairy', label: 'Dairy' },
  { id: 'meat', label: 'Meat' },
  { id: 'wool', label: 'Wool' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'breeding', label: 'Breeding' },
] as const;

export function FarmForm({ farm, onClose }: FarmFormProps) {
  const [formData, setFormData] = useState<Omit<Farm, '_id' | 'createdAt' | 'updatedAt'>>(
    farm ? {
      name: farm.name,
      location: farm.location,
      size: farm.size,
      productionType: farm.productionType,
    } : {
      name: '',
      location: '',
      size: 0,
      productionType: [],
    }
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Omit<Farm, '_id' | 'createdAt' | 'updatedAt'>) =>
      farm ? api.updateFarm(farm._id, data) : api.createFarm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast.success(farm ? 'Farm updated successfully' : 'Farm created successfully');
      onClose();
    },
    onError: () => {
      toast.error(farm ? 'Failed to update farm' : 'Failed to create farm');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleProductionTypeChange = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      productionType: prev.productionType?.includes(type)
        ? prev.productionType.filter((t) => t !== type)
        : [...(prev.productionType || []), type],
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="
          bg-white rounded-xl shadow-2xl w-full max-w-md
          transform transition-all duration-300
          scale-95 opacity-0 animate-modal-enter
        "
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <h2 className="text-xl font-semibold text-gray-900">
            {farm ? 'Edit Farm' : 'New Farm'}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Farm Name: 
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="form-input block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
                placeholder="Enter farm name"
                required
              />
            </div>

            {/* Location Field */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                className="form-input block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
                placeholder="Enter farm location"
                required
              />
            </div>

            {/* Size Field */}
            <div>
              <label
                htmlFor="size"
                className="block text-sm font-medium text-gray-700"
              >
                Size (hectares)
              </label>
              <input
                type="number"
                id="size"
                value={formData.size}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    size: parseFloat(e.target.value),
                  }))
                }
                className="form-input block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
                required
                min="0"
                step="0.1"
                placeholder="0.0"
              />
            </div>

            {/* Production Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Production Types
              </label>
              <div className="grid grid-cols-2 gap-3">
                {PRODUCTION_TYPES.map(({ id, label }) => (
                  <label
                    key={id}
                    className="
                      relative flex items-start p-3 cursor-pointer
                      hover:bg-indigo-50 rounded-lg
                      transition-all duration-200 ease-in-out
                      border border-transparent hover:border-indigo-200
                    "
                  >
                    <div className="min-w-0 flex-1 text-sm">
                      <div className="font-medium text-gray-700">{label}</div>
                    </div>
                    <div className="ml-3 flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={formData.productionType?.includes(id)}
                        onChange={() => handleProductionTypeChange(id)}
                        className="form-checkbox h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors duration-200"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="
                inline-flex justify-center rounded-lg border border-gray-300
                bg-white px-5 py-2.5 text-sm font-medium text-gray-700
                shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                focus:ring-gray-400 focus:ring-offset-2
                transition-all duration-200 ease-in-out
                hover:text-gray-900 hover:border-gray-400
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="
                inline-flex justify-center rounded-lg border border-transparent
                bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white
                shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2
                focus:ring-indigo-500 focus:ring-offset-2
                transition-all duration-200 ease-in-out
                transform hover:scale-105
              "
            >
              {farm ? 'Save Changes' : 'Create Farm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
