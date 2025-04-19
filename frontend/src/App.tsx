import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FarmList } from './components/FarmList';
import { FarmForm } from './components/FarmForm';
import { AnimalList } from './components/AnimalList';
import { AnimalForm } from './components/AnimalForm';

const queryClient = new QueryClient();

function App() {
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState<string>();

  const handleSelectFarm = (farmId: string) => {
    setSelectedFarmId(farmId || undefined);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Farms App</h1>
              <div className="space-x-4">
                <button
                  onClick={() => setShowFarmForm(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add Farm
                </button>
                <button
                  onClick={() => setShowAnimalForm(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  disabled={!selectedFarmId}
                >
                  Add Animal
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <FarmList
              onSelectFarm={handleSelectFarm}
              selectedFarmId={selectedFarmId}
            />
            {selectedFarmId && <AnimalList farmId={selectedFarmId} />}
          </div>
        </main>

        {showFarmForm && (
          <FarmForm onClose={() => setShowFarmForm(false)} />
        )}

        {showAnimalForm && selectedFarmId && (
          <AnimalForm
            farmId={selectedFarmId}
            onClose={() => setShowAnimalForm(false)}
          />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
