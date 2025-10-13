import React from 'react';

const FullPageLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500 mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading...</h2>
        <p className="text-gray-500">Please wait while we prepare the application.</p>
      </div>
    </div>
  );
};

export default FullPageLoader;
