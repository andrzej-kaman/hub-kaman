import React, { useState, useEffect } from 'react';
import Chart from './Chart';

const Slider = ({ label, value, min, max, step, onChange, format, isPercentage }) => {
  const [isActive, setIsActive] = useState(false);
  const percentage = ((value - min) / (max - min)) * 100;

  const formattedValue = () => {
    if (isPercentage) return `+${Math.round(value)}%`;
    return format(value);
  };

  return (
    <div className="input-group">
      <div className="input-row">
        <span className="input-label">{label}</span>
        <span className={`input-value ${isActive ? 'active' : ''}`}>{formattedValue()}</span>
      </div>
      <div className="slider-track">
        <div className="slider-fill" style={{ width: `${percentage}%` }}></div>
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={value} 
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onMouseDown={() => setIsActive(true)}
          onMouseUp={() => setIsActive(false)}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
        />
      </div>
    </div>
  );
};

const GrowthCalculator = ({ isMinimized = false }) => {
  const [traffic, setTraffic] = useState(10000);
  const [conv, setConv] = useState(2);
  const [aov, setAov] = useState(150);
  const [gtraffic, setGtraffic] = useState(10);
  const [gconv, setGconv] = useState(10);
  const [gaov, setGaov] = useState(10);
  
  const [results, setResults] = useState({});

  const fmt = (n) => Math.round(n).toLocaleString('pl-PL') + ' zł';
  const fmtNum = (n) => Math.round(n).toLocaleString('pl-PL');

  useEffect(() => {
    const current = traffic * (conv / 100) * aov;
    const newTraffic = traffic * (1 + gtraffic / 100);
    const newConv = conv * (1 + gconv / 100);
    const newAov = aov * (1 + gaov / 100);
    const projected = newTraffic * (newConv / 100) * newAov;
    const gain = projected - current;
    const annual = gain * 12;
    const pct = current > 0 ? ((projected - current) / current * 100) : 0;
    setResults({ current, projected, gain, annual, pct });
  }, [traffic, conv, aov, gtraffic, gconv, gaov]);

  if (isMinimized) {
    return (
      <div className="calculator-grid" style={{gridTemplateColumns: '1fr'}}>
        <div className="input-panel">
          <div className="section-label">Dane obecne</div>
          <Slider label="Ruch miesięczny" value={traffic} min={1000} max={100000} step={500} onChange={setTraffic} format={fmtNum} />
          <Slider label="Konwersja" value={conv} min={0.5} max={10} step={0.1} onChange={setConv} format={(v) => `${v.toFixed(1)}%`} />
          <Slider label="Średni koszyk" value={aov} min={20} max={2000} step={10} onChange={setAov} format={fmt} />
        </div>
        <div className="results-panel">
            <div className="result-block highlight">
              <div className="result-tag">Dodatkowy zysk rocznie</div>
              <div className="result-number">{fmt(results.annual)}</div>
              <div className="result-delta">miesięcznie: <span className="pos">+{fmt(results.gain)}</span></div>
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className="calculator-page-wrapper">
      <div className="calculator-grid">
        <div className="input-panel">
          <div className="section-label">Dane obecne</div>
          <Slider label="Ruch miesięczny" value={traffic} min={1000} max={100000} step={500} onChange={setTraffic} format={fmtNum} />
          <Slider label="Konwersja" value={conv} min={0.5} max={10} step={0.1} onChange={setConv} format={(v) => `${v.toFixed(1)}%`} />
          <Slider label="Średni koszyk" value={aov} min={20} max={2000} step={10} onChange={setAov} format={fmt} />

          <div className="divider"></div>

          <div className="section-label">Oczekiwana poprawa</div>
          <Slider label="Wzrost ruchu" value={gtraffic} min={0} max={100} step={1} onChange={setGtraffic} isPercentage />
          <Slider label="Poprawa konwersji" value={gconv} min={0} max={100} step={1} onChange={setGconv} isPercentage />
          <Slider label="Wzrost koszyka" value={gaov} min={0} max={100} step={1} onChange={setGaov} isPercentage />
        </div>

        <div className="results-panel">
          <div className="result-block">
            <div className="result-tag">Obecna sprzedaż / mies.</div>
            <div className="result-number">{fmt(results.current)}</div>
            <div className="result-delta">punkt wyjścia</div>
          </div>
          <div className="result-block">
            <div className="result-tag">Nowa prognozowana sprzedaż</div>
            <div className="result-number" style={{ color: 'var(--lime)' }}>{fmt(results.projected)}</div>
            <div className="result-delta">wzrost: <span className="pos">+{Math.round(results.pct)}%</span></div>
          </div>
          <div className="result-block highlight">
            <div className="result-tag">Dodatkowy zysk rocznie</div>
            <div className="result-number">{fmt(results.annual)}</div>
            <div className="result-delta">miesięcznie: <span className="pos">+{fmt(results.gain)}</span></div>
          </div>
        </div>
      </div>
      {results.current && <Chart results={results} />}
    </div>
  );
};

export default GrowthCalculator;
