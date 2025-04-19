import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Toaster } from 'react-hot-toast';
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
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Farms App</h1>
              <div className="flex gap-3 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFarmForm(true)}
                  className="
                    flex-1 sm:flex-none inline-flex items-center justify-center
                    px-4 py-2 border border-transparent rounded-lg
                    shadow-sm text-sm font-medium text-white
                    bg-blue-600 hover:bg-blue-700 focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    transition-colors
                  "
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  Add Farm
                </motion.button>
                <motion.button
                  whileHover={{ scale: selectedFarmId ? 1.02 : 1 }}
                  whileTap={{ scale: selectedFarmId ? 0.98 : 1 }}
                  onClick={() => setShowAnimalForm(true)}
                  disabled={!selectedFarmId}
                  className={`
                    flex-1 sm:flex-none inline-flex items-center justify-center
                    px-4 py-2 border border-transparent rounded-lg
                    shadow-sm text-sm font-medium
                    transition-all duration-200
                    ${selectedFarmId
                      ? 'text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                      : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    }
                  `}
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  Add Animal
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="space-y-12">
            <FarmList
              onSelectFarm={handleSelectFarm}
              selectedFarmId={selectedFarmId}
            />
            <AnimatePresence mode="wait">
              {selectedFarmId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <AnimalList farmId={selectedFarmId} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        <AnimatePresence>
          {showFarmForm && (
            <FarmForm onClose={() => setShowFarmForm(false)} />
          )}

          {showAnimalForm && selectedFarmId && (
            <AnimalForm
              farmId={selectedFarmId}
              onClose={() => setShowAnimalForm(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </QueryClientProvider>
  );
}

export default App;
