import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Home';
import Platform from './pages/Platform';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/platform" element={<Platform />} />
      </Routes>
    </div>
  );
}

export default App;
