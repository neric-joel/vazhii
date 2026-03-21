import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import type { AssessmentResult } from './lib/types';
import { DEMO_RESULT } from './lib/demo-data';
import Home from './pages/Home';
import Intake from './pages/Intake';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const handleDemo = () => {
    setResult(DEMO_RESULT);
    setIsDemo(true);
  };

  const handleComplete = (r: AssessmentResult) => {
    setResult(r);
    setIsDemo(false);
  };

  const handleStartOver = () => {
    setResult(null);
    setIsDemo(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home onDemo={handleDemo} />} />
        <Route path="/intake" element={<Intake onComplete={handleComplete} />} />
        <Route
          path="/dashboard"
          element={
            result
              ? <Dashboard result={result} isDemo={isDemo} onStartOver={handleStartOver} />
              : <Navigate to="/intake" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
