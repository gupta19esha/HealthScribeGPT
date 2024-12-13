// src/app/dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { storageUtils } from '@/utils/storage';

export default function Dashboard() {
  const [journalEntry, setJournalEntry] = useState('');
  const [journalEntries, setJournalEntries] = useState([]);

  useEffect(() => {
    const savedEntries = storageUtils.getJournalEntries();
    setJournalEntries(savedEntries);
  }, []);

  const handleJournalSubmit = (e) => {
    e.preventDefault();
    
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      content: journalEntry
    };

    const updatedEntries = storageUtils.addJournalEntry(newEntry);
    if (updatedEntries) {
      setJournalEntries(updatedEntries);
      setJournalEntry('');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-2">
        <div className="grid grid-cols-1 gap-4">
          {/* Journal Entry Section */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                Today's Journal
              </h2>
              <p className="text-sm text-gray-500">Write freely about your day, feelings, and experiences.</p>
            </div>
            <form onSubmit={handleJournalSubmit}>
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="How are you feeling today? Pour your thoughts here..."
                className="w-full h-40 p-4 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black text-sm resize-none"
              />
              <div className="mt-4 flex justify-between items-center">
                <button
                  type="submit"
                  disabled={!journalEntry.trim()}
                  className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                >
                  Save Entry
                </button>
                <p className="text-sm text-gray-500">
                  Visit Analytics tab for detailed health insights →
                </p>
              </div>
            </form>
          </div>

          {/* Journal Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Journal Timeline</h2>
            {journalEntries.length > 0 ? (
              <div className="space-y-4">
                {journalEntries.map((entry) => (
                  <div 
                    key={entry.id} 
                    className="border-l-2 border-gray-800 pl-4 py-2"
                  >
                    <p className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="mt-2 text-gray-700">{entry.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Your journal entries will appear here. Start writing to create your first entry!
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}