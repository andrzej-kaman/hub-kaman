import React, { useState } from 'react';

const INDUSTRIES = [
  { id: 'fashion', name: 'Moda i odzież', cartAbandonmentRate: 0.7853, cartRecoveryMultiplier: 1.15, mobileShare: 0.82, mobileUpliftPotential: 0.60, maMultiplier: 1.25, dynamicPricingMultiplier: 0.9, checkoutSensitivity: 1.0, expressDeliveryMultiplier: 1.2, geoMultiplier: 0.85 },
  { id: 'electronics', name: 'Elektronika', cartAbandonmentRate: 0.80, cartRecoveryMultiplier: 0.85, mobileShare: 0.68, mobileUpliftPotential: 0.40, maMultiplier: 0.85, dynamicPricingMultiplier: 1.4, checkoutSensitivity: 1.2, expressDeliveryMultiplier: 0.8, geoMultiplier: 1.5 },
  { id: 'beauty', name: 'Kosmetyki i uroda', cartAbandonmentRate: 0.70, cartRecoveryMultiplier: 1.2, mobileShare: 0.85, mobileUpliftPotential: 0.65, maMultiplier: 1.4, dynamicPricingMultiplier: 0.7, checkoutSensitivity: 0.85, expressDeliveryMultiplier: 1.3, geoMultiplier: 1.3 },
  { id: 'home', name: 'Dom i ogród', cartAbandonmentRate: 0.7865, cartRecoveryMultiplier: 0.9, mobileShare: 0.71, mobileUpliftPotential: 0.45, maMultiplier: 1.0, dynamicPricingMultiplier: 1.1, checkoutSensitivity: 1.1, expressDeliveryMultiplier: 0.85, geoMultiplier: 1.1 },
  { id: 'sports', name: 'Sport i outdoor', cartAbandonmentRate: 0.75, cartRecoveryMultiplier: 1.0, mobileShare: 0.77, mobileUpliftPotential: 0.50, maMultiplier: 1.1, dynamicPricingMultiplier: 1.0, checkoutSensitivity: 1.0, expressDeliveryMultiplier: 1.1, geoMultiplier: 1.25 },
  { id: 'kids', name: 'Dziecko i zabawki', cartAbandonmentRate: 0.72, cartRecoveryMultiplier: 1.1, mobileShare: 0.80, mobileUpliftPotential: 0.55, maMultiplier: 1.25, dynamicPricingMultiplier: 1.0, checkoutSensitivity: 0.9, expressDeliveryMultiplier: 1.25, geoMultiplier: 1.2 },
  { id: 'food', name: 'Żywność i napoje', cartAbandonmentRate: 0.5003, cartRecoveryMultiplier: 0.7, mobileShare: 0.74, mobileUpliftPotential: 0.45, maMultiplier: 1.5, dynamicPricingMultiplier: 0.6, checkoutSensitivity: 0.7, expressDeliveryMultiplier: 1.5, geoMultiplier: 0.7 },
  { id: 'health', name: 'Zdrowie i suplementy', cartAbandonmentRate: 0.5731, cartRecoveryMultiplier: 1.0, mobileShare: 0.79, mobileUpliftPotential: 0.50, maMultiplier: 1.45, dynamicPricingMultiplier: 0.65, checkoutSensitivity: 0.8, expressDeliveryMultiplier: 1.1, geoMultiplier: 1.4 },
  { id: 'luxury', name: 'Luksus i biżuteria', cartAbandonmentRate: 0.8168, cartRecoveryMultiplier: 0.75, mobileShare: 0.60, mobileUpliftPotential: 0.35, maMultiplier: 0.9, dynamicPricingMultiplier: 0.4, checkoutSensitivity: 1.4, expressDeliveryMultiplier: 0.5, geoMultiplier: 0.4 },
  { id: 'other', name: 'Inna branża', cartAbandonmentRate: 0.7019, cartRecoveryMultiplier: 1.0, mobileShare: 0.76, mobileUpliftPotential: 0.50, maMultiplier: 1.0, dynamicPricingMultiplier: 1.0, checkoutSensitivity: 1.0, expressDeliveryMultiplier: 1.0, geoMultiplier: 1.0 },
];

const BENCHMARKS = {
  cartRecoveryBaseRate: 0.035,
  checkoutUpliftRate: 0.10,
  mobileUpliftRate: 0.12,
  maUpliftRate: 0.12,
  dynamicPricingUpliftRate: 0.08,
  expressDeliveryUpliftRate: 0.05,
  geoUpliftRate: 0.05
};

const DIAGNOSTIC_QUESTIONS = [
  { id: 'cartRecovery', question: 'Czy klienci, którzy nie dokończyli zakupu, dostają automatyczne przypomnienie?', description: 'Chodzi o automatyczny email lub SMS wysyłany np. po 1h od porzucenia koszyka', howToCheck: '💡 Jak sprawdzić: Dodaj produkt do koszyka, nie kupuj i zobacz czy dostaniesz maila w ciągu 24h', icon: '🛒', stat: '70% koszyków jest porzucanych, ale 42% klientów wraca po otrzymaniu przypomnienia', source: 'Baymard Institute, Moosend', label: 'Cart Recovery', effort: 'medium', timeToValue: '2-4 tygodnie' },
  { id: 'fastCheckout', question: 'Czy klient może u Ciebie kupić bez rejestracji, płacąc BLIKiem i wybierając paczkomat?', description: 'Wszystkie 3 rzeczy naraz: zakup jako gość + BLIK + automaty paczkowe', howToCheck: '💡 Jak sprawdzić: Otwórz swój sklep w trybie incognito i spróbuj złożyć zamówienie', icon: '⚡', stat: '45% porzuca przy wymuszaniu rejestracji, 79% gdy brak preferowanej dostawy', source: 'SaleCycle, eGospodarka.pl', label: 'Fast Checkout', effort: 'medium', timeToValue: '4-8 tygodni' },
  { id: 'mobileUX', question: 'Czy zakup przez telefon w Twoim sklepie da się ukończyć w mniej niż 2 minuty?', description: 'Od wejścia na stronę → wybór produktu → koszyk → płatność - bez zoomowania i błędów', howToCheck: '💡 Zrób test: Wejdź na sklep przez telefon, włącz stoper i spróbuj kupić produkt', icon: '📱', stat: 'Mobile ma 40% niższą konwersję niż desktop (2.9% vs 4.8%)', source: 'Landbase, Hotjar', label: 'Mobile UX', effort: 'high', timeToValue: '6-12 tygodni' },
  { id: 'marketingAutomation', question: 'Czy nowy klient automatycznie dostaje od Ciebie serię maili po zapisie/zakupie?', description: 'Np. mail powitalny, potem edukacyjny, potem z rekomendacjami - bez Twojego udziału', howToCheck: '💡 Jak sprawdzić: Zapisz się na newsletter nowym mailem i zobacz co przyjdzie w ciągu tygodnia', icon: '🤖', stat: 'Automated emails generują 320% więcej revenue niż ręczne kampanie', source: 'Firework, Nucleus Research', label: 'Marketing Automation', effort: 'high', timeToValue: '8-16 tygodni' },
  { id: 'dynamicPricing', question: 'Czy używasz narzędzia, które automatycznie monitoruje ceny konkurencji?', description: 'Np. Dealavo, Szpiegomat, Price2Spy - narzędzie które śledzi ceny i alarmuje lub zmienia je', howToCheck: '💡 Prosta zasada: Jeśli ręcznie sprawdzasz ceny konkurencji - odpowiedź brzmi "nie"', icon: '💰', stat: 'Dynamic pricing poprawia marżę średnio o 25% (Harvard Business Review)', source: 'HBR, McKinsey, Dealavo', label: 'Dynamic Pricing', effort: 'medium', timeToValue: '4-8 tygodni' },
  { id: 'expressDelivery', question: 'Czy oferujesz dostawę do paczkomatu następnego dnia roboczego?', description: 'Zamówienie złożone do np. 12:00 dociera do paczkomatu następnego dnia', howToCheck: '💡 Jak sprawdzić: Złóż testowe zamówienie i zobacz jaki jest przewidywany czas dostawy', icon: '📦', stat: '83% wybiera automaty paczkowe, 70% kupowałoby częściej przy szybkiej dostawie', source: 'Gemius, InPost', label: 'Express Delivery', effort: 'low', timeToValue: '2-4 tygodnie' },
  { id: 'geoVisibility', question: 'Czy wpisując w ChatGPT "gdzie kupić [Twój produkt]" pojawia się Twój sklep?', description: 'Coraz więcej ludzi szuka produktów przez AI zamiast Google - to nowy kanał sprzedaży', howToCheck: '💡 Zrób to teraz: Wejdź na chat.openai.com i zapytaj o produkty z Twojej branży w Polsce', icon: '🔍', stat: '38% polskich sklepów nie pojawia się w odpowiedziach AI', source: '1stPlace, Senuto', label: 'GEO/AI Visibility', effort: 'medium', timeToValue: '8-16 tygodni' },
];

const EFFORT_LABELS = { low: 'Niski nakład', medium: 'Średni nakład', high: 'Wysoki nakład' };

const PotentialCalculator = () => {
  const [step, setStep] = useState(1);
  const [annualRevenue, setAnnualRevenue] = useState(1000000);
  const [industry, setIndustry] = useState('fashion');
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [results, setResults] = useState(null);
  const [runningPotential, setRunningPotential] = useState(0);

  const [error, setError] = useState(null);

  const handleNextStep = () => {
    if (step === 1 && annualRevenue < 1000000) {
      setError('Roczna sprzedaż musi wynosić co najmniej 1,000,000 zł.');
      return;
    }
    setError(null);
    setStep(step + 1);
  }

  const handleAnswer = (answer) => {
    const questionId = DIAGNOSTIC_QUESTIONS[currentQuestion].id;
    const newAnswers = { ...answers, [questionId]: answer === 'yes' };
    setAnswers(newAnswers);

    if (answer === 'no') {
      const potential = calculateSinglePotential(questionId, annualRevenue, industry);
      setRunningPotential(runningPotential + potential);
    }

    if (currentQuestion < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
      handleNextStep();
    }
  };

  const calculateResults = (finalAnswers) => {
    const industryData = INDUSTRIES.find(i => i.id === industry) || INDUSTRIES.find(i => i.id === 'other');
    const potentials = [];

    DIAGNOSTIC_QUESTIONS.forEach(q => {
      if (!finalAnswers[q.id]) {
        const potential = calculateSinglePotential(q.id, annualRevenue, industry);
        potentials.push({ ...q, potential });
      }
    });

    potentials.sort((a, b) => b.potential - a.potential);
    setResults(potentials);
  };

  const calculateSinglePotential = (questionId, annualRevenue, industry) => {
    const ind = INDUSTRIES.find(i => i.id === industry) || INDUSTRIES.find(i => i.id === 'other');
    switch (questionId) {
      case 'cartRecovery': return annualRevenue * BENCHMARKS.cartRecoveryBaseRate * ind.cartRecoveryMultiplier;
      case 'fastCheckout': return annualRevenue * BENCHMARKS.checkoutUpliftRate * ind.checkoutSensitivity;
      case 'mobileUX': return annualRevenue * ind.mobileShare * BENCHMARKS.mobileUpliftRate * (ind.mobileUpliftPotential / 0.5);
      case 'marketingAutomation': return annualRevenue * BENCHMARKS.maUpliftRate * ind.maMultiplier;
      case 'dynamicPricing': return annualRevenue * BENCHMARKS.dynamicPricingUpliftRate * ind.dynamicPricingMultiplier;
      case 'expressDelivery': return annualRevenue * BENCHMARKS.expressDeliveryUpliftRate * ind.expressDeliveryMultiplier;
      case 'geoVisibility': return annualRevenue * BENCHMARKS.geoUpliftRate * ind.geoMultiplier;
      default: return 0;
    }
  }

  const ProgressBar = () => {
    let progress = 0;
    if (step === 2) {
      progress = (currentQuestion / (DIAGNOSTIC_QUESTIONS.length - 1)) * 100;
    } else if (step === 3) {
      progress = 100;
    }

    return (
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="bm-widget text-center">
            <ProgressBar />
            <h2 className="mb-4">Podstawowe dane Twojego sklepu</h2>
            <p className="text-muted max-w-lg mx-auto mb-10">Podaj dwie kluczowe informacje, abyśmy mogli oszacować Twój potencjał wzrostu</p>
            <div className="bm-inputs max-w-lg mx-auto">
              <div className="bm-input-group">
                <label>Roczna sprzedaż (PLN)</label>
                <input type="number" value={annualRevenue} onChange={(e) => setAnnualRevenue(parseFloat(e.target.value))} />
                <p className="text-xs text-muted mt-2">Minimum 1,000,000 zł</p>
              </div>
              <div className="bm-input-group">
                <label>Branża sklepu</label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                  {INDUSTRIES.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button onClick={handleNextStep} className="w-full max-w-lg mx-auto">Dalej</button>
          </div>
        );
      case 2:
        const question = DIAGNOSTIC_QUESTIONS[currentQuestion];
        return (
          <div className="bm-widget">
            <ProgressBar />
            <div className="question-card">
              <div className="question-counter">Pytanie {currentQuestion + 1} z {DIAGNOSTIC_QUESTIONS.length}</div>
              <div className="question-icon">{question.icon}</div>
              <h2>{question.question}</h2>
              <p>{question.description}</p>
              <div className="stat-badge">{question.stat}</div>
              <div className="how-to-check">{question.howToCheck}</div>
              {runningPotential > 0 && <div className="running-potential">+{Math.round(runningPotential).toLocaleString('pl-PL')} zł</div>}
            </div>
            <div className="answer-buttons">
              <button onClick={() => handleAnswer('no')}>Nie mam</button>
              <button onClick={() => handleAnswer('unknown')}>Nie wiem</button>
              <button onClick={() => handleAnswer('yes')}>Tak, mam ✓</button>
            </div>
          </div>
        );
      case 3:
        const totalPotential = results ? results.reduce((sum, r) => sum + r.potential, 0) : 0;
        return (
          <div className="bm-widget">
            <ProgressBar />
            <h2 className="text-center mb-10">Twój potencjał wzrostu</h2>
            <div className="total-potential-card">
              <div className="total-potential-value">+{Math.round(totalPotential).toLocaleString('pl-PL')} zł</div>
              <div className="total-potential-label">Całkowity potencjał wzrostu rocznie</div>
            </div>
            <div className="results-panel">
              {results && results.map(r => (
                <div key={r.id} className="result-block-potential">
                  <div className="result-header">
                    <div className="result-icon">{r.icon}</div>
                    <div className="result-title">{r.label}</div>
                    <div className="result-potential">+{Math.round(r.potential).toLocaleString('pl-PL')} zł</div>
                  </div>
                  <div className="result-details">
                    <span>{EFFORT_LABELS[r.effort]}</span>
                    <span>{r.timeToValue}</span>
                  </div>
                  <div className="result-benchmark">{r.benchmark}</div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Error</div>
    }
  }

  return (
    <div className="calculator-page-wrapper">
      {renderStep()}
    </div>
  );
}

export default PotentialCalculator;
