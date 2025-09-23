import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Home';
import Platform from './pages/Platform';
import LicenseValidator from './components/LicenseValidator';
import { LicenseProvider } from './contexts/LicenseContext';

function App() {
  return (
    <div className="App">
      <LicenseProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/platform" element={
            <LicenseValidator>
              <Platform />
            </LicenseValidator>
          } />
        </Routes>
      </LicenseProvider>
    </div>
  );
}

export default App;
