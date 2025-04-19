import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { Animal } from '../types';

type AnimalFormData = Omit<Animal, '_id' | 'createdAt' | 'updatedAt'>;

interface AnimalFormProps {
  farmId: string;
  animal?: Animal;
  onClose: () => void;
}

const ANIMAL_STATUS = [
  { id: 'healthy', label: 'Healthy', color: 'bg-green-100 text-green-800' },
  { id: 'sick', label: 'Sick', color: 'bg-red-100 text-red-800' },
  { id: 'recovering', label: 'Recovering', color: 'bg-yellow-100 text-yellow-800' },
] as const;

export function AnimalForm({ animal, farmId, onClose }: AnimalFormProps) {
  const [formData, setFormData] = useState<AnimalFormData>(
    animal ? {
      name: animal.name,
      species: animal.species,
      breed: animal.breed,
      birthDate: animal.birthDate,
      status: animal.status,
      farmId: animal.farmId,
    } : {
      name: '',
      species: '',
      breed: '',
      birthDate: '',
      status: 'healthy',
      farmId,
    }
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: AnimalFormData) =>
      animal
        ? api.updateAnimal(animal._id, data)
        : api.createAnimal({ ...data, farmId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals', farmId] });
      toast.success(animal ? 'Animal updated successfully' : 'Animal created successfully');
      onClose();
    },
    onError: () => {
      toast.error(animal ? 'Failed to update animal' : 'Failed to create animal');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
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
            {animal ? 'Edit Animal' : 'New Animal'}
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
                Animal Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="
                  mt-1 block w-full rounded-lg border-gray-300
                  shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                  text-sm transition-colors duration-200
                  hover:border-gray-400
                "
                placeholder="Enter animal name"
                required
              />
            </div>

            {/* Species & Breed Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="species"
                  className="block text-sm font-medium text-gray-700"
                >
                  Species
                </label>
                <input
                  type="text"
                  id="species"
                  value={formData.species}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, species: e.target.value }))
                  }
                  className="
                    mt-1 block w-full rounded-md border-gray-300
                    shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                    text-sm
                  "
                  placeholder="e.g. Cow"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="breed"
                  className="block text-sm font-medium text-gray-700"
                >
                  Breed
                </label>
                <input
                  type="text"
                  id="breed"
                  value={formData.breed}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, breed: e.target.value }))
                  }
                  className="
                    mt-1 block w-full rounded-md border-gray-300
                    shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                    text-sm
                  "
                  placeholder="e.g. Holstein"
                  required
                />
              </div>
            </div>

            {/* Birth Date Field */}
            <div>
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700"
              >
                Birth Date
              </label>
              <input
                type="date"
                id="birthDate"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, birthDate: e.target.value }))
                }
                className="
                  mt-1 block w-full rounded-lg border-gray-300
                  shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                  text-sm transition-colors duration-200
                  hover:border-gray-400
                "
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Status Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Health Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                {ANIMAL_STATUS.map(({ id, label, color }) => (
                  <label
                    key={id}
                    className={`
                      relative flex items-center justify-center p-3 cursor-pointer
                      rounded-lg transition-all duration-200 text-sm font-medium
                      border border-transparent
                      ${formData.status === id 
                        ? `${color} shadow-sm border-current` 
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}
                      ${formData.status === id ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105' : ''}
                    `}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={id}
                      checked={formData.status === id}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, status: e.target.value as Animal['status'] }))
                      }
                      className="sr-only"
                    />
                    {label}
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
              {animal ? 'Save Changes' : 'Create Animal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
