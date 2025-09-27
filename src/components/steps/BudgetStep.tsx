import React from 'react';

const BudgetStep: React.FC<{ studentProfile: any; setStudentProfile: any }> = ({
  studentProfile,
  setStudentProfile,
}) => {
  return (
    <div>
      <h3>Budget Step</h3>
      <p>Define your budget range here.</p>
    </div>
  );
};

export default BudgetStep;
export {};
