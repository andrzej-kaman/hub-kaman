import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const ToolCard = ({ tag, title, icon, to }) => {
  return (
    <Link to={to} className="tool-card">
      <div className="tool-card-icon">{icon}</div>
      <div className="tool-card-content">
        <div className="tool-card-tag">{tag}</div>
        <div className="tool-card-title">{title}</div>
      </div>
      <div className="tool-card-arrow">
        <FaArrowRight />
      </div>
    </Link>
  );
};

export default ToolCard;
