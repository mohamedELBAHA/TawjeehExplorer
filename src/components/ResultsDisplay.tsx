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
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ notes }) => {
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
    <div className="h-full">
      <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Résultat
          </h3>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 flex flex-col justify-center">
          {requiredNational !== null && notes.moyenne !== null && (
            <div className="text-center space-y-6">
              <div>
                <p className="text-gray-600 mb-4 text-lg">
                  Pour obtenir <strong>{notes.moyenne}/20</strong>, vous devez avoir :
                </p>
                <div className="text-5xl font-bold mb-3">
                  <span className={requiredNational <= 20 ? 'text-green-600' : 'text-red-600'}>
                    {requiredNational.toFixed(2)}
                  </span>
                  <span className="text-2xl text-gray-500">/20</span>
                </div>
                <p className="text-gray-600 text-lg">à l'examen national</p>
              </div>
              
              {requiredNational > 20 && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-center text-red-600">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">
                      Objectif impossible à atteindre avec ces notes
                    </span>
                  </div>
                </div>
              )}

              {requiredNational <= 20 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Objectif réalisable !</h4>
                  <p className="text-green-700 text-sm">
                    Cette note à l'examen national vous permettra d'atteindre votre objectif.
                  </p>
                </div>
              )}
            </div>
          )}

          {(notes.moyenne === null || requiredNational === null) && (
            <div className="text-center text-gray-500 py-12">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Entrez votre objectif pour voir les résultats</p>
              <p className="text-sm mt-2">Les notes régionales et contrôles sont optionnelles</p>
            </div>
          )}
        </div>

        {/* Progress Bar at Bottom */}
        {notes.moyenne !== null && requiredNational !== null && (
          <div className="p-6 border-t border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4 text-center">Votre objectif sur l'échelle</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600 font-medium">
                <span>0</span>
                <span>10 (Passable)</span>
                <span>20</span>
              </div>
              <div className="relative w-full bg-gray-200 rounded-full h-4">
                <div
                  className="absolute top-0 left-0 h-4 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 transition-all duration-500"
                  style={{ width: `${Math.min((notes.moyenne / 20) * 100, 100)}%` }}
                />
                <div
                  className="absolute top-0 w-0.5 h-4 bg-gray-700 opacity-50"
                  style={{ left: '50%' }}
                />
                {/* Marker for objective */}
                <div
                  className="absolute -top-1 w-2 h-6 bg-[#cda86b] rounded-sm transform -translate-x-1/2"
                  style={{ left: `${Math.min((notes.moyenne / 20) * 100, 100)}%` }}
                />
              </div>
              <div className="text-center text-xs text-gray-500 mt-2">
                Objectif visé: {notes.moyenne.toFixed(1)}/20
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
