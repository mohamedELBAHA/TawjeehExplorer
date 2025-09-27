import React from 'react';

const PreferencesStep: React.FC<{ studentProfile: any; setStudentProfile: any }> = ({
  studentProfile,
  setStudentProfile,
}) => {
  return (
    <div>
      <h3>Preferences Step</h3>
      <p>Set your preferences here.</p>
    </div>
  );
};

export default PreferencesStep;

export {};
