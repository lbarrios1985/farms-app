import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { FarmList } from './components/FarmList';
import { AnimalList } from './components/AnimalList';
import { FarmForm } from './components/FarmForm';
import { AnimalForm } from './components/AnimalForm';
import { Farm } from './types';
import { api } from './services/api';

const queryClient = new QueryClient();

function MainContent() {
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [showFarmForm, setShowFarmForm] = useState(false);

  const { data: farms = [], isLoading } = useQuery<Farm[]>({
    queryKey: ['farms'],
    queryFn: () => api.getFarms(),
    staleTime: 5000
  });

  const handleSelectFarm = (farmId: string) => {
    const farm = farms.find((f: Farm) => f._id === farmId);
    setSelectedFarm(farm || null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">Farm Manager</h1>
              <span className="hidden sm:inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                {farms.length} Farms
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowFarmForm(true)}
                className="
                  inline-flex items-center px-4 py-2 border border-transparent
                  text-sm font-medium rounded-md shadow-sm text-white
                  bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
                  focus:ring-offset-2 focus:ring-blue-500 transition-colors
                  duration-200
                "
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Farm
              </button>

              <button
                onClick={() => setShowAnimalForm(true)}
                disabled={!selectedFarm}
                className={`
                  inline-flex items-center px-4 py-2 border text-sm font-medium
                  rounded-md shadow-sm transition-colors duration-200
                  ${!selectedFarm
                    ? 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed'
                    : 'border-transparent text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  }
                `}
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Animal
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="
          grid grid-cols-1 lg:grid-cols-2 gap-8
          bg-white rounded-xl shadow-lg p-8
          transition-all duration-300 ease-in-out
          hover:shadow-xl
        ">
          {/* Farm List Panel */}
          <div className="
            lg:border-r lg:pr-8
            space-y-6
            transition-all duration-300 ease-in-out
          ">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your Farms</h2>
              <span className="lg:hidden px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                {farms.length} Farms
              </span>
            </div>
            <FarmList
              farms={farms}
              selectedFarm={selectedFarm}
              onSelectFarm={handleSelectFarm}
              isLoading={isLoading}
            />
          </div>

          {/* Animal List Panel */}
          <div className="space-y-6">
            {selectedFarm ? (
              <>
                <h2 className="text-xl font-semibold text-gray-900">
                  Animals in {selectedFarm.name}
                </h2>
                <AnimalList
                  farmId={selectedFarm._id}
                />
              </>
            ) : (
              <div className="
                flex flex-col items-center justify-center
                h-[400px] text-center space-y-4
                text-gray-500
              ">
                <svg
                  className="h-12 w-12"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-lg font-medium">No Farm Selected</p>
                <p className="text-sm">
                  Select a farm from the list to view its animals
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showFarmForm && (
        <FarmForm onClose={() => setShowFarmForm(false)} />
      )}
      {showAnimalForm && selectedFarm && (
        <AnimalForm
          farmId={selectedFarm._id}
          onClose={() => setShowAnimalForm(false)}
        />
      )}
    </div>
  );
}

export function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <QueryClientProvider client={queryClient}>
        <MainContent />
      </QueryClientProvider>
    </div>
  );
}

export default App;
