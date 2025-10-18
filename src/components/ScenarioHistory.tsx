import React from 'react';
import { Calendar, Target, Calculator, Trash2 } from 'lucide-react';

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

interface ScenarioHistoryProps {
  scenarios: Scenario[];
  onLoadScenario: (notes: BacNotes) => void;
}

const ScenarioHistory: React.FC<ScenarioHistoryProps> = ({ scenarios, onLoadScenario }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getMention = (moyenne: number) => {
    if (moyenne >= 16) return { label: 'Très Bien', color: 'text-green-600', bg: 'bg-green-50' };
    if (moyenne >= 14) return { label: 'Bien', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (moyenne >= 12) return { label: 'Assez Bien', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (moyenne >= 10) return { label: 'Passable', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'Insuffisant', color: 'text-red-600', bg: 'bg-red-50' };
  };

  if (scenarios.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Aucun scénario sauvegardé
          </h3>
          <p className="text-gray-500">
            Utilisez le simulateur pour calculer vos notes et sauvegarder vos scénarios
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-4">
        {scenarios.map((scenario) => {
          const mention = getMention(scenario.result);
          
          return (
            <div 
              key={scenario.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${scenario.type === 'calculate' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                      {scenario.type === 'calculate' ? (
                        <Calculator className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Target className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {scenario.type === 'calculate' ? 'Calcul de moyenne' : 'Objectif à atteindre'}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(scenario.date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {scenario.result.toFixed(2)}/20
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${mention.bg} ${mention.color}`}>
                      {mention.label}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs font-medium text-blue-600 mb-1">Examen Régional</div>
                    <div className="text-lg font-bold text-blue-800">
                      {scenario.inputs.regional?.toFixed(2) || 'N/A'}/20
                    </div>
                    <div className="text-xs text-blue-600">25% du total</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs font-medium text-green-600 mb-1">Contrôles Continus</div>
                    <div className="text-lg font-bold text-green-800">
                      {scenario.inputs.controleContinue?.toFixed(2) || 'N/A'}/20
                    </div>
                    <div className="text-xs text-green-600">25% du total</div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-xs font-medium text-purple-600 mb-1">Examen National</div>
                    <div className="text-lg font-bold text-purple-800">
                      {scenario.inputs.national?.toFixed(2) || 'N/A'}/20
                    </div>
                    <div className="text-xs text-purple-600">50% du total</div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <button
                    onClick={() => onLoadScenario(scenario.inputs)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Charger ce scénario</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      // Add delete functionality if needed
                      console.log('Delete scenario:', scenario.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Supprimer ce scénario"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScenarioHistory;
