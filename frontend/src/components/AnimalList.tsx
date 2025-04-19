import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Animal } from '../types';

interface AnimalListProps {
  farmId?: string;
}

export function AnimalList({ farmId }: AnimalListProps) {
  const queryClient = useQueryClient();
  const { data: animals, isLoading } = useQuery<Animal[]>({
    queryKey: ['animals', farmId],
    queryFn: () => api.getAnimals(farmId),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteAnimal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals', farmId] });
    },
  });

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Animals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {animals?.map((animal) => (
          <div
            key={animal._id}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <h3 className="text-xl font-semibold">{animal.name}</h3>
            <p className="text-gray-600">Species: {animal.species}</p>
            <p className="text-gray-600">Breed: {animal.breed}</p>
            <p className="text-gray-600">
              Birth Date: {new Date(animal.birthDate).toLocaleDateString()}
            </p>
            <div className="mt-2">
              <span
                className={`inline-block px-2 py-1 rounded-full text-sm ${
                  animal.status === 'healthy'
                    ? 'bg-green-100 text-green-800'
                    : animal.status === 'sick'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {animal.status}
              </span>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  // TODO: Implement edit functionality
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteMutation.mutate(animal._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
