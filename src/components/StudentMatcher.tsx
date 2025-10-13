import React, { useState, useEffect } from 'react';
import { schoolsData, School } from '../data/schools';

interface StudentProfile {
  bacType: string;
  grades: {
    math: number;
    physics: number;
    french: number;
    philosophy: number;
    speciality: number;
  };
  preferredCities: string[];
  preferredFields: string[];
  budgetRange: {
    min: number;
    max: number;
  };
  constraints: {
    publicPrivate: 'public' | 'private' | 'both';
    concoursPreference: 'with' | 'without' | 'both';
    needsHousing: boolean;
    needsScholarship: boolean;
  };
}

interface MatchResult {
  school: School;
  score: number;
  reasons: string[];
}

const STEPS = [
  { id: 1, title: "Type de Baccalauréat", description: "Sélectionnez votre type de bac" },
  { id: 2, title: "Notes Principales", description: "Saisissez vos moyennes par matière" },
  { id: 3, title: "Villes Préférées", description: "Choisissez jusqu'à 3 villes (max)" },
  { id: 4, title: "Domaines d'Études", description: "Sélectionnez vos domaines d'intérêt" },
  { id: 5, title: "Budget Familial", description: "Définissez votre fourchette budgétaire" },
  { id: 6, title: "Préférences", description: "Vos contraintes et besoins spécifiques" },
  { id: 7, title: "Résultats", description: "Vos recommandations personnalisées" }
];

const BAC_TYPES = [
  "Sciences Mathématiques A",
  "Sciences Mathématiques B",
  "Sciences Physiques", 
  "Sciences de la Vie et de la Terre",
  "Sciences Économiques",
  "Bac Technique",
  "Bac Professionnel"
];

const CITIES = [
  "Rabat", "Casablanca", "Fès", "Marrakech", "Agadir", 
  "Tanger", "Oujda", "Kénitra", "Safi", "Tétouan"
];

const FIELDS = [
  "Ingénierie", "Sciences de la Santé", "Sciences et Technologies",
  "Sciences Humaines et Sociales", "Économie et Gestion", "Arts et Lettres"
];

const StudentMatcher: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    bacType: '',
    grades: { math: 12, physics: 12, french: 12, philosophy: 12, speciality: 12 },
    preferredCities: [],
    preferredFields: [],
    budgetRange: { min: 5000, max: 50000 },
    constraints: {
      publicPrivate: 'both',
      concoursPreference: 'both',
      needsHousing: false,
      needsScholarship: false
    }
  });
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);

  const calculateMatches = async (): Promise<MatchResult[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = schoolsData.map(school => {
          let score = 0;
          const reasons: string[] = [];

          // Bac Type Match (25%)
          if (school.bacTypes.includes(studentProfile.bacType)) {
            score += 25;
            reasons.push(`Accepte votre type de bac (${studentProfile.bacType})`);
          }

          // Field Match (20%)
          if (studentProfile.preferredFields.includes(school.filiere)) {
            score += 20;
            reasons.push(`Correspond à votre filière préférée (${school.filiere})`);
          }

          // City Match (15%)
          if (studentProfile.preferredCities.includes(school.city)) {
            score += 15;
            reasons.push(`Située dans une ville de votre choix (${school.city})`);
          }

          // Grade Match (20%)
          const averageGrade = Object.values(studentProfile.grades).reduce((a, b) => a + b, 0) / 5;
          if (school.seuilEntree !== 'NA') {
            if (typeof school.seuilEntree === 'number') {
              if (averageGrade >= school.seuilEntree) {
                score += 20;
                reasons.push(`Votre moyenne (${averageGrade.toFixed(1)}) dépasse le seuil requis`);
              }
            } else {
              // Handle object-based seuil
              const bacTypeSeuilEntree = school.seuilEntree[studentProfile.bacType];
              if (bacTypeSeuilEntree && averageGrade >= bacTypeSeuilEntree) {
                score += 20;
                reasons.push(`Votre moyenne (${averageGrade.toFixed(1)}) dépasse le seuil requis (${bacTypeSeuilEntree})`);
              }
            }
          } else {
            score += 10;
            reasons.push('Seuil d\'admission flexible');
          }

          // Public/Private Match (10%)
          if (studentProfile.constraints.publicPrivate === 'both' || 
              (studentProfile.constraints.publicPrivate === 'public' && school.isPublic) ||
              (studentProfile.constraints.publicPrivate === 'private' && !school.isPublic)) {
            score += 10;
            reasons.push(school.isPublic ? 'École publique' : 'École privée');
          }

          // Concours Match (10%)
          if (studentProfile.constraints.concoursPreference === 'both' ||
              (studentProfile.constraints.concoursPreference === 'with' && school.requiresConcours) ||
              (studentProfile.constraints.concoursPreference === 'without' && !school.requiresConcours)) {
            score += 10;
            reasons.push(school.requiresConcours ? 'Admission par concours' : 'Admission directe');
          }

          return { school, score, reasons };
        }).filter(result => result.score > 30)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        resolve(results);
      }, 2000);
    });
  };

  const handleNext = async () => {
    if (currentStep === 6) {
      setIsLoading(true);
      const results = await calculateMatches();
      setMatchResults(results);
      setIsLoading(false);
    }
    setCurrentStep(prev => Math.min(prev + 1, 7));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setStudentProfile({
      bacType: '',
      grades: { math: 12, physics: 12, french: 12, philosophy: 12, speciality: 12 },
      preferredCities: [],
      preferredFields: [],
      budgetRange: { min: 5000, max: 50000 },
      constraints: {
        publicPrivate: 'both',
        concoursPreference: 'both',
        needsHousing: false,
        needsScholarship: false
      }
    });
    setMatchResults([]);
  };

  const exportResults = () => {
    const averageGrade = Object.values(studentProfile.grades).reduce((a, b) => a + b, 0) / 5;
    const currentDate = new Date().toLocaleDateString('fr-FR');
    
    let reportContent = `RAPPORT D'ORIENTATION PERSONNALISÉ
Tawjeeh Explorer - ${currentDate}

====================================
PROFIL ÉTUDIANT
====================================

Type de Baccalauréat: ${studentProfile.bacType}

Moyennes par matière:
• Mathématiques: ${studentProfile.grades.math}/20
• Physique-Chimie: ${studentProfile.grades.physics}/20
• Français: ${studentProfile.grades.french}/20
• Philosophie: ${studentProfile.grades.philosophy}/20
• Matière de spécialité: ${studentProfile.grades.speciality}/20
• Moyenne générale: ${averageGrade.toFixed(2)}/20

Villes préférées: ${studentProfile.preferredCities.join(', ')}
Domaines d'intérêt: ${studentProfile.preferredFields.join(', ')}

Budget familial: ${studentProfile.budgetRange.min.toLocaleString()} - ${studentProfile.budgetRange.max.toLocaleString()} MAD

Préférences:
• Secteur: ${studentProfile.constraints.publicPrivate === 'public' ? 'Public uniquement' : 
              studentProfile.constraints.publicPrivate === 'private' ? 'Privé uniquement' : 'Public et Privé'}
• Mode d'admission: ${studentProfile.constraints.concoursPreference === 'with' ? 'Avec concours' : 
                     studentProfile.constraints.concoursPreference === 'without' ? 'Sans concours' : 'Les deux'}
• Logement étudiant: ${studentProfile.constraints.needsHousing ? 'Oui' : 'Non'}
• Bourse d'études: ${studentProfile.constraints.needsScholarship ? 'Oui' : 'Non'}

====================================
RECOMMANDATIONS (${matchResults.length} écoles)
====================================

`;

    matchResults.forEach((result, index) => {
      reportContent += `
${index + 1}. ${result.school.name}
   Compatibilité: ${result.score}%
   Ville: ${result.school.city}
   Type: ${result.school.type}
   Filière: ${result.school.filiere}
   Seuil d'entrée: ${typeof result.school.seuilEntree === 'object' && result.school.seuilEntree !== null
     ? Object.entries(result.school.seuilEntree)
         .map(([bacType, seuil]) => `${bacType}: ${seuil}/20`)
         .join(', ')
     : `${result.school.seuilEntree}/20`}
   
   Description:
   ${result.school.description}
   
   Raisons de correspondance:
${result.reasons.map(reason => `   ✓ ${reason}`).join('\n')}
   
   Contact:
   • Téléphone: ${result.school.phone}
   • Email: ${result.school.email}
   • Site web: ${result.school.website}
   
   Informations supplémentaires:
   • Étudiants: ${result.school.students}
   • Fondée en: ${result.school.founded}
   • Taux de réussite: ${result.school.successRate}%
   • Taux d'emploi: ${result.school.employmentRate}%
   • Salaire moyen: ${result.school.averageSalary?.toLocaleString()} MAD
   
   Spécialités: ${result.school.specialties.join(', ')}
   Programmes: ${result.school.programs.join(', ')}

${'='.repeat(50)}
`;
    });

    reportContent += `
MÉTHODOLOGIE DE CORRESPONDANCE
====================================

Notre algorithme d'orientation personnalisé évalue votre profil selon ces critères:

• Type de Baccalauréat (25%): Correspondance avec les types de bac acceptés
• Domaine d'études (20%): Alignement avec vos filières préférées  
• Compatibilité des notes (20%): Votre moyenne vs seuils d'admission
• Localisation (15%): Proximité avec vos villes préférées
• Secteur public/privé (10%): Respect de vos préférences sectorielles
• Mode d'admission (10%): Concours vs admission directe

Score minimum affiché: 30%

====================================
CONSEILS ET PROCHAINES ÉTAPES
====================================

1. Contactez directement les écoles qui vous intéressent
2. Vérifiez les dates limites d'inscription
3. Préparez vos dossiers de candidature
4. Explorez les possibilités de bourses et d'aide financière
5. Visitez les campus si possible

Pour plus d'informations, consultez notre plateforme:
https://tawjeeh-explorer.com

Rapport généré automatiquement par Tawjeeh Explorer
© 2025 - Assistant d'orientation intelligent pour étudiants marocains
`;

    // Create and download the file
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rapport_Orientation_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return studentProfile.bacType !== '';
      case 2: return true; // Grades have default values
      case 3: return studentProfile.preferredCities.length > 0;
      case 4: return studentProfile.preferredFields.length > 0;
      case 5: return true; // Budget has default values
      case 6: return true; // Constraints have default values
      default: return true;
    }
  };

  const progress = (currentStep / 7) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Quel est votre type de baccalauréat ?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {BAC_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setStudentProfile(prev => ({ ...prev, bacType: type }))}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    studentProfile.bacType === type
                      ? 'border-[#004235] bg-[#004235] text-white'
                      : 'border-gray-200 hover:border-[#cda86b]'
                  }`}
                >
                  <div className="font-medium">{type}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quelles sont vos moyennes par matière ?</h3>
            <p className="text-gray-600 text-sm">Utilisez les curseurs pour indiquer vos moyennes (sur 20)</p>
            
            {Object.entries(studentProfile.grades).map(([subject, grade]) => {
              const labels: { [key: string]: string } = {
                math: 'Mathématiques',
                physics: 'Physique-Chimie',
                french: 'Français',
                philosophy: 'Philosophie',
                speciality: 'Matière de spécialité'
              };
              
              return (
                <div key={subject} className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-medium">{labels[subject]}</label>
                    <span className="font-bold text-[#004235]">{grade}/20</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    value={grade}
                    onChange={(e) => setStudentProfile(prev => ({
                      ...prev,
                      grades: { ...prev.grades, [subject]: parseFloat(e.target.value) }
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #004235 0%, #004235 ${(grade/20)*100}%, #e5e7eb ${(grade/20)*100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
              );
            })}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dans quelles villes souhaitez-vous étudier ?</h3>
            <p className="text-gray-600 text-sm">Sélectionnez jusqu'à 3 villes (cliquez pour sélectionner/désélectionner)</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setStudentProfile(prev => {
                      const cities = prev.preferredCities;
                      if (cities.includes(city)) {
                        return { ...prev, preferredCities: cities.filter(c => c !== city) };
                      } else if (cities.length < 3) {
                        return { ...prev, preferredCities: [...cities, city] };
                      }
                      return prev;
                    });
                  }}
                  disabled={!studentProfile.preferredCities.includes(city) && studentProfile.preferredCities.length >= 3}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    studentProfile.preferredCities.includes(city)
                      ? 'border-[#004235] bg-[#004235] text-white'
                      : 'border-gray-200 hover:border-[#cda86b] disabled:opacity-50'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
            
            {studentProfile.preferredCities.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  Villes sélectionnées: {studentProfile.preferredCities.join(', ')}
                </p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quels domaines d'études vous intéressent ?</h3>
            <p className="text-gray-600 text-sm">Sélectionnez tous les domaines qui vous intéressent</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {FIELDS.map((field) => (
                <button
                  key={field}
                  onClick={() => {
                    setStudentProfile(prev => {
                      const fields = prev.preferredFields;
                      if (fields.includes(field)) {
                        return { ...prev, preferredFields: fields.filter(f => f !== field) };
                      } else {
                        return { ...prev, preferredFields: [...fields, field] };
                      }
                    });
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    studentProfile.preferredFields.includes(field)
                      ? 'border-[#004235] bg-[#004235] text-white'
                      : 'border-gray-200 hover:border-[#cda86b]'
                  }`}
                >
                  <div className="font-medium">{field}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quel est votre budget familial annuel ?</h3>
            <p className="text-gray-600 text-sm">Définissez votre fourchette budgétaire pour les frais de scolarité (en MAD)</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Budget minimum</label>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={studentProfile.budgetRange.min}
                  onChange={(e) => setStudentProfile(prev => ({
                    ...prev,
                    budgetRange: { ...prev.budgetRange, min: parseInt(e.target.value) }
                  }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center mt-2 font-bold text-[#004235]">
                  {studentProfile.budgetRange.min.toLocaleString()} MAD
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Budget maximum</label>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={studentProfile.budgetRange.max}
                  onChange={(e) => setStudentProfile(prev => ({
                    ...prev,
                    budgetRange: { ...prev.budgetRange, max: parseInt(e.target.value) }
                  }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center mt-2 font-bold text-[#004235]">
                  {studentProfile.budgetRange.max.toLocaleString()} MAD
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Vos préférences et contraintes</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Secteur préféré</label>
                <div className="space-y-2">
                  {[
                    { value: 'public', label: 'Public uniquement' },
                    { value: 'private', label: 'Privé uniquement' },
                    { value: 'both', label: 'Les deux' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="publicPrivate"
                        value={option.value}
                        checked={studentProfile.constraints.publicPrivate === option.value}
                        onChange={(e) => setStudentProfile(prev => ({
                          ...prev,
                          constraints: { ...prev.constraints, publicPrivate: e.target.value as any }
                        }))}
                        className="mr-2"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mode d'admission préféré</label>
                <div className="space-y-2">
                  {[
                    { value: 'with', label: 'Avec concours' },
                    { value: 'without', label: 'Sans concours' },
                    { value: 'both', label: 'Les deux' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="concoursPreference"
                        value={option.value}
                        checked={studentProfile.constraints.concoursPreference === option.value}
                        onChange={(e) => setStudentProfile(prev => ({
                          ...prev,
                          constraints: { ...prev.constraints, concoursPreference: e.target.value as any }
                        }))}
                        className="mr-2"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={studentProfile.constraints.needsHousing}
                    onChange={(e) => setStudentProfile(prev => ({
                      ...prev,
                      constraints: { ...prev.constraints, needsHousing: e.target.checked }
                    }))}
                    className="mr-2"
                  />
                  J'ai besoin d'un logement étudiant
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={studentProfile.constraints.needsScholarship}
                    onChange={(e) => setStudentProfile(prev => ({
                      ...prev,
                      constraints: { ...prev.constraints, needsScholarship: e.target.checked }
                    }))}
                    className="mr-2"
                  />
                  J'ai besoin d'une bourse d'études
                </label>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#004235] mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Analyse en cours...</h3>
                <p className="text-gray-600">Nous analysons votre profil pour trouver les meilleures correspondances</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-[#004235] mb-2">🎯 Vos Recommandations</h3>
                  <p className="text-gray-600">Voici les {matchResults.length} écoles les plus adaptées à votre profil</p>
                </div>

                <div className="space-y-4">
                  {matchResults.map((result, index) => (
                    <div key={result.school.id} className="border rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <div className="bg-[#004235] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{result.school.name}</h4>
                            <p className="text-sm text-gray-600">{result.school.city} • {result.school.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#cda86b]">{result.score}%</div>
                          <div className="text-xs text-gray-500">Compatibilité</div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{result.school.description}</p>

                      <div className="bg-green-50 p-3 rounded-lg mb-3">
                        <h5 className="font-medium text-green-800 mb-2">Pourquoi cette école vous correspond :</h5>
                        <ul className="space-y-1">
                          {result.reasons.map((reason, idx) => (
                            <li key={idx} className="text-sm text-green-700 flex items-center">
                              <span className="mr-2">✓</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Filière:</span> {result.school.filiere}
                        </div>
                        <div>
                          <span className="font-medium">Seuils d'admission:</span>
                          {typeof result.school.seuilEntree === 'object' && result.school.seuilEntree !== null ? (
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {Object.entries(result.school.seuilEntree).map(([bacType, seuil]) => (
                                <div 
                                  key={bacType} 
                                  className={`px-3 py-2 rounded-lg text-xs border ${
                                    bacType === studentProfile.bacType 
                                      ? 'bg-green-100 border-green-300 text-green-800 font-medium' 
                                      : 'bg-gray-50 border-gray-200 text-gray-600'
                                  }`}
                                >
                                  <div className="font-medium">{bacType}</div>
                                  <div className="text-lg font-bold">{seuil}/20</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="ml-2">{result.school.seuilEntree}/20</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-6 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={exportResults}
                      className="bg-[#004235] text-white hover:bg-[#cda86b] px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      📄 Exporter le rapport
                    </button>
                    <button
                      onClick={handleRestart}
                      className="bg-[#cda86b] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#004235] transition-colors flex items-center justify-center"
                    >
                      🔄 Recommencer l'évaluation
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Le rapport inclut votre profil complet et toutes les recommandations
                  </p>
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#004235] to-[#cda86b] text-white p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">🎯 Assistant d'Orientation</h2>
            <button 
              onClick={onClose} 
              className="text-white hover:text-gray-200 text-2xl font-bold"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-3 mb-2">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>{STEPS[currentStep - 1]?.title}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <p className="text-sm opacity-90 mt-1">{STEPS[currentStep - 1]?.description}</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderStepContent()}
        </div>

        {/* Footer */}
        {currentStep < 7 && (
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed hover:text-[#004235] transition-colors"
            >
              ← Précédent
            </button>
            
            <div className="text-sm text-gray-500">
              Étape {currentStep} sur {STEPS.length - 1}
            </div>
            
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-[#004235] text-white px-6 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#cda86b] transition-colors"
            >
              {currentStep === 6 ? 'Analyser' : 'Suivant →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMatcher;
