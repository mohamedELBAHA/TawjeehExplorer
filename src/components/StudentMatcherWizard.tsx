import React, { useState } from 'react';
import BacStep from './steps/BacStep';
import GradesStep from './steps/GradesStep';
import CitiesStep from './steps/CitiesStep';
import FieldsStep from './steps/FieldsStep';
import BudgetStep from './steps/BudgetStep';
import PreferencesStep from './steps/PreferencesStep';
import ResultsStep from './steps/ResultsStep';

const STEPS = [
  { id: 1, component: BacStep },
  { id: 2, component: GradesStep },
  { id: 3, component: CitiesStep },
  { id: 4, component: FieldsStep },
  { id: 5, component: BudgetStep },
  { id: 6, component: PreferencesStep },
  { id: 7, component: ResultsStep },
];

const StudentMatcherWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [studentProfile, setStudentProfile] = useState({
    bacType: '',
    grades: { math: 12, physics: 12, french: 12, philosophy: 12, speciality: 12 },
    preferredCities: [],
    preferredFields: [],
    budgetRange: { min: 5000, max: 50000 },
    constraints: {
      publicPrivate: 'both',
      concoursPreference: 'both',
      needsHousing: false,
      needsScholarship: false,
    },
  });

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const handlePrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const StepComponent = STEPS.find((step) => step.id === currentStep)?.component;

  return (
    <div>
      {StepComponent && (
        <StepComponent
          studentProfile={studentProfile}
          setStudentProfile={setStudentProfile}
        />
      )}
      <div className="navigation-buttons">
        {currentStep > 1 && <button onClick={handlePrevious}>Previous</button>}
        {currentStep < STEPS.length && <button onClick={handleNext}>Next</button>}
      </div>
    </div>
  );
};

export default StudentMatcherWizard;
