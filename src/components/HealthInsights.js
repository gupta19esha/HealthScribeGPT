// src/components/HealthInsights.js
'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const HealthInsights = ({ journalData }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (journalData && journalData.length > 0) {
      const processedData = journalData
        .slice(-7) // Get last 7 entries
        .map(entry => ({
          date: new Date(entry.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          sleep: Number(entry.metrics.sleep) || 0,
          exercise: Number(entry.metrics.exercise) || 0
        }))
        .reverse();
      setChartData(processedData);
    }
  }, [journalData]);

  return (
    <div className="w-full h-[180px]"> {/* Reduced height for more compact look */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={chartData}
          margin={{ top: 5, right: 25, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11 }}
            tickMargin={5}
          />
          <YAxis 
            yAxisId="sleep"
            tick={{ fontSize: 11 }}
            tickMargin={5}
            domain={[0, 12]}
            label={{ 
              value: 'Sleep (hrs)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: 11, fill: '#2563eb' },
              offset: -15
            }}
          />
          <YAxis 
            yAxisId="exercise"
            orientation="right"
            tick={{ fontSize: 11 }}
            tickMargin={5}
            domain={[0, 120]}
            label={{ 
              value: 'Exercise (min)', 
              angle: 90, 
              position: 'insideRight',
              style: { fontSize: 11, fill: '#dc2626' },
              offset: -20
            }}
          />
          <Tooltip 
            contentStyle={{ 
              fontSize: 11, 
              padding: '8px',
              border: 'none',
              borderRadius: '4px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}
          />
          <Legend 
            align="center"
            verticalAlign="top"
            height={20}
            iconSize={8}
            wrapperStyle={{ fontSize: 11 }}
          />
          <Line
            yAxisId="sleep"
            type="monotone"
            dataKey="sleep"
            stroke="#2563eb"
            name="Sleep"
            strokeWidth={2}
            dot={{ r: 2, strokeWidth: 2 }}
            activeDot={{ r: 3, strokeWidth: 2 }}
          />
          <Line
            yAxisId="exercise"
            type="monotone"
            dataKey="exercise"
            stroke="#dc2626"
            name="Exercise"
            strokeWidth={2}
            dot={{ r: 2, strokeWidth: 2 }}
            activeDot={{ r: 3, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HealthInsights;