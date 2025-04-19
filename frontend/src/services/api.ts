import { Farm, Animal } from '../types';

const API_URL = 'http://localhost:3000/api';

export const api = {
  // Farm endpoints
  async getFarms(): Promise<Farm[]> {
    const response = await fetch(`${API_URL}/farms`);
    return response.json();
  },

  async getFarm(id: string): Promise<Farm> {
    const response = await fetch(`${API_URL}/farms/${id}`);
    return response.json();
  },

  async createFarm(farm: Omit<Farm, '_id' | 'createdAt' | 'updatedAt'>): Promise<Farm> {
    const response = await fetch(`${API_URL}/farms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(farm),
    });
    return response.json();
  },

  async updateFarm(id: string, farm: Partial<Farm>): Promise<Farm> {
    const response = await fetch(`${API_URL}/farms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(farm),
    });
    return response.json();
  },

  async deleteFarm(id: string): Promise<void> {
    await fetch(`${API_URL}/farms/${id}`, {
      method: 'DELETE',
    });
  },

  // Animal endpoints
  async getAnimals(farmId?: string): Promise<Animal[]> {
    const url = farmId ? `${API_URL}/animals?farmId=${farmId}` : `${API_URL}/animals`;
    const response = await fetch(url);
    return response.json();
  },

  async getAnimal(id: string): Promise<Animal> {
    const response = await fetch(`${API_URL}/animals/${id}`);
    return response.json();
  },

  async createAnimal(animal: Omit<Animal, '_id' | 'createdAt' | 'updatedAt'>): Promise<Animal> {
    const response = await fetch(`${API_URL}/animals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(animal),
    });
    return response.json();
  },

  async updateAnimal(id: string, animal: Partial<Animal>): Promise<Animal> {
    const response = await fetch(`${API_URL}/animals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(animal),
    });
    return response.json();
  },

  async deleteAnimal(id: string): Promise<void> {
    await fetch(`${API_URL}/animals/${id}`, {
      method: 'DELETE',
    });
  },
};
