import React from 'react';

const Chart = ({ results }) => {
  const months = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
  const maxVal = Math.max(results.current, results.projected) * 1.15;

  return (
    <section className="chart-section">
      <div className="chart-header">
        <span className="chart-title">Wizualizacja zmiany sprzedaży</span>
        <div className="chart-legend">
          <span><span className="legend-dot" style={{background:'rgba(201,255,0,0.35)'}}></span>Obecna</span>
          <span><span className="legend-dot" style={{background:'var(--lime)'}}></span>Prognoza</span>
        </div>
      </div>
      <div className="chart-container">
        <div className="chart-bars">
          {months.map((m, i) => {
            const growth = 1 + (i / 11) * (results.projected / results.current - 1);
            const projected = results.current * growth;
            const hCurrent = (results.current / maxVal) * 100;
            const hProjected = (projected / maxVal) * 100;

            return (
              <div key={m} className="chart-col">
                <div className="chart-bar-wrap">
                  <div className="chart-bar current" style={{height:`${hCurrent}%`}}>
                    <div className="chart-bar-tooltip">{Math.round(results.current).toLocaleString('pl-PL')} zł</div>
                  </div>
                  <div className="chart-bar projected" style={{height:`${hProjected}%`}}>
                    <div className="chart-bar-tooltip">{Math.round(projected).toLocaleString('pl-PL')} zł</div>
                  </div>
                </div>
                <div className="chart-col-label">{m}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
};

export default Chart;
