import React from 'react';

const GradesStep: React.FC<{ studentProfile: any; setStudentProfile: any }> = ({
  studentProfile,
  setStudentProfile,
}) => {
  const SUBJECT_LABELS: { [key: string]: string } = {
    math: 'Mathématiques',
    physics: 'Physique-Chimie',
    french: 'Français',
    philosophy: 'Philosophie',
    speciality: 'Matière de spécialité',
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Quelles sont vos moyennes par matière ?</h3>
      <p className="text-gray-600 text-sm">Utilisez les curseurs pour indiquer vos moyennes (sur 20)</p>

      {Object.entries(studentProfile.grades).map(([subject, grade]) => (
        <div key={subject} className="space-y-2">
          <div className="flex justify-between">
            <label className="font-medium">{SUBJECT_LABELS[subject]}</label>
            <span className="font-bold text-[#004235]">{grade as number}/20</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={grade as number}
            onChange={(e) =>
              setStudentProfile((prev: any) => ({
                ...prev,
                grades: { ...prev.grades, [subject]: parseFloat(e.target.value) },
              }))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #004235 0%, #004235 ${((grade as number) / 20) * 100}%, #e5e7eb ${((grade as number) / 20) * 100}%, #e5e7eb 100%)`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default GradesStep;

export {};
