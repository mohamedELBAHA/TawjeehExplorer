import React from 'react';

const CitiesStep: React.FC<{ studentProfile: any; setStudentProfile: any }> = ({
  studentProfile,
  setStudentProfile,
}) => {
  const CITIES = [
    'Rabat',
    'Casablanca',
    'Fès',
    'Marrakech',
    'Agadir',
    'Tanger',
    'Oujda',
    'Kénitra',
    'Safi',
    'Tétouan',
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dans quelles villes souhaitez-vous étudier ?</h3>
      <p className="text-gray-600 text-sm">Sélectionnez jusqu'à 3 villes (cliquez pour sélectionner/désélectionner)</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {CITIES.map((city) => (
          <button
            key={city}
            onClick={() => {
              setStudentProfile((prev: any) => {
                const cities: string[] = prev.preferredCities;
                if (cities.includes(city)) {
                  return { ...prev, preferredCities: cities.filter((c: string) => c !== city) };
                } else if (cities.length < 3) {
                  return { ...prev, preferredCities: [...cities, city] };
                }
                return prev;
              });
            }}
            disabled={
              !studentProfile.preferredCities.includes(city) &&
              studentProfile.preferredCities.length >= 3
            }
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
};

export default CitiesStep;

export {};
