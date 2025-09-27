import React from 'react';

const FieldsStep: React.FC<{ studentProfile: any; setStudentProfile: any }> = ({
  studentProfile,
  setStudentProfile,
}) => {
  const FIELDS = [
    'Ingénierie',
    'Sciences de la Santé',
    'Sciences et Technologies',
    'Sciences Humaines et Sociales',
    'Économie et Gestion',
    'Arts et Lettres',
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Quels domaines d'études vous intéressent ?</h3>
      <p className="text-gray-600 text-sm">Sélectionnez tous les domaines qui vous intéressent</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {FIELDS.map((field) => (
          <button
            key={field}
            onClick={() => {
              setStudentProfile((prev: any) => {
                const fields: string[] = prev.preferredFields;
                if (fields.includes(field)) {
                  return { ...prev, preferredFields: fields.filter((f: string) => f !== field) };
                } else {
                  return { ...prev, preferredFields: [...fields, field] };
                }
              });
            }}
            className={`p-3 rounded-lg border-2 transition-all text-center ${
              studentProfile.preferredFields.includes(field)
                ? 'border-[#004235] bg-[#004235] text-white'
                : 'border-gray-200 hover:border-[#cda86b]'
            }`}
          >
            {field}
          </button>
        ))}
      </div>

      {studentProfile.preferredFields.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            Domaines sélectionnés: {studentProfile.preferredFields.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default FieldsStep;

export {};
