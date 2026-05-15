import React from 'react';
import ToolCard from './ToolCard';
import { FaRocket, FaBalanceScale, FaCogs, FaChartLine, FaQuestionCircle } from 'react-icons/fa';

const tools = [
  {
    tag: 'Moduł 01',
    title: 'Kalkulator wzrostu e-commerce',
    icon: <FaRocket />,
    to: '/kalkulator/wzrostu'
  },
  {
    tag: 'Moduł 02',
    title: 'Kalkulator benchmark e-commerce',
    icon: <FaBalanceScale />,
    to: '/kalkulator/benchmark'
  },
  {
    tag: 'Moduł 03',
    title: 'Kalkulator Marketing Automation & CRM',
    icon: <FaCogs />,
    to: '/kalkulator/ma'
  },
  {
    tag: 'Moduł 04',
    title: 'Kalkulator potencjału e-commerce',
    icon: <FaChartLine />,
    to: '/kalkulator/potencjalu'
  },
  {
    tag: 'Audyt',
    title: 'Czy Twój e-commerce ma szansę na sukces?',
    icon: <FaQuestionCircle />,
    to: '/kalkulator/sukces'
  },
];

const Dashboard = () => {
  return (
    <div className="dashboard">

      
      <div className="tools-grid">
        {tools.map(tool => (
          <ToolCard key={tool.title} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
