import React from 'react';
import { Trophy, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface BacNotes {
  regional: number | null;
  controleContinue: number | null;
  national: number | null;
  moyenne: number | null;
}

interface ResultsDisplayProps {
  notes: BacNotes;
  mode: 'calculate' | 'reverse';
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ notes, mode }) => {
  const getMention = (moyenne: number) => {
    if (moyenne >= 16) return { label: 'Très Bien', color: 'text-green-600', bg: 'bg-green-50' };
    if (moyenne >= 14) return { label: 'Bien', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (moyenne >= 12) return { label: 'Assez Bien', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (moyenne >= 10) return { label: 'Passable', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'Insuffisant', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getRequiredNational = () => {
    if (notes.moyenne && notes.regional && notes.controleContinue) {
      const required = (notes.moyenne - (notes.regional * 0.25 + notes.controleContinue * 0.25)) / 0.5;
      return Math.round(required * 100) / 100;
    }
    return null;
  };

  const requiredNational = getRequiredNational();

  return (
    <div className="space-y-6">
      {/* Résultat Principal */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
          Résultat
        </h3>

        {mode === 'calculate' && notes.moyenne !== null && (
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {notes.moyenne.toFixed(2)}
              <span className="text-2xl text-gray-500">/20</span>
            </div>
            {(() => {
              const mention = getMention(notes.moyenne);
              return (
                <div className={`inline-flex items-center px-4 py-2 rounded-full ${mention.bg} ${mention.color} font-medium`}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {mention.label}
                </div>
              );
            })()}
          </div>
        )}

        {mode === 'reverse' && requiredNational !== null && (
          <div className="text-center">
            <p className="text-gray-600 mb-3">
              Pour obtenir <strong>{notes.moyenne}/20</strong>, vous devez avoir :
            </p>
            <div className="text-4xl font-bold mb-2">
              <span className={requiredNational <= 20 ? 'text-green-600' : 'text-red-600'}>
                {requiredNational.toFixed(2)}
              </span>
              <span className="text-xl text-gray-500">/20</span>
            </div>
            <p className="text-sm text-gray-600">à l'examen national</p>
            
            {requiredNational > 20 && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <div className="flex items-center text-red-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">
                    Objectif impossible à atteindre avec ces notes
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {notes.moyenne === null && (
          <div className="text-center text-gray-500 py-8">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Entrez vos notes pour voir le résultat</p>
          </div>
        )}
      </div>

      {/* Progression visuelle */}
      {notes.moyenne !== null && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Progression</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>0</span>
              <span>10</span>
              <span>20</span>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-3">
              <div
                className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"
                style={{ width: `${Math.min((notes.moyenne / 20) * 100, 100)}%` }}
              />
              <div
                className="absolute top-0 w-1 h-3 bg-gray-700"
                style={{ left: '50%' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
