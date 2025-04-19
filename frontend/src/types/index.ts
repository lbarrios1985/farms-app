export interface Farm {
  _id: string;
  name: string;
  location: string;
  size: number;
  productionType: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Animal {
  _id: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  farmId: string;
  status: 'healthy' | 'sick' | 'quarantine';
  createdAt: string;
  updatedAt: string;
}
