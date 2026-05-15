import React, { useState } from 'react';
import SuccessChart from './SuccessChart';

const SuccessCalculator = () => {
  const [step, setStep] = useState(1);


  // --- DATA DEFINITIONS ---
  const industryData = {
    fashion: { name: 'Moda / Odzież', returnRate: 0.30, conversionRate: 0.022, avgCAC: 85, marketingPercent: 0.15, seasonality: 0.25, avgAOV: 180 },
    beauty: { name: 'Kosmetyki / Beauty', returnRate: 0.06, conversionRate: 0.028, avgCAC: 65, marketingPercent: 0.18, seasonality: 0.15, avgAOV: 120 },
    electronics: { name: 'Elektronika', returnRate: 0.10, conversionRate: 0.018, avgCAC: 150, marketingPercent: 0.12, seasonality: 0.10, avgAOV: 450 },
    home: { name: 'Dom i ogród / Meble', returnRate: 0.12, conversionRate: 0.015, avgCAC: 95, marketingPercent: 0.10, seasonality: 0.20, avgAOV: 350 },
    food: { name: 'Żywność / F&B', returnRate: 0.03, conversionRate: 0.045, avgCAC: 45, marketingPercent: 0.12, seasonality: 0.08, avgAOV: 95 },
    kids: { name: 'Dziecięce / Zabawki', returnRate: 0.15, conversionRate: 0.020, avgCAC: 55, marketingPercent: 0.14, seasonality: 0.30, avgAOV: 140 },
    sport: { name: 'Sport / Outdoor', returnRate: 0.14, conversionRate: 0.018, avgCAC: 70, marketingPercent: 0.13, seasonality: 0.25, avgAOV: 220 },
    jewelry: { name: 'Biżuteria / Luksus', returnRate: 0.08, conversionRate: 0.010, avgCAC: 120, marketingPercent: 0.15, seasonality: 0.20, avgAOV: 450 },
    pets: { name: 'Zwierzęta', returnRate: 0.05, conversionRate: 0.032, avgCAC: 50, marketingPercent: 0.12, seasonality: 0.08, avgAOV: 85 }
  };
  const businessModelData = {
    own: { name: 'Własna marka / Produkcja', marginMultiplier: 1.0, inventoryNeeds: 0.35, minMargin: 50 },
    wholesale: { name: 'Hurt / Dystrybucja', marginMultiplier: 0.75, inventoryNeeds: 0.30, minMargin: 25 },
    dropshipping: { name: 'Dropshipping', marginMultiplier: 0.55, inventoryNeeds: 0.05, minMargin: 15 },
    handmade: { name: 'Rękodzieło / Personalizacja', marginMultiplier: 1.1, inventoryNeeds: 0.15, minMargin: 55 }
  };
  const trafficData = {
    none: { cacMultiplier: 1.5, organicShare: 0.03, label: 'Od zera (CAC +50%)' },
    small: { cacMultiplier: 1.2, organicShare: 0.10, label: 'Mały (CAC +20%)' },
    medium: { cacMultiplier: 1.0, organicShare: 0.18, label: 'Średni (CAC = benchmark)' },
    large: { cacMultiplier: 0.8, organicShare: 0.35, label: 'Duży (CAC -20%)' }
  };
  const stageData = {
    nothing: { setupCost: 15000, timeToLaunch: 3, label: "Zaczynam od zera" },
    idea: { setupCost: 10000, timeToLaunch: 2, label: "Mam pomysł i wiedzę" },
    ready: { setupCost: 5000, timeToLaunch: 1, label: "Gotowy do startu" },
    running: { setupCost: 0, timeToLaunch: 0, label: "Działający sklep" }
  };
  const costLabels = {
      marketing: "Marketing",
      paymentGateways: "Bramki płatnicze",
      shipping: "Wysyłka",
      packaging: "Opakowania",
      returns: "Obsługa zwrotów",
      hosting: "Platforma / Hosting",
      accounting: "Księgowość",
      saas: "Narzędzia SaaS",
      customerService: "Obsługa klienta"
  }

  const [form, setForm] = useState({
    category: 'fashion',
    businessModel: 'own',
    avgPrice: 150,
    margin: 50,
    startBudget: 30000,
    businessStage: 'nothing',
    existingTraffic: 'none'
  });

  const [results, setResults] = useState(null);



  const fmt = (n) => Math.round(n).toLocaleString('pl-PL') + ' zł';
  const fmtPerc = (n) => `${(n * 100).toFixed(1)}%`;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  }

  const calculateSuccess = () => {
    const industry = industryData[form.category];
    const model = businessModelData[form.businessModel];
    const traffic = trafficData[form.existingTraffic];
    const stage = stageData[form.businessStage];
    let recommendations = [];
    let score = 50;

    const requiredMargin = model.minMargin;
    if (form.margin < requiredMargin) {
        score -= 20;
        recommendations.push(`Twoja marża (${form.margin}%) jest niższa niż minimalna dla modelu '${model.name}' (${requiredMargin}%).`);
    } else if (form.margin > requiredMargin + 15) {
        score += 10;
    }

    const estimatedCAC = industry.avgCAC * traffic.cacMultiplier;
    const marketingBudget = form.startBudget * (industry.marketingPercent / (stage.timeToLaunch || 1) );
    const monthlyOrders = Math.max(0, marketingBudget / estimatedCAC);
    const monthlyRevenue = monthlyOrders * form.avgPrice;

    const setupCosts = stage.setupCost;
    const minBudget = setupCosts + (estimatedCAC * 30);
    if (form.startBudget < minBudget) {
        score -= 25;
        recommendations.push(`Twój budżet na start (${fmt(form.startBudget)}) może być niewystarczający. Szacowany minimalny budżet to ~${fmt(minBudget)}.`);
    } else if (form.startBudget > minBudget * 1.5) {
        score += 15;
    }
    
    const monthlyCosts = {
        marketing: marketingBudget,
        paymentGateways: monthlyRevenue * 0.022,
        shipping: monthlyOrders * 14,
        packaging: monthlyOrders * 2.5,
        returns: monthlyRevenue * industry.returnRate * 0.2,
        hosting: 400,
        accounting: 500,
        saas: 300,
        customerService: 500
    };
    const totalMonthlyCosts = Object.values(monthlyCosts).reduce((a, b) => a + b, 0);
    const grossProfit = monthlyRevenue * (form.margin / 100);
    const netProfit = grossProfit - totalMonthlyCosts;
    const runway = netProfit < 0 ? form.startBudget / Math.abs(netProfit) : Infinity;

    score = Math.max(0, Math.min(100, score));

    setResults({ 
        score, 
        recommendations,
        monthlyRevenue, 
        netProfit, 
        runway,
        setupCosts,
        monthlyCosts,
        totalMonthlyCosts,
        grossProfit,
        industry,
        form,
        estimatedCAC,
        marketingBudget
    });
    setStep(2);
  }

  const resetCalculator = () => {
    setStep(1);
    setResults(null);
  }

  const renderForm = () => (
    <div className="calculator-grid" style={{gridTemplateColumns: '1fr'}}>
        <div className="input-panel">
            <div className="section-label">Wprowadź dane</div>
            <div className="bm-inputs">
                 <div className="bm-input-group">
                    <label>Kategoria produktów</label>
                    <select id="category" value={form.category} onChange={handleChange}>
                    {Object.entries(industryData).map(([key, { name }]) => <option key={key} value={key}>{name}</option>)}
                    </select>
                </div>
                <div className="bm-input-group">
                    <label>Model biznesowy</label>
                    <select id="businessModel" value={form.businessModel} onChange={handleChange}>
                    {Object.entries(businessModelData).map(([key, { name }]) => <option key={key} value={key}>{name}</option>)}
                    </select>
                </div>
                <div className="bm-input-group">
                    <label>Średnia cena produktu (PLN)</label>
                    <input type="number" id="avgPrice" value={form.avgPrice} onChange={handleChange} />
                </div>
                <div className="bm-input-group">
                    <label>Marża brutto (%)</label>
                    <input type="number" id="margin" value={form.margin} onChange={handleChange} />
                </div>
                <div className="bm-input-group">
                    <label>Budżet na start (PLN)</label>
                    <input type="number" id="startBudget" value={form.startBudget} onChange={handleChange} />
                </div>
                <div className="bm-input-group">
                    <label>Na jakim etapie jesteś?</label>
                    <select id="businessStage" value={form.businessStage} onChange={handleChange}>
                    {Object.entries(stageData).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
                    </select>
                </div>
                <div className="bm-input-group">
                    <label>Czy masz już ruch / społeczność?</label>
                    <select id="existingTraffic" value={form.existingTraffic} onChange={handleChange}>
                    {Object.entries(trafficData).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
                    </select>
                </div>
            </div>
            <button onClick={calculateSuccess} className="button-cta">Oblicz rentowność</button>
        </div>
    </div>
  );

  const renderResults = () => {
    const scoreColor = results.score >= 80 ? 'var(--lime)' : results.score >= 50 ? 'var(--orange)' : 'var(--red)';
    const scoreTitle = results.score >= 80 ? "Wysoki potencjał" : results.score >= 50 ? "Średni potencjał" : "Niski potencjał";
    
    return (
        <div className="calculator-page-wrapper">
            <div className="results-panel-grid">
                <div className="result-block-large highlight" style={{borderColor: scoreColor}}>
                    <div className="result-tag">Potencjał Sukcesu</div>
                    <div className="result-number-large" style={{color: scoreColor}}>{results.score}/100</div>
                    <div className="result-delta">{scoreTitle}</div>
                </div>
                <div className="result-block-large">
                    <div className="result-tag">Szac. przychód miesięczny</div>
                    <div className="result-number-large">{fmt(results.monthlyRevenue)}</div>
                    <div className="result-delta">Na podstawie Twoich danych</div>
                </div>
                <div className="result-block-large">
                    <div className="result-tag">Szac. zysk netto / mies.</div>
                    <div className="result-number-large" style={{color: results.netProfit > 0 ? 'var(--lime)' : 'var(--red)'}}>{fmt(results.netProfit)}</div>
                     <div className="result-delta">Runway: {isFinite(results.runway) ? `${Math.floor(results.runway)} mies.` : '∞'}</div>
                </div>

                {results.recommendations.length > 0 && (
                    <div className="result-block-full recommendations">
                        <div className="result-tag">Kluczowe rekomendacje</div>
                        <ul>
                            {results.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                        </ul>
                    </div>
                )}

                <div className="result-block-full">
                     <div className="section-label">Podział kosztów</div>
                     <div className="costs-grid">
                        <div className="cost-item"><span>Setup (jednorazowo)</span><span>{fmt(results.setupCosts)}</span></div>
                        <div className="cost-item"><span>Zysk brutto / mies.</span><span>{fmt(results.grossProfit)}</span></div>
                        <div className="cost-item total"><span>Koszty miesięczne</span><span>{fmt(results.totalMonthlyCosts)}</span></div>
                     </div>
                     <div className="costs-multiline-grid">
                        {(() => {
                            const costsCol1 = ['marketing', 'shipping', 'returns', 'accounting', 'customerService'];
                            const costsCol2 = ['paymentGateways', 'packaging', 'hosting', 'saas'];
                            const interleaved = [];
                            const maxRows = Math.max(costsCol1.length, costsCol2.length);
                            for (let i = 0; i < maxRows; i++) {
                                const key1 = costsCol1[i];
                                const key2 = costsCol2[i];
                                if (key1) {
                                    interleaved.push(<span key={`k1-${key1}`}>{costLabels[key1]}</span>, <span key={`v1-${key1}`}>{fmt(results.monthlyCosts[key1])}</span>);
                                } else {
                                    interleaved.push(<span key={`ph1-${i}`}></span>, <span key={`ph-v1-${i}`}></span>);
                                }
                                if (key2) {
                                    interleaved.push(<span key={`k2-${key2}`}>{costLabels[key2]}</span>, <span key={`v2-${key2}`}>{fmt(results.monthlyCosts[key2])}</span>);
                                } else {
                                    interleaved.push(<span key={`ph2-${i}`}></span>, <span key={`ph-v2-${i}`}></span>);
                                }
                            }
                            return interleaved;
                        })()}
                     </div>
                </div>

                <div className="result-block-full">
                    <div className="section-label">Benchmarki dla branży "{results.industry.name}"</div>
                    <div className="costs-grid">
                        <div className="benchmark-item"><span>Średni % zwrotów</span><span>{fmtPerc(results.industry.returnRate)}</span></div>
                        <div className="benchmark-item"><span>Średnia konwersja</span><span>{fmtPerc(results.industry.conversionRate)}</span></div>
                        <div className="benchmark-item"><span>Bazowy CAC</span><span>{fmt(results.industry.avgCAC)}</span></div>
                        <div className="benchmark-item highlight"><span>Twój szac. CAC</span><span>{fmt(results.estimatedCAC)}</span></div>
                        <div className="benchmark-item"><span>Marketing % budżetu</span><span>{fmtPerc(results.industry.marketingPercent)}</span></div>
                        <div className="benchmark-item highlight"><span>Twój marketing %</span><span>{results.totalMonthlyCosts > 0 ? fmtPerc(results.marketingBudget / results.totalMonthlyCosts) : '0.0%'}</span></div>
                    </div>
                </div>
            </div>

            <div className="result-block-full">
                <div className="section-label">Typowa droga e-commerce</div>
                <div className='success-chart-container'>
                    <SuccessChart />
                </div>
            </div>

            <div style={{textAlign: 'center', marginTop: '2rem'}}>
                 <button onClick={resetCalculator} className="button-cta-secondary">Oblicz ponownie</button>
            </div>
        </div>
    );
  }

  return (
    <div className="calculator-page-wrapper">
      {step === 1 ? renderForm() : renderResults()}
    </div>
  );
}

export default SuccessCalculator;