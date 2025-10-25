import React from 'react';
import { MapPin, Users, Trophy, ArrowRight, Star, Clock } from 'lucide-react';
import { schoolsData, School } from '../data/schools';

interface BacNotes {
  regional: number | null;
  controleContinue: number | null;
  national: number | null;
  moyenne: number | null;
}

interface SchoolRecommendationsProps {
  notes: BacNotes;
}

const SchoolRecommendations: React.FC<SchoolRecommendationsProps> = ({ notes }) => {
  // Calculate eligible schools based on moyenne
  const getEligibleSchools = (moyenne: number): School[] => {
    return schoolsData.filter(school => {
      if (typeof school.seuilEntree === 'number') {
        return moyenne >= school.seuilEntree;
      } else if (typeof school.seuilEntree === 'object') {
        // For schools with multiple thresholds, check if moyenne meets any of them
        const thresholds = Object.values(school.seuilEntree as { [bacType: string]: number });
        return thresholds.some(threshold => moyenne >= threshold);
      }
      return false;
    }).sort((a, b) => {
      // Sort by threshold (descending) to show most competitive schools first
      const aThreshold = typeof a.seuilEntree === 'number' ? a.seuilEntree : 
        (typeof a.seuilEntree === 'object' ? Math.max(...Object.values(a.seuilEntree as { [bacType: string]: number })) : 0);
      const bThreshold = typeof b.seuilEntree === 'number' ? b.seuilEntree : 
        (typeof b.seuilEntree === 'object' ? Math.max(...Object.values(b.seuilEntree as { [bacType: string]: number })) : 0);
      return bThreshold - aThreshold;
    });
  };

  const eligibleSchools = notes.moyenne ? getEligibleSchools(notes.moyenne) : [];

  if (!notes.moyenne) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-[#cda86b]" />
          Établissements Recommandés
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <Trophy className="w-16 h-16 mx-auto opacity-20" />
          </div>
          <p className="text-gray-500">
            Entrez votre moyenne souhaitée pour découvrir les établissements accessibles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-[#cda86b]" />
        Établissements Recommandés
        <span className="ml-2 bg-[#cda86b]/10 text-[#004235] px-2 py-1 rounded-full text-sm font-medium">
          {eligibleSchools.length}
        </span>
      </h3>

      {eligibleSchools.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <Clock className="w-16 h-16 mx-auto opacity-20" />
          </div>
          <p className="text-gray-500 mb-2">Aucun établissement trouvé pour cette moyenne</p>
          <p className="text-sm text-gray-400">
            Essayez d'améliorer votre moyenne pour accéder à plus d'options
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {eligibleSchools.slice(0, 10).map((school) => (
            <SchoolCard key={school.id} school={school} userMoyenne={notes.moyenne!} />
          ))}
          
          {eligibleSchools.length > 10 && (
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                +{eligibleSchools.length - 10} autres établissements disponibles
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Individual School Card Component
interface SchoolCardProps {
  school: School;
  userMoyenne: number;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school, userMoyenne }) => {
  const getThreshold = (school: School): number => {
    if (typeof school.seuilEntree === 'number') {
      return school.seuilEntree;
    } else if (typeof school.seuilEntree === 'object') {
      return Math.min(...Object.values(school.seuilEntree as { [bacType: string]: number }));
    }
    return 0;
  };

  const threshold = getThreshold(school);
  const marginAboveThreshold = userMoyenne - threshold;

  const getMatchStrength = (margin: number): { color: string; label: string; bgColor: string } => {
    if (margin >= 3) return { color: 'text-green-600', label: 'Excellente correspondance', bgColor: 'bg-green-50' };
    if (margin >= 1.5) return { color: 'text-blue-600', label: 'Bonne correspondance', bgColor: 'bg-blue-50' };
    if (margin >= 0.5) return { color: 'text-yellow-600', label: 'Correspondance modérée', bgColor: 'bg-yellow-50' };
    return { color: 'text-orange-600', label: 'Correspondance limite', bgColor: 'bg-orange-50' };
  };

  const matchStrength = getMatchStrength(marginAboveThreshold);

  return (
    <div className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${matchStrength.bgColor}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm mb-1">{school.name}</h4>
          <div className="flex items-center text-xs text-gray-600 mb-2">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{school.city}</span>
            <span className="mx-2">•</span>
            <Users className="w-3 h-3 mr-1" />
            <span>{school.students} étudiants</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium text-gray-500">Seuil</div>
          <div className="text-sm font-bold text-[#004235]">{threshold.toFixed(1)}/20</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className={`flex items-center ${matchStrength.color}`}>
          <Star className="w-3 h-3 mr-1" />
          <span className="text-xs font-medium">{matchStrength.label}</span>
        </div>
        <div className="text-xs text-gray-500">
          +{marginAboveThreshold.toFixed(1)} pts
        </div>
      </div>

      {school.specialties.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {school.specialties.slice(0, 2).map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {specialty}
              </span>
            ))}
            {school.specialties.length > 2 && (
              <span className="text-xs text-gray-400">
                +{school.specialties.length - 2} autres
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolRecommendations;
