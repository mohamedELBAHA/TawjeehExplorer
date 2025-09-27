import React from 'react';

const ResultsStep: React.FC<{ studentProfile: any; setStudentProfile: any }> = ({
  studentProfile,
  setStudentProfile,
}) => {
  return (
    <div>
      <h3>Results Step</h3>
      <p>Display the results here.</p>
    </div>
  );
};

export default ResultsStep;

export {};
