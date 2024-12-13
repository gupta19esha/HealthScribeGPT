// src/app/goals/page.js
'use client';
import { useState, useEffect } from 'react';
import { Target, Plus, CheckCircle2, Trophy } from 'lucide-react';
import { storageUtils } from '@/utils/storage';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [habits, setHabits] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [newHabit, setNewHabit] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('health');

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    const savedHabits = localStorage.getItem('habits');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedHabits) setHabits(JSON.parse(savedHabits));
  }, []);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

    const newGoalItem = {
      id: Date.now(),
      content: newGoal,
      category: selectedCategory,
      completed: false,
      createdAt: new Date().toISOString(),
      targetDate: null,
    };

    const updatedGoals = [...goals, newGoalItem];
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    setNewGoal('');
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;

    const newHabitItem = {
      id: Date.now(),
      content: newHabit,
      category: selectedCategory,
      streak: 0,
      lastChecked: null,
      createdAt: new Date().toISOString()
    };

    const updatedHabits = [...habits, newHabitItem];
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
    setNewHabit('');
  };

  const toggleGoalCompletion = (goalId) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        return { ...goal, completed: !goal.completed };
      }
      return goal;
    });
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
  };

  const checkHabit = (habitId) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const today = new Date().toDateString();
        const lastChecked = habit.lastChecked ? new Date(habit.lastChecked).toDateString() : null;
        
        if (lastChecked !== today) {
          return {
            ...habit,
            streak: lastChecked === new Date(Date.now() - 86400000).toDateString() 
              ? habit.streak + 1 
              : 1,
            lastChecked: new Date().toISOString()
          };
        }
      }
      return habit;
    });
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
  };
  // src/app/goals/page.js (continued)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goals & Habits
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track your health goals and daily habits
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Goals Section */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Health Goals
            </h2>

            <form onSubmit={handleAddGoal} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Add a new health goal..."
                  className="flex-1 p-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black"
                />
                <button
                  type="submit"
                  disabled={!newGoal.trim()}
                  className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="space-y-2">
              {goals.map(goal => (
                <div
                  key={goal.id}
                  className={`flex items-center gap-2 p-2 rounded-md ${
                    goal.completed ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <button
                    onClick={() => toggleGoalCompletion(goal.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 
                      ${goal.completed 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                      }`}
                  >
                    {goal.completed && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <span className={goal.completed ? 'line-through text-gray-500' : ''}>
                    {goal.content}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Habits Section */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Daily Habits
            </h2>

            <form onSubmit={handleAddHabit} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  placeholder="Add a new daily habit..."
                  className="flex-1 p-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black"
                />
                <button
                  type="submit"
                  disabled={!newHabit.trim()}
                  className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="space-y-2">
              {habits.map(habit => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-2 rounded-md bg-white"
                >
                  <span>{habit.content}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      Streak: {habit.streak} days
                    </span>
                    <button
                      onClick={() => checkHabit(habit.id)}
                      className="px-3 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
                    >
                      Check In
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}