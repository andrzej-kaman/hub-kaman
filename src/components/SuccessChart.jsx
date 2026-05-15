import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';

const SuccessChart = () => {
  const data = [
    { name: 'Start', month: 0, "% celu": 5, label: 'Setup' },
    { month: 1, "% celu": 15 },
    { month: 2, "% celu": 25 },
    { name: 'Nauka', month: 3, "% celu": 40, label: 'Nauka' },
    { month: 4, "% celu": 55 },
    { month: 5, "% celu": 70 },
    { name: 'Optymalizacja', month: 6, "% celu": 85, label: 'Optymalizacja' },
    { month: 7, "% celu": 95 },
    { name: 'Wzrost', month: 9, "% celu": 100, label: 'Wzrost' },
    { month: 10, "% celu": 98 },
    { month: 11, "% celu": 105 },
    { name: 'Cel', month: 12, "% celu": 110, label: 'Cel' },
  ];

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload.label) {
      return (
        <g>
          <Dot {...props} r={6} fill="var(--lime)" stroke="var(--black)" strokeWidth={2} />
          <text x={cx} y={cy - 15} textAnchor="middle" fill="white" fontSize="12px">
            {payload.label}
          </text>
        </g>
      );
    }
    return <Dot {...props} r={2} fill="var(--lime)" />; 
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: -20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey="month"
          label={{ value: 'Miesiąc', position: 'insideBottom', dy: 20, fill: 'var(--muted2)' }}
          tick={{ fill: 'var(--muted)' }} 
          stroke="var(--muted)"
        />
        <YAxis 
          label={{ value: '% Celu Sprzedażowego', angle: -90, position: 'insideLeft', fill: 'var(--muted2)' }}
          tickFormatter={(tick) => `${tick}%`}
          tick={{ fill: 'var(--muted)' }} 
          stroke="var(--muted)"
        />
        <Tooltip 
          contentStyle={{ 
            background: 'var(--dark)', 
            border: '1px solid var(--border)',
            color: 'var(--text)' 
          }}
          formatter={(value, name) => [`${value}%`,'% Celu']}
        />
        <Line 
          type="monotone" 
          dataKey="% celu" 
          stroke="var(--lime)" 
          strokeWidth={2} 
          dot={<CustomDot />}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SuccessChart;
