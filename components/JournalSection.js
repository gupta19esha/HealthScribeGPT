export default function JournalSection({ entries, onNewEntry }) {
    const handleSubmit = (e) => {
      e.preventDefault()
      const text = e.target.entry.value.trim()
      if (text) {
        onNewEntry(text)
        e.target.reset()
      }
    }
  
    return (
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Daily Check-in</h2>
          <form onSubmit={handleSubmit}>
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
          <h2 className="text-2xl font-semibold mb-4">Recent Entries</h2>
          {entries.length === 0 ? (
            <p className="text-gray-medium">Start your health journey by adding your first entry!</p>
          ) : (
            <div className="space-y-4">
              {entries.map(entry => (
                <div key={entry.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <p className="text-gray-dark">{entry.text}</p>
                  <p className="text-sm text-gray-medium mt-2">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }