import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { FarmList } from "./components/FarmList";
import { AnimalList } from "./components/AnimalList";
import { FarmForm } from "./components/FarmForm";
import { AnimalForm } from "./components/AnimalForm";
import { Farm } from "./types";
import { api } from "./services/api";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainContent />
    </QueryClientProvider>
  );
}

function MainContent() {
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [showFarmForm, setShowFarmForm] = useState(false);

  const { data: farms = [], isLoading } = useQuery<Farm[]>({
    queryKey: ["farms"],
    queryFn: () => api.getFarms(),
    staleTime: 5000,
  });

  const handleSelectFarm = (farmId: string) => {
    const farm = farms.find((f: Farm) => f._id === farmId);
    setSelectedFarm(farm || null);
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" />

      <header className="bg-white shadow sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-gray-900">Farm Manager</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowFarmForm(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Farm
            </button>
            <button
              onClick={() => setShowAnimalForm(true)}
              disabled={!selectedFarm}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm ${!selectedFarm
                  ? "border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed"
                  : "text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                }`}
            >
              Add Animal
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="container max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="lg:border-r lg:pr-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Farms {farms.length}
                  </h2>
                </div>
                <FarmList
                  farms={farms}
                  selectedFarm={selectedFarm}
                  onSelectFarm={handleSelectFarm}
                  isLoading={isLoading}
                />
              </div>

              <div className="space-y-4">
                {selectedFarm ? (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Animals in {selectedFarm.name}
                    </h2>
                    <AnimalList farmId={selectedFarm._id} />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-3 text-gray-500">
                    {/* <svg
                      className="h-8 w-8"
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
                    </svg> */}
                    <p className="text-lg font-medium">No Farm Selected</p>
                    <p className="text-sm">
                      Select a farm from the list to view its animals
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showFarmForm && <FarmForm onClose={() => setShowFarmForm(false)} />}
      {showAnimalForm && selectedFarm && (
        <AnimalForm
          farmId={selectedFarm._id}
          onClose={() => setShowAnimalForm(false)}
        />
      )}
    </div>
  );
}

export default App;
