// src/app/reports/page.js
'use client';
import { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, Calendar, Brain, Heart } from 'lucide-react';
import ReportContent from '@/components/reports/ReportContent';

// Analysis helper functions
const calculateConsistencyScore = (data) => {
  if (!data || data.length < 2) return 0;
  let score = 100;
  const daysInRange = data.length;
  const variance = data.reduce((acc, curr, i) => {
    if (i === 0) return acc;
    const diff = Math.abs(curr.value - data[i - 1].value);
    return acc + (diff * 10); // Penalize big variations more heavily
  }, 0) / daysInRange;
  
  return Math.max(0, Math.min(100, Math.round(100 - variance)));
};

const analyzeSleepPatterns = (entries) => {
  if (!entries || entries.length === 0) return {
    data: [],
    average: "0.0",
    consistency: 0,
    insights: []
  };

  const sleepData = entries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString(),
    value: entry.metrics?.sleep || 0
  }));

  const avgSleep = sleepData.reduce((acc, curr) => acc + curr.value, 0) / sleepData.length;
  const consistencyScore = calculateConsistencyScore(sleepData);
  const insights = [];

  // Generate sleep insights
  if (avgSleep < 7) {
    insights.push("You're getting less than recommended sleep (7-9 hours)");
  } else if (avgSleep > 9) {
    insights.push("You might be oversleeping, consider adjusting your sleep schedule");
  } else {
    insights.push("Your sleep duration is within the recommended range");
  }

  if (consistencyScore >= 90) {
    insights.push("Excellent sleep schedule consistency");
  } else if (consistencyScore >= 70) {
    insights.push("Good sleep consistency with minor variations");
  } else {
    insights.push("Consider maintaining a more consistent sleep schedule");
  }

  return {
    data: sleepData,
    average: avgSleep.toFixed(1),
    consistency: consistencyScore,
    insights
  };
};

const analyzeExercisePatterns = (entries) => {
  if (!entries || entries.length === 0) return {
    data: [],
    weeklyAverage: 0,
    mostActiveDay: "N/A",
    consistency: 0,
    insights: []
  };

  const exerciseData = entries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString(),
    value: entry.metrics?.exercise || 0
  }));

  const totalMinutes = exerciseData.reduce((acc, curr) => acc + curr.value, 0);
  const avgMinutes = totalMinutes / exerciseData.length;
  const weeklyAverage = Math.round(avgMinutes * 7);
  const consistencyScore = calculateConsistencyScore(exerciseData);
  
  const mostActive = exerciseData.reduce((max, curr) => 
    curr.value > max.value ? curr : max, exerciseData[0]);

  const insights = [];

  if (weeklyAverage < 150) {
    insights.push("Aim for at least 150 minutes of exercise per week");
  } else {
    insights.push("Meeting weekly exercise recommendations");
  }

  if (consistencyScore >= 80) {
    insights.push("Maintaining a consistent exercise routine");
  } else {
    insights.push("Try to establish a more regular exercise schedule");
  }

  return {
    data: exerciseData,
    weeklyAverage,
    mostActiveDay: mostActive.date,
    consistency: consistencyScore,
    insights
  };
};
export default function Reports() {
  const [journalEntries, setJournalEntries] = useState([]);
  const [goals, setGoals] = useState([]);
  const [habits, setHabits] = useState([]);
  const [meals, setMeals] = useState([]);
  const [reportPeriod, setReportPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    loadData();
  }, [reportPeriod]);

  const loadData = () => {
    try {
      const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
      const userGoals = JSON.parse(localStorage.getItem('goals') || '[]');
      const userHabits = JSON.parse(localStorage.getItem('habits') || '[]');
      const userMeals = JSON.parse(localStorage.getItem('meals') || '[]');

      setJournalEntries(entries);
      setGoals(userGoals);
      setHabits(userHabits);
      setMeals(userMeals);
      
      if (entries.length > 0) {
        generateReport(entries, userGoals, userHabits, userMeals);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const generateReport = (entries, goals, habits, meals) => {
    setLoading(true);
    
    const endDate = new Date();
    const startDate = new Date();
    if (reportPeriod === 'week') startDate.setDate(endDate.getDate() - 7);
    if (reportPeriod === 'month') startDate.setDate(endDate.getDate() - 30);
    if (reportPeriod === 'quarter') startDate.setDate(endDate.getDate() - 90);

    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });

    const healthScore = calculateHealthScore(filteredEntries, habits);
    const sleepAnalysis = analyzeSleepPatterns(filteredEntries);
    const exerciseAnalysis = analyzeExercisePatterns(filteredEntries);

    const analysis = {
      overview: {
        totalEntries: filteredEntries.length,
        completedGoals: goals.filter(g => g.completed).length,
        activeHabits: habits.filter(h => h.streak > 0).length,
        avgCalories: calculateAverageCalories(meals, startDate, endDate)
      },
      healthScore,
      sleepAnalysis,
      exerciseAnalysis
    };

    setReportData(analysis);
    setLoading(false);
  };

  const calculateHealthScore = (entries, habits) => {
    if (!entries || entries.length === 0) return 0;

    const weights = {
      sleep: 0.3,
      exercise: 0.3,
      mood: 0.2,
      habits: 0.2
    };

    // Calculate sleep score
    const avgSleep = entries.reduce((acc, entry) => acc + (entry.metrics?.sleep || 0), 0) / entries.length;
    const sleepScore = avgSleep >= 7 && avgSleep <= 9 ? 100 : (100 - Math.abs(avgSleep - 8) * 10);

    // Calculate exercise score
    const avgExercise = entries.reduce((acc, entry) => acc + (entry.metrics?.exercise || 0), 0) / entries.length;
    const exerciseScore = Math.min(100, (avgExercise / 30) * 100);

    // Calculate mood score
    const moodScore = entries.reduce((acc, entry) => {
      const moodValues = { good: 100, neutral: 50, bad: 0 };
      return acc + (moodValues[entry.metrics?.mood] || 50);
    }, 0) / entries.length;

    // Calculate habits score
    const habitScore = habits.length > 0
      ? habits.reduce((acc, habit) => acc + (habit.streak || 0), 0) / habits.length * 10
      : 50;

    const finalScore = (
      sleepScore * weights.sleep +
      exerciseScore * weights.exercise +
      moodScore * weights.mood +
      habitScore * weights.habits
    );

    return Math.round(Math.max(0, Math.min(100, finalScore)));
  };

  const calculateAverageCalories = (meals, startDate, endDate) => {
    const filteredMeals = meals.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate >= startDate && mealDate <= endDate;
    });

    if (filteredMeals.length === 0) return 0;
    
    const totalCalories = filteredMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    return Math.round(totalCalories / filteredMeals.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Health Report
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Comprehensive analysis of your health journey
            </p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              className="text-sm border-gray-200 rounded-md shadow-sm focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
            </select>

            <button
              onClick={() => window.print()}
              disabled={!reportData}
              className="px-4 py-2 bg-black text-white rounded-md text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div>
          </div>
        ) : !reportData ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No data available for the selected period.</p>
          </div>
        ) : (
          <ReportContent data={reportData} />
        )}
      </div>
    </div>
  );
}