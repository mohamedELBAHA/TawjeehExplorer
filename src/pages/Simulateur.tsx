import React, { useState, useEffect } from 'react';
import { Calculator, RotateCcw, Target, TrendingUp, BookOpen } from 'lucide-react';
import SimulatorCard from '../components/SimulatorCard';
import ResultsDisplay from '../components/ResultsDisplay';
import ScenarioHistory from '../components/ScenarioHistory';
import SchoolRecommendations from '../components/SchoolRecommendations';
import PlatformHeader from '../components/PlatformHeader';
import FloatingToast from '../components/FloatingToast';

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
  type: 'reverse';
}

const Simulateur: React.FC = () => {
  const [notes, setNotes] = useState<BacNotes>({
    regional: null,
    controleContinue: null,
    national: null,
    moyenne: null
  });
  
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeTab, setActiveTab] = useState<'simulator' | 'history'>('simulator');
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    show: boolean;
    position: { x: number; y: number };
  }>({
    message: '',
    type: 'success',
    show: false,
    position: { x: 0, y: 0 }
  });

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

  // Plus besoin de calcul automatique car nous sommes en mode reverse uniquement

  const handleSaveScenario = () => {
    if (notes.moyenne !== null) {
      const scenario: Scenario = {
        id: Date.now().toString(),
        date: new Date(),
        inputs: { ...notes },
        result: notes.moyenne,
        type: 'reverse'
      };
      setScenarios(prev => [scenario, ...prev].slice(0, 10)); // Garder les 10 derniers
      
      // This will be handled by the button click handler
    } else {
      // Show error notification if no moyenne is set
      setToast({
        message: 'Veuillez d\'abord entrer une moyenne souhaitée',
        type: 'error',
        show: true,
        position: { x: 0, y: 0 }
      });
    }
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const handleSaveButtonClick = (buttonRect: DOMRect) => {
    // Position the toast near the button
    const toastX = buttonRect.left + buttonRect.width / 2 - 100; // Center horizontally relative to button
    const toastY = buttonRect.top - 60; // Position above the button
    
    setToast({
      message: 'Scénario sauvegardé avec succès !',
      type: 'success',
      show: true,
      position: { x: toastX, y: toastY }
    });
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(prev => prev.filter(scenario => scenario.id !== id));
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
      
      {/* Toast Notification */}
      <FloatingToast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={closeToast}
        position={toast.position}
      />
      
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Simulateur d'Objectif Baccalauréat
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez quelle note vous devez obtenir à l'examen national pour atteindre votre objectif
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Column 1: Input Values */}
              <div className="w-full">
                <SimulatorCard
                  notes={notes}
                  onNotesChange={setNotes}
                  onReset={resetCalculator}
                  onSave={handleSaveScenario}
                  onSaveButtonClick={handleSaveButtonClick}
                />
              </div>

              {/* Column 2: Results */}
              <div className="w-full">
                <ResultsDisplay
                  notes={notes}
                />
              </div>

              {/* Column 3: School Recommendations */}
              <div className="w-full">
                <SchoolRecommendations
                  notes={notes}
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
          <ScenarioHistory scenarios={scenarios} onLoadScenario={setNotes} onDeleteScenario={handleDeleteScenario} />
        )}
        </div>
      </div>
    </div>
  );
};

export default Simulateur;