import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { GPSProvider } from '@/contexts/GPSContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

const App = () => {
  return (
    <LanguageProvider>
      <GPSProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </GPSProvider>
    </LanguageProvider>
  );
};

export default App;
