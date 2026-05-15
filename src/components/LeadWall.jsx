import React from 'react';

const LeadWall = ({ onUnlock }) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    onUnlock();
  };

  return (
    <div className="calculator-grid lead-wall-section">
      <div className="lead-wall-text">
        <h2 className="hero-title hero-title--small">Pełen Dostęp do Narzędzi</h2>
        <p className="hero-sub">Wypełnij formularz, aby odblokować wszystkie kalkulatory i zacząć optymalizować swój biznes.</p>
      </div>
      <div className="lead-wall-form">
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Imię" />
          <input type="email" placeholder="Adres e-mail" />
          <input type="text" placeholder="URL sklepu" />
          <button type="submit">Odblokuj dostęp</button>
        </form>
      </div>
    </div>
  );
};

export default LeadWall;
