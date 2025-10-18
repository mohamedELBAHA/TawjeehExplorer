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
          <div className="grid lg:grid-cols-3 gap-8">
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

            {/* Résultats et Informations */}
            <div className="space-y-6">
              <ResultsDisplay
                notes={notes}
                mode={mode}
              />
              
              {/* Informations sur le calcul */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-[#cda86b]" />
                  Comment ça marche ?
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Examen Régional:</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contrôles Continus:</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Examen National:</span>
                    <span className="font-medium">50%</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <strong>Formule:</strong><br />
                      Moyenne = (Régional × 0.25) + (Contrôle × 0.25) + (National × 0.50)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ScenarioHistory scenarios={scenarios} onLoadScenario={setNotes} />
        )}
        </div>
      </div>
    </div>
  );
};

export default Simulateur;