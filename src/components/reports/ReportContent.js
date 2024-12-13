// src/components/reports/ReportContent.js
'use client';
import { Heart, Brain, Activity, Sun } from 'lucide-react';
import { ReportChart } from './ReportChart';

const ReportContent = ({ data }) => {
  if (!data) return null;

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatMetric = (value, type) => {
    if (type === 'percentage') return `${value}%`;
    if (type === 'time') return `${value} min`;
    return value;
  };

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Health Score</p>
              <p className={`text-2xl font-bold ${getHealthScoreColor(data.healthScore)}`}>
                {data.healthScore}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Active Habits</p>
              <p className="text-2xl font-bold">{data.overview.activeHabits}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Goals Achieved</p>
              <p className="text-2xl font-bold">{data.overview.completedGoals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Avg. Daily Calories</p>
              <p className="text-2xl font-bold">{data.overview.avgCalories}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sleep & Exercise Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Sleep Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-3">Sleep Patterns</h3>
          {data.sleepAnalysis.data.length > 0 ? (
            <>
              <ReportChart 
                data={data.sleepAnalysis.data} 
                dataKey="value"
                yAxisLabel="Hours"
                strokeColor="#2563eb"
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Average Sleep</p>
                  <p className="text-lg font-semibold">{data.sleepAnalysis.average} hrs</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Consistency</p>
                  <p className="text-lg font-semibold">{data.sleepAnalysis.consistency}%</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 text-center py-10">No sleep data available</p>
          )}
        </div>

        {/* Exercise Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-3">Exercise Impact</h3>
          {data.exerciseAnalysis.data.length > 0 ? (
            <>
              <ReportChart 
                data={data.exerciseAnalysis.data} 
                dataKey="value"
                yAxisLabel="Minutes"
                strokeColor="#16a34a"
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Weekly Average</p>
                  <p className="text-lg font-semibold">{data.exerciseAnalysis.weeklyAverage} min</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Most Active Day</p>
                  <p className="text-lg font-semibold">{data.exerciseAnalysis.mostActiveDay}</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 text-center py-10">No exercise data available</p>
          )}
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-3">Health Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.sleepAnalysis.insights && data.sleepAnalysis.insights.map((insight, index) => (
            <div key={`sleep-${index}`} className="flex items-start gap-2">
              <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-blue-500 mt-2" />
              <span className="text-sm">{insight}</span>
            </div>
          ))}
          {data.exerciseAnalysis.insights && data.exerciseAnalysis.insights.map((insight, index) => (
            <div key={`exercise-${index}`} className="flex items-start gap-2">
              <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-green-500 mt-2" />
              <span className="text-sm">{insight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportContent;