import React, { useState } from 'react';

const benchmarki = {
  moda: { konwersja: { min: 2.2, avg: 2.5, max: 2.8 }, aov: { min: 180, avg: 265, max: 350 } },
  elektronika: { konwersja: { min: 1.4, avg: 1.8, max: 2.1 }, aov: { min: 450, avg: 650, max: 850 } },
  zdrowie: { konwersja: { min: 2.8, avg: 3.1, max: 3.3 }, aov: { min: 150, avg: 185, max: 220 } },
  dom: { konwersja: { min: 2.3, avg: 2.6, max: 2.9 }, aov: { min: 280, avg: 350, max: 420 } },
  zywnosc: { konwersja: { min: 2.9, avg: 3.2, max: 3.5 }, aov: { min: 120, avg: 150, max: 180 } },
  sport: { konwersja: { min: 1.8, avg: 2.1, max: 2.4 }, aov: { min: 250, avg: 315, max: 380 } },
  ksiazki: { konwersja: { min: 1.9, avg: 2.1, max: 2.2 }, aov: { min: 80, avg: 115, max: 150 } },
  bizuteria: { konwersja: { min: 1.0, avg: 1.3, max: 1.5 }, aov: { min: 350, avg: 500, max: 650 } },
  zabawki: { konwersja: { min: 2.5, avg: 2.8, max: 3.1 }, aov: { min: 150, avg: 200, max: 250 } },
  b2b: { konwersja: { min: 2.3, avg: 2.8, max: 3.2 }, aov: { min: 800, avg: 1400, max: 2000 } }
};

const BenchmarkCalculator = () => {
  const [branza, setBranza] = useState('moda');
  const [ruch, setRuch] = useState(10000);
  const [zamowienia, setZamowienia] = useState(250);
  const [wartosc, setWartosc] = useState(265);
  const [results, setResults] = useState(null);
  const [sourcesVisible, setSourcesVisible] = useState(false);

  const getScoreMessage = (punkty) => {
    if (punkty === 10) return "🎉 Świetnie! Działasz powyżej średniej";
    if (punkty === 5) return "💪 Jeden wskaźnik do poprawy";
    return "⚠️ Pilna interwencja potrzebna!";
  };

  const oblicz = () => {
    const bench = benchmarki[branza];
    const konwersja = (zamowienia / ruch) * 100;
    const obecnePrzychody = zamowienia * wartosc * 12;
    const optymalnePrzychody = ruch * (bench.konwersja.avg / 100) * bench.aov.avg * 12;
    const strata = optymalnePrzychody - obecnePrzychody;
    const strataKonwersja = (ruch * (bench.konwersja.avg / 100) - zamowienia) * wartosc * 12;
    const strataAOV = zamowienia * (bench.aov.avg - wartosc) * 12;
    const konwersjaStatus = konwersja >= bench.konwersja.avg ? "dobra" : "slaba";
    const aovStatus = wartosc >= bench.aov.avg ? "dobry" : "slaby";
    let punkty = 0;
    if (konwersjaStatus === "dobra") punkty += 5;
    if (aovStatus === "dobry") punkty += 5;
    const scoreMessage = getScoreMessage(punkty);

    setResults({
      punkty,
      konwersja,
      konwersjaStatus,
      strata,
      strataKonwersja,
      strataAOV,
      aovStatus,
      bench,
      obecnePrzychody,
      scoreMessage
    });
  };

  return (
    <div className="calculator-page-wrapper">
      <div className="bm-widget">
        <div className="bm-inputs">
          <div className="bm-input-group">
            <label>Branża</label>
            <select value={branza} onChange={(e) => setBranza(e.target.value)}>
              {Object.keys(benchmarki).map(b => <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>)}
            </select>
          </div>
          <div className="bm-input-group">
            <label>Ruch miesięczny</label>
            <input type="number" value={ruch} onChange={(e) => setRuch(parseFloat(e.target.value))} placeholder="Ruch miesięczny" />
          </div>
          <div className="bm-input-group">
            <label>Zamówienia miesięcznie</label>
            <input type="number" value={zamowienia} onChange={(e) => setZamowienia(parseFloat(e.target.value))} placeholder="Zamówienia miesięcznie" />
          </div>
          <div className="bm-input-group">
            <label>Średnia wartość zamówienia</label>
            <input type="number" value={wartosc} onChange={(e) => setWartosc(parseFloat(e.target.value))} placeholder="Średnia wartość zamówienia" />
          </div>
        </div>
        <button onClick={oblicz}>Analizuj mój sklep</button>
        {results && (
          <div className="results-panel">
            <div className="result-block">
              <div className="result-tag">Twój wynik</div>
              <div className="result-number">{results.punkty}/10</div>
              <div className="result-delta">{results.scoreMessage}</div>
            </div>

            <div className="result-block">
              <div className="result-tag">Metryki vs branża</div>
              <div className="bm-metrics-grid">
                <div className="bm-metric-card">
                  <div className="bm-metric-title">Konwersja</div>
                  <div className={`bm-metric-value ${results.konwersjaStatus === 'dobra' ? 'bm-status-good' : 'bm-status-bad'}`}>{results.konwersja.toFixed(2)}%</div>
                  <div className="bm-metric-benchmark">Branża: {results.bench.konwersja.min.toFixed(1)}% - {results.bench.konwersja.max.toFixed(1)}%</div>
                </div>
                <div className="bm-metric-card">
                  <div className="bm-metric-title">Średnia wartość zamówienia</div>
                  <div className={`bm-metric-value ${results.aovStatus === 'dobry' ? 'bm-status-good' : 'bm-status-bad'}`}>{Math.round(wartosc)} zł</div>
                  <div className="bm-metric-benchmark">Branża: {results.bench.aov.min} - {results.bench.aov.max} zł</div>
                </div>
              </div>
            </div>

            <div className={`result-block highlight ${results.strata <= 0 ? 'positive' : ''}`}>
              <div className="result-tag">{results.strata > 0 ? 'Tracisz rocznie' : 'Możliwości wzrostu'}</div>
              <div className="result-number">{results.strata > 0 ? `${Math.round(results.strata).toLocaleString('pl-PL')} zł` : `+${Math.round(results.obecnePrzychody * 0.5).toLocaleString('pl-PL')} zł`}</div>
              <div className="result-delta">{results.strata > 0 ? 'To pieniądze które możesz odzyskać!' : 'Przy zwiększeniu skali o 50%'}</div>
            </div>

            <div className="result-block">
              <div id="bm-analiza">
                <div className="bm-analysis-card">
                  <h3>📈 Konwersja: {results.konwersja.toFixed(2)}%</h3>
                  {results.konwersjaStatus === 'slaba' ? (
                    <div className="bm-recommendation bm-rec-bad">
                      <p><strong>❌ Problem:</strong> Konwersja poniżej średniej ({results.bench.konwersja.avg.toFixed(1)}%)</p>
                      {results.strataKonwersja > 0 && <p><strong>Strata:</strong> {Math.round(results.strataKonwersja).toLocaleString('pl-PL')} zł rocznie</p>}
                      <p><strong>Możliwe przyczyny:</strong></p>
                      <ul><li>Marketing przyciąga złych klientów (łowców promocji)</li><li>Brak zaufania do marki</li><li>Skomplikowany proces zakupu</li></ul>
                      <p><strong>Możliwe rozwiązania:</strong></p>
                      <ol><li>Zmień targetowanie na klientów wartościowych</li><li>Dodaj opinie i certyfikaty</li><li>Uprość checkout do 3 kroków</li></ol>
                    </div>
                  ) : (
                    <div className="bm-recommendation bm-rec-good">
                      <p><strong>✅ Świetnie!</strong> Konwersja powyżej średniej branżowej</p>
                      <p>Przyciągasz właściwy ruch i dobrze go konwertujesz.</p>
                    </div>
                  )}
                </div>
                <div className="bm-analysis-card">
                  <h3>💰 Wartość koszyka: {Math.round(wartosc)} zł</h3>
                  {results.aovStatus === 'slaby' ? (
                    <div className="bm-recommendation bm-rec-bad">
                      <p><strong>❌ Problem:</strong> AOV poniżej średniej ({results.bench.aov.avg} zł)</p>
                      {results.strataAOV > 0 && <p><strong>Strata:</strong> {Math.round(results.strataAOV).toLocaleString('pl-PL')} zł rocznie</p>}
                      <p><strong>Możliwe przyczyny:</strong></p>
                      <ul><li>Brak zestawów i bundli</li><li>Wąski asortyment</li><li>Tylko tanie produkty</li></ul>
                      <p><strong>Możliwe rozwiązania:</strong></p>
                      <ol><li>Stwórz zestawy z rabatem 10–15%</li><li>Darmowa dostawa od kwoty 50% wyżej niż AOV</li><li>Dodaj produkty premium</li></ol>
                    </div>
                  ) : (
                    <div className="bm-recommendation bm-rec-good">
                      <p><strong>✅ Doskonale!</strong> AOV powyżej średniej branżowej</p>
                      <p>Klienci kupują dużo – dobra strategia produktowa.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="result-block">
              <h2 className="bm-sources-header" onClick={() => setSourcesVisible(!sourcesVisible)}>
                📚 Źródła benchmarków {sourcesVisible ? '▲' : '▼'}
              </h2>
              {sourcesVisible && (
                <div id="bm-sources" className="bm-sources-content">
                  <p>Data benchmarkowe pochodzą z następujących źródeł:</p>
                  <ul>
                    <li><strong>Baymard Institute (2024)</strong><br />
                      <a href="https://baymard.com/lists/cart-abandonment-rate" target="_blank" rel="noopener">E-commerce Checkout Benchmark & UX Report</a><br />
                      <span>Analiza 71+ miliardów sesji e-commerce</span>
                    </li>
                    <li><strong>Statista E-commerce Report 2024</strong><br />
                      <a href="https://www.statista.com/topics/871/online-shopping/" target="_blank" rel="noopener">Global E-commerce Statistics & Trends</a><br />
                      <span>Dane z ponad 150 rynków globalnych</span>
                    </li>
                    <li><strong>Google Retail Insights</strong><br />
                      <a href="https://www.thinkwithgoogle.com/intl/en-cee/consumer-insights/consumer-trends/" target="_blank" rel="noopener">Think with Google - Retail Industry Benchmarks</a><br />
                      <span>Dane z Google Analytics dla tysięcy sklepów</span>
                    </li>
                    <li><strong>Monetate E-commerce Quarterly Report</strong><br />
                      <a href="https://monetate.com/resources/eq-reports/" target="_blank" rel="noopener">Q4 2023 E-commerce Benchmarks</a><br />
                      <span>Analiza 7+ miliardów doświadczeń zakupowych</span>
                    </li>
                    <li><strong>Adobe Digital Economy Index</strong><br />
                      <a href="https://business.adobe.com/resources/digital-economy-index.html" target="_blank" rel="noopener">E-commerce Trends & Benchmarks 2024</a><br />
                      <span>Dane z Adobe Analytics obejmujące 1 bilion wizyt</span>
                    </li>
                    <li><strong>IRP Commerce Benchmark Study</strong><br />
                      <a href="https://irpcommerce.com/en/gb/benchmark-report-2023.aspx" target="_blank" rel="noopener">European E-commerce KPI Report 2023</a><br />
                      <span>Benchmarki dla rynku europejskiego</span>
                    </li>
                  </ul>
                  <p className="bm-note">
                    <strong>Uwaga:</strong> Przedstawione wartości są uśrednione i dostosowane do polskiego rynku e-commerce.
                    Rzeczywiste wyniki mogą się różnić w zależności od specyfiki biznesu, sezonu,
                    grupy docelowej i wielu innych czynników.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BenchmarkCalculator;
