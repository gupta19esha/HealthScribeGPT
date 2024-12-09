'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Brain, LineChart, Calendar, History } from 'lucide-react'

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false)

  if (showDashboard) {
    return <Dashboard />
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold">HealthScribeGPT</h1>
            <div className="flex gap-6">
              <button className="nav-link">Features</button>
              <button className="nav-link">About</button>
              <button onClick={() => setShowDashboard(true)} className="btn-primary">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-5xl font-bold mb-6">
              Your AI-Powered Health Journal
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Track your health journey with intelligent insights and personalized analytics.
              Let AI help you understand your well-being better.
            </p>
            <button
              onClick={() => setShowDashboard(true)}
              className="btn-primary text-lg px-8 py-3"
            >
              Start Your Health Journey
            </button>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <FeatureCard
              icon={<Activity className="w-6 h-6" />}
              title="Daily Health Tracking"
              description="Log your daily activities, symptoms, and feelings with natural language."
            />
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title="AI-Powered Insights"
              description="Get personalized health insights and patterns from your entries."
            />
            <FeatureCard
              icon={<LineChart className="w-6 h-6" />}
              title="Progress Analytics"
              description="Visualize your health trends and track improvements over time."
            />
          </div>
        </div>
      </section>
    </div>
  )
}
function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="card group cursor-pointer"
    >
      <div className="mb-4 p-3 w-fit rounded-lg bg-gray-100 group-hover:bg-black group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [entries, setEntries] = useState([])
  const [metrics, setMetrics] = useState({
    sleep: [],
    exercise: [],
    symptoms: [],
    energy: []
  })

  const handleNewEntry = (text) => {
    const newMetrics = extractHealthMetrics(text)
    const entry = {
      id: Date.now(),
      text,
      timestamp: new Date().toISOString(),
      metrics: newMetrics
    }

    setEntries(prev => [entry, ...prev])
    updateMetrics(newMetrics)
  }

  const updateMetrics = (newMetrics) => {
    setMetrics(prev => ({
      sleep: [...prev.sleep, { date: new Date(), value: newMetrics.sleep }].filter(x => x.value),
      exercise: [...prev.exercise, { date: new Date(), value: newMetrics.exercise }].filter(x => x.value),
      symptoms: [...prev.symptoms, { date: new Date(), value: newMetrics.symptoms }].filter(x => x.value?.length),
      energy: [...prev.energy, { date: new Date(), value: newMetrics.energy }].filter(x => x.value)
    }))
  }

  const extractHealthMetrics = (text) => {
    const metrics = {
      sleep: null,
      exercise: null,
      symptoms: [],
      energy: null
    }

    const sleepMatch = text.match(/slept\s+(\d+)\s*hours?/i)
    if (sleepMatch) metrics.sleep = parseInt(sleepMatch[1])

    const exerciseMatch = text.match(/(\d+)[\s-]*min(ute)?\s*(workout|exercise|run)/i)
    if (exerciseMatch) metrics.exercise = parseInt(exerciseMatch[1])

    const commonSymptoms = ['headache', 'fever', 'cough', 'fatigue']
    commonSymptoms.forEach(symptom => {
      if (text.toLowerCase().includes(symptom)) {
        metrics.symptoms.push(symptom)
      }
    })

    if (text.toLowerCase().includes('energy')) {
      if (text.toLowerCase().includes('low')) metrics.energy = 'low'
      if (text.toLowerCase().includes('high')) metrics.energy = 'high'
      if (text.toLowerCase().includes('medium')) metrics.energy = 'medium'
    }

    return metrics
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold">HealthScribeGPT</h1>
            <div className="flex items-center gap-6">
              <NavButton 
                icon={<Calendar className="w-4 h-4" />}
                label="Dashboard"
                active={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
              />
              <NavButton 
                icon={<History className="w-4 h-4" />}
                label="History"
                active={activeTab === 'history'}
                onClick={() => setActiveTab('history')}
              />
              <NavButton 
                icon={<Brain className="w-4 h-4" />}
                label="Insights"
                active={activeTab === 'insights'}
                onClick={() => setActiveTab('insights')}
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Journal Section */}
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Daily Check-in</h2>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleNewEntry(e.target.entry.value)
                  e.target.reset()
                }}>
                  <textarea
                    name="entry"
                    className="input min-h-[150px] mb-4"
                    placeholder="How are you feeling today? Tell me about your sleep, exercise, symptoms..."
                  />
                  <button type="submit" className="btn-primary">
                    Save Entry
                  </button>
                </form>
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
                {entries.length === 0 ? (
                  <p className="text-gray-500">Start your health journey by adding your first entry!</p>
                ) : (
                  <div className="space-y-4">
                    {entries.map(entry => (
                      <div key={entry.id} className="border-b border-gray-100 last:border-0 pb-4">
                        <p className="text-gray-800">{entry.text}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Metrics Section */}
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-6">Health Overview</h2>
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard title="Sleep" data={metrics.sleep} format={v => `${v} hours`} />
                  <MetricCard title="Exercise" data={metrics.exercise} format={v => `${v} minutes`} />
                  <MetricCard title="Symptoms" data={metrics.symptoms} format={v => v.join(', ')} />
                  <MetricCard title="Energy" data={metrics.energy} format={v => v} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors
        ${active 
          ? 'text-black bg-gray-100' 
          : 'text-gray-600 hover:text-black hover:bg-gray-50'
        }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

function MetricCard({ title, data, format }) {
  const recentData = data.slice(-5)
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium mb-3">{title}</h3>
      {recentData.length === 0 ? (
        <p className="text-sm text-gray-500">No data yet</p>
      ) : (
        <div className="space-y-2">
          {recentData.map((entry, i) => (
            <div key={i} className="text-sm">
              <span className="text-gray-500">
                {entry.date.toLocaleDateString()}: 
              </span>
              <span className="ml-2 text-gray-900">
                {format(entry.value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}