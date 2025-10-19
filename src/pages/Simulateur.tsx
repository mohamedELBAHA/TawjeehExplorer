import React, { useState, useEffect } from 'react';
import { Calculator, RotateCcw, Target, TrendingUp, BookOpen } from 'lucide-react';
import SimulatorCard from '../components/SimulatorCard';
import ResultsDisplay from '../components/ResultsDisplay';
import ScenarioHistory from '../components/ScenarioHistory';
import PlatformHeader from '../components/PlatformHeader';

interface BacNotes {
  regional: number | null;
  controleContinue: number | null;
  national: number | null;
  moyenne: number | null;
}

interface Scenario {
  id: string;
  date: Date;
  inputs: BacNotes;
  result: number;
  type: 'calculate' | 'reverse';
}

const Simulateur: React.FC = () => {
  const [notes, setNotes] = useState<BacNotes>({
    regional: null,
    controleContinue: null,
    national: null,
    moyenne: null
  });
  
  const [mode, setMode] = useState<'calculate' | 'reverse'>('calculate');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeTab, setActiveTab] = useState<'simulator' | 'history'>('simulator');

  // Calcul de la moyenne du bac
  const calculateMoyenne = (regional: number, controle: number, national: number): number => {
    return Math.round((regional * 0.25 + controle * 0.25 + national * 0.5) * 100) / 100;
  };

  // Calcul inverse pour obtenir la note nécessaire
  const calculateRequired = (target: number, regional?: number, controle?: number): { 
    national?: number, 
    regional?: number, 
    controle?: number 
  } => {
    if (regional !== undefined && controle !== undefined) {
      const required = (target - (regional * 0.25 + controle * 0.25)) / 0.5;
      return { national: Math.round(required * 100) / 100 };
    }
    return {};
  };

  // Mise à jour automatique des calculs
  useEffect(() => {
    if (mode === 'calculate' && notes.regional !== null && notes.controleContinue !== null && notes.national !== null) {
      const moyenne = calculateMoyenne(notes.regional, notes.controleContinue, notes.national);
      setNotes(prev => ({ ...prev, moyenne }));
    }
  }, [notes.regional, notes.controleContinue, notes.national, mode]);

  const handleSaveScenario = () => {
    if (notes.moyenne !== null) {
      const scenario: Scenario = {
        id: Date.now().toString(),
        date: new Date(),
        inputs: { ...notes },
        result: notes.moyenne,
        type: mode
      };
      setScenarios(prev => [scenario, ...prev].slice(0, 10)); // Garder les 10 derniers
    }
  };

  const resetCalculator = () => {
    setNotes({
      regional: null,
      controleContinue: null,
      national: null,
      moyenne: null
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PlatformHeader />
      
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Simulateur de Notes du Baccalauréat
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Calculez votre moyenne du bac ou découvrez les notes nécessaires pour atteindre votre objectif
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-2 shadow-md">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'simulator'
                  ? 'bg-[#cda86b] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#cda86b]'
              }`}
            >
              <Calculator className="w-4 h-4 inline mr-2" />
              Simulateur
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-[#cda86b] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#cda86b]'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Historique
            </button>
          </div>
        </div>

        {activeTab === 'simulator' ? (
          <>
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              {/* Simulateur Principal */}
              <div className="lg:col-span-2">
                <SimulatorCard
                  notes={notes}
                  mode={mode}
                  onNotesChange={setNotes}
                  onModeChange={setMode}
                  onReset={resetCalculator}
                  onSave={handleSaveScenario}
                />
              </div>

              {/* Résultats - Full Width */}
              <div className="lg:col-span-1">
                <ResultsDisplay
                  notes={notes}
                  mode={mode}
                />
              </div>
            </div>

            {/* Comment ça marche - Minimalistic & Full Width */}
            <div className="w-full">
              <div className="py-8 px-6">
                <div className="max-w-6xl mx-auto">
                  <h3 className="text-lg font-semibold text-gray-700 text-center mb-6">
                    Comment ça marche ?
                  </h3>
                  
                  <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                    {/* Formula */}
                    <div className="text-center md:text-left">
                      <div className="bg-gray-100 rounded-lg px-6 py-4">
                        <p className="text-gray-700 text-sm font-medium">
                          Moyenne = Régional × 25% + Contrôle × 25% + National × 50%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <ScenarioHistory scenarios={scenarios} onLoadScenario={setNotes} />
        )}
        </div>
      </div>
    </div>
  );
};

export default Simulateur;