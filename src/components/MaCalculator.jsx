import React, { useState, useEffect } from 'react';
import Chart from './Chart';

const MaCalculator = () => {
  console.log('MaCalculator rendering');
  const [uu, setUu] = useState(10000);
  const [abv, setAbv] = useState(250);
  const [impl, setImpl] = useState(6);
  const [results, setResults] = useState({});

  const zl = (n) => n.toLocaleString('pl-PL') + ' zł';

  const FEATURES = [
    { t:'OPT-in', s:'+1 koszyk/1k UU' },
    { t:'Onboarding journey', s:'+1 koszyk/1k UU' },
    { t:'Odzysk porzuconych koszyków', s:'+4 koszyki/1k UU' },
    { t:'Upsell/Cross-sell/Retencja', s:'+2 koszyki/1k UU' },
    { t:'Product Customer Journey', s:'+4 koszyki/1k UU' },
    { t:'On exit popup', s:'+2 koszyki/1k UU' },
    { t:'Newslettery i kampanie', s:'+8 koszyków/1k UU' },
    { t:'Weblayer ZPD', s:'+4 koszyki/1k UU' },
  ];

  const featureMonthsForImpl = (impl) => {
    switch(impl){
      case 3:  return [3,3,3,3,3,3,3,3];
      case 4:  return [3,3,3,3,4,4,4,4];
      case 5:  return [3,3,3,4,4,5,5,5];
      case 6:  return [3,3,3,4,4,5,5,6];
      case 8:  return [3,3,4,4,5,6,7,8];
      case 10: return [3,4,5,6,7,8,9,10];
      default: return [3,3,3,4,4,5,5,6];
    }
  }

  const PATTERNS_K = {
    3:  [65,65,65,65,65,65,65,65,65,65],
    4:  [30,65,65,65,65,65,65,65,65,65],
    5:  [15,40,65,65,65,65,65,65,65,65],
    6:  [15,30,55,65,65,65,65,65,65,65],
    8:  [10,15,25,45,60,65,65,65,65,65], 
    10: [5,10,20,30,45,55,60,65,65,65],  
  };

  const revenueSeries = (impl, baseMRR) => {
    const months=12;
    const s = new Array(months).fill(0);
    const pattern = PATTERNS_K[impl];
    const scale = baseMRR / 65000;
    if(!pattern){ 
      const nearest = impl<=5 ? 5 : (impl<=6 ? 6 : (impl<=8 ? 8 : 10));
      return revenueSeries(nearest, baseMRR);
    }
    for(let i=0;i<10;i++){ 
      s[i+2] = Math.round(pattern[i] * 1000 * scale);
    }
    return s;
  }

  useEffect(() => {
    try {
      console.log('Calculating results...');
      const baseMRR = Math.round(65000 * (uu/10000) * (abv/250));
      const series = revenueSeries(impl, baseMRR);
      const investment = 50000;
      const maint = 2000;
      const maintMonths = 12 - impl;
      const totalCost = investment + maint*maintMonths;
      const revenueYear = series.reduce((a,b)=>a+b,0);
      const roi = totalCost>0 ? Math.round(((revenueYear - totalCost)/totalCost)*100) : 0;
      let cumProfit = 0, bep = 'Po 12 mies.';
      const costPerImplMonth = investment/impl;
      for(let i=0;i<12;i++){
        const m = i+1;
        const monthlyCost = (m<=impl) ? costPerImplMonth : maint;
        cumProfit += (series[i] - monthlyCost);
        if(cumProfit >= 0){ bep = (m) + ' mies.'; break; }
      }

      setResults({
        investment,
        totalCost,
        revenueYear,
        roi,
        baseMRR,
        bep,
        series
      });
      console.log('Results calculated successfully');
    } catch (error) {
      console.error('Error in MaCalculator useEffect:', error);
    }
  }, [uu, abv, impl]);

  return (
    <div className="calculator-page-wrapper">
      <div className="bm-widget">
        <div className="bm-inputs">
          <div className="bm-input-group">
            <label>Miesięczni użytkownicy (UU)</label>
            <input type="number" value={uu} onChange={(e) => setUu(parseFloat(e.target.value))} />
          </div>
          <div className="bm-input-group">
            <label>Średnia wartość koszyka (PLN)</label>
            <input type="number" value={abv} onChange={(e) => setAbv(parseFloat(e.target.value))} />
          </div>
          <div className="bm-input-group">
            <label>Czas wdrożenia (miesiące)</label>
            <select value={impl} onChange={(e) => setImpl(parseInt(e.target.value, 10))}>
              <option value="3">3 miesiące (intensywne)</option>
              <option value="4">4 miesiące (przyśpieszone)</option>
              <option value="5">5 miesięcy (standardowe)</option>
              <option value="6">6 miesięcy (komfortowe)</option>
              <option value="8">8 miesięcy (rozłożone)</option>
              <option value="10">10 miesięcy (oszczędne)</option>
            </select>
          </div>
        </div>

        {results.series && (
          <div className="results-panel">
            <div className="result-block">
              <div className="result-tag">Inwestycja wdrożeniowa</div>
              <div className="result-number">{zl(results.investment)}</div>
            </div>
            <div className="result-block">
              <div className="result-tag">Całkowity koszt (12 mies.)</div>
              <div className="result-number">{zl(results.totalCost)}</div>
            </div>
            <div className="result-block highlight">
              <div className="result-tag">Przychód roczny</div>
              <div className="result-number">{zl(results.revenueYear)}</div>
            </div>
            <div className="result-block">
              <div className="result-tag">ROI po 12 miesiącach</div>
              <div className="result-number">{results.roi}%</div>
            </div>
            <div className="result-block">
              <div className="result-tag">Dodatkowy przychód/mies.</div>
              <div className="result-number">{zl(results.baseMRR)}</div>
            </div>
            <div className="result-block">
              <div className="result-tag">Punkt BEP</div>
              <div className="result-number">{results.bep}</div>
            </div>

            <div className="result-block">
              <h3>Harmonogram uruchamiania funkcji (wdrożenie: <span className="badge">{impl} mies.</span>)</h3>
              <div className="bm-metrics-grid">
                {FEATURES.map((f, idx) => (
                  <div className="bm-metric-card" key={idx}>
                    <div className="bm-metric-title">Miesiąc {featureMonthsForImpl(impl)[idx]}</div>
                    <div className="bm-metric-value">{f.t}</div>
                    <div className="bm-metric-benchmark">{f.s}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="result-block">
              <h3>Struktura kosztów:</h3>
              <div className="bm-analysis-card">
                <ul>
                  <li><b>Inwestycja wdrożeniowa:</b> {zl(results.investment)} (rozłożone na {impl} miesięcy = {zl(results.investment/impl)}/mies.)</li>
                  <li><b>Maintenance fee:</b> {zl(2000)}/mies. od miesiąca {impl+1} (po zakończeniu wdrożenia)</li>
                  <li><b>Narzędzia MA/CRM:</b> Opłacane bezpośrednio przez klienta</li>
                </ul>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default MaCalculator;
