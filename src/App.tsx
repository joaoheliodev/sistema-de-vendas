import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { IntroLoader } from './components/IntroLoader';
import { Home } from './pages/Home';
import { Checkout } from './pages/Checkout';

function App() {
  const [showLoader, setShowLoader] = useState(() => {
    // Only show loader once per session
    if (sessionStorage.getItem('cyberseg_loaded')) return false;
    return true;
  });

  const handleLoaderComplete = useCallback(() => {
    sessionStorage.setItem('cyberseg_loaded', 'true');
    setShowLoader(false);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showLoader && <IntroLoader onComplete={handleLoaderComplete} />}
      </AnimatePresence>

      {!showLoader && (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
