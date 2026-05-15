import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import GrowthCalculator from './components/GrowthCalculator';
import LeadWall from './components/LeadWall';
import Dashboard from './components/Dashboard';
import PipedriveModal from './components/PipedriveModal';
import BenchmarkCalculator from './components/BenchmarkCalculator';
import MaCalculator from './components/MaCalculator';
import PotentialCalculator from './components/PotentialCalculator';
import SuccessCalculator from './components/SuccessCalculator';

const MainPage = ({ isUnlocked, handleUnlock }) => (
  <>
    <header className="page-header">
      <h1 className="hero-title">{isUnlocked ? "Dziękujemy!" : "Ile tracisz każdego miesiąca?"}</h1>
      <p className="hero-sub">
        {isUnlocked 
          ? "Za zaufanie, mamy nadzieję, że Twój e-commerce zyska dzięki naszym kalkulatorom!"
          : "Przesuń suwaki i natychmiast zobaczysz, jak niewielkie zmiany w ruchu, konwersji i koszyku przekładają się na realny wzrost przychodu."
        }
      </p>
    </header>
    <main>
      {isUnlocked ? (
        <Dashboard />
      ) : (
        <>
          <GrowthCalculator isMinimized={true} />
          <LeadWall onUnlock={handleUnlock} />
        </>
      )}
    </main>
  </>
);

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const isCalculatorPage = location.pathname.startsWith('/kalkulator');

  return (
    <div>
      <nav>
        <img src="/logo_KAMAN_white.png" alt="E-com Profit Hub Logo" className="nav-logo-img" />
        {isCalculatorPage ? (
          <button className="nav-cta" onClick={() => navigate(-1)}>Powrót</button>
        ) : (
          <button className="nav-cta">Darmowy podgląd</button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<MainPage isUnlocked={isUnlocked} handleUnlock={handleUnlock} />} />
        <Route path="/kalkulator/wzrostu" element={<GrowthCalculator />} />
        <Route path="/kalkulator/benchmark" element={<BenchmarkCalculator />} />
        <Route path="/kalkulator/ma" element={<MaCalculator />} />
        <Route path="/kalkulator/potencjalu" element={<PotentialCalculator />} />
        <Route path="/kalkulator/sukces" element={<SuccessCalculator />} />
      </Routes>

      {isUnlocked && (
        <button className="sticky-cta-button" onClick={openModal}>
          Zarezerwuj termin spotkania
        </button>
      )}

      {isModalOpen && <PipedriveModal onClose={closeModal} />}
    </div>
  );
}

export default App;
