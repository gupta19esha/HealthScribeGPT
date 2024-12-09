// components/Dashboard.js
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Activity, Brain, History } from 'lucide-react'
import JournalSection from './JournalSection'
import MetricsSection from './MetricsSection'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [metrics, setMetrics] = useState({
    sleep: [],
    exercise: [],
    symptoms: [],
    energy: []
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
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

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <JournalSection onMetricsUpdate={setMetrics} />
            <MetricsSection metrics={metrics} />
          </motion.div>
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

// components/JournalSection.js
export function JournalSection({ onMetricsUpdate }) {
  const [entries, setEntries] = useState([])

  const handleNewEntry = (text) => {
    const metrics = extractHealthMetrics(text)
    const newEntry = {
      id: Date.now(),
      text,
      timestamp: new Date().toISOString(),
      metrics
    }

    setEntries(prev => [newEntry, ...prev])
    onMetricsUpdate(prev => ({
      sleep: [...prev.sleep, { date: new Date(), value: metrics.sleep }].filter(x => x.value),
      exercise: [...prev.exercise, { date: new Date(), value: metrics.exercise }].filter(x => x.value),
      symptoms: [...prev.symptoms, { date: new Date(), value: metrics.symptoms }].filter(x => x.value?.length),
      energy: [...prev.energy, { date: new Date(), value: metrics.energy }].filter(x => x.value)
    }))
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
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
      </motion.div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
        {entries.length === 0 ? (
          <p className="text-gray-500">Start your health journey by adding your first entry!</p>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
              >
                <p className="text-gray-800">{entry.text}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}