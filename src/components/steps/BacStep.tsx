import React from 'react';

const BacStep: React.FC<{ studentProfile: any; setStudentProfile: any }> = ({
  studentProfile,
  setStudentProfile,
}) => {
  const BAC_TYPES = [
    "Sciences Mathématiques A",
    "Sciences Mathématiques B",
    "Sciences Physiques",
    "Sciences de la Vie et de la Terre",
    "Sciences Économiques",
    "Bac Technique",
    "Bac Professionnel",
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Quel est votre type de baccalauréat ?</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {BAC_TYPES.map((type) => (
          <button
            key={type}
            onClick={() =>
              setStudentProfile((prev: any) => ({ ...prev, bacType: type }))
            }
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
};

export default BacStep;

export {};
