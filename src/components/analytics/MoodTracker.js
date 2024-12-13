// src/components/analytics/MoodTracker.js
'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const MoodTracker = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  const moodToNumber = (mood) => {
    switch (mood) {
      case 'good': return 3;
      case 'neutral': return 2;
      case 'bad': return 1;
      default: return 2;
    }
  };

  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      const processedData = data.data.map(entry => ({
        ...entry,
        moodScore: moodToNumber(entry.mood)
      }));
      setChartData(processedData);
    }
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const moodValue = payload[0].value;
      const moodText = moodValue === 3 ? 'Good' : moodValue === 2 ? 'Neutral' : 'Bad';
      
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-sm font-medium">Mood: {moodText}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-2">Mood Patterns</h3>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              domain={[0, 3]}
              ticks={[1, 2, 3]}
              tickFormatter={(value) => ['Bad', 'Neutral', 'Good'][value-1]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="moodScore"
              stroke="#8b5cf6"
              name="Mood"
              strokeWidth={2}
              dot={{ r: 4 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <p className="text-gray-600">Predominant Mood</p>
          <p className="font-semibold capitalize">
            {data?.predominantMood || 'No data'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-600">Energy Levels</p>
          <p className="font-semibold capitalize">
            {data?.averageEnergy || 'No data'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;