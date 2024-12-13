// src/app/nutrition/page.js
'use client';
import { useState, useEffect } from 'react';
import { Apple, Plus, Search, ChevronDown, Calendar } from 'lucide-react';
import { storageUtils } from '@/utils/storage';

export default function Nutrition() {
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({
    type: 'breakfast',
    description: '',
    calories: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [waterIntake, setWaterIntake] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddMeal, setShowAddMeal] = useState(false);

  useEffect(() => {
    const savedMeals = localStorage.getItem('meals');
    const savedWaterIntake = localStorage.getItem('waterIntake');
    if (savedMeals) setMeals(JSON.parse(savedMeals));
    if (savedWaterIntake) setWaterIntake(Number(savedWaterIntake));
  }, []);

  const handleAddMeal = (e) => {
    e.preventDefault();
    if (!newMeal.description.trim()) return;

    const mealEntry = {
      id: Date.now(),
      ...newMeal,
      calories: Number(newMeal.calories) || 0,
      createdAt: new Date().toISOString()
    };

    const updatedMeals = [...meals, mealEntry];
    setMeals(updatedMeals);
    localStorage.setItem('meals', JSON.stringify(updatedMeals));
    
    setNewMeal({
      type: 'breakfast',
      description: '',
      calories: '',
      date: selectedDate
    });
    setShowAddMeal(false);
  };

  const updateWaterIntake = (amount) => {
    const newAmount = Math.max(0, waterIntake + amount);
    setWaterIntake(newAmount);
    localStorage.setItem('waterIntake', newAmount.toString());
  };

  const getMealsForDate = () => {
    return meals.filter(meal => meal.date === selectedDate);
  };

  const getTotalCalories = () => {
    return getMealsForDate().reduce((total, meal) => total + meal.calories, 0);
  };

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { value: 'lunch', label: 'Lunch', icon: '🌞' },
    { value: 'dinner', label: 'Dinner', icon: '🌙' },
    { value: 'snack', label: 'Snack', icon: '🍎' }
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-2">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Apple className="h-5 w-5" />
              Nutrition Tracker
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track your meals and water intake
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-sm border-gray-200 rounded-md shadow-sm focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
            <button
              onClick={() => setShowAddMeal(true)}
              className="px-4 py-2 bg-black text-white rounded-md text-sm flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Meal
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Daily Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-4">Daily Summary</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Calories</p>
                  <p className="text-2xl font-bold">{getTotalCalories()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Water Intake</p>
                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-bold">{waterIntake}ml</p>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => updateWaterIntake(250)}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                      >
                        +250ml
                      </button>
                      <button
                        onClick={() => updateWaterIntake(-250)}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        -250ml
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meals List */}
              <div className="space-y-2">
                {getMealsForDate().map(meal => (
                  <div
                    key={meal.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span>{mealTypes.find(t => t.value === meal.type)?.icon}</span>
                      <div>
                        <p className="font-medium">{meal.description}</p>
                        <p className="text-sm text-gray-500">
                          {mealTypes.find(t => t.value === meal.type)?.label}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">{meal.calories} cal</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Meal Form */}
          {showAddMeal && (
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-4">Add Meal</h2>
                <form onSubmit={handleAddMeal} className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Meal Type</label>
                    <select
                      value={newMeal.type}
                      onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-1 focus:ring-black focus:border-black"
                    >
                      {mealTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Description</label>
                    <input
                      type="text"
                      value={newMeal.description}
                      onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
                      placeholder="What did you eat?"
                      className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-1 focus:ring-black focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Calories</label>
                    <input
                      type="number"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                      placeholder="Estimated calories"
                      className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-1 focus:ring-black focus:border-black"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddMeal(false)}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800"
                    >
                      Save Meal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}