// src/utils/storage.js
export const storageUtils = {
    saveJournalEntries: (entries) => {
      try {
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        return true;
      } catch (error) {
        console.error('Error saving entries:', error);
        return false;
      }
    },
  
    getJournalEntries: () => {
      try {
        const entries = localStorage.getItem('journalEntries');
        return entries ? JSON.parse(entries) : [];
      } catch (error) {
        console.error('Error getting entries:', error);
        return [];
      }
    },
  
    addJournalEntry: (entry) => {
      try {
        const entries = storageUtils.getJournalEntries();
        const updatedEntries = [entry, ...entries];
        storageUtils.saveJournalEntries(updatedEntries);
        return updatedEntries;
      } catch (error) {
        console.error('Error adding entry:', error);
        return null;
      }
    }
  };