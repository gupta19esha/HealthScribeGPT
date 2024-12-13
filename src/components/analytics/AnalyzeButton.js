// src/components/analytics/AnalyzeButton.js
import { LineChart } from 'lucide-react';

export const AnalyzeButton = ({ onClick, isAnalyzing, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isAnalyzing}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
        transition-colors duration-150 ease-in-out
        ${disabled 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-black text-white hover:bg-gray-800'}
      `}
    >
      {isAnalyzing ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
          <span>Analyzing...</span>
        </>
      ) : (
        <>
          <LineChart className="h-4 w-4" />
          <span>Analyze Entries</span>
        </>
      )}
    </button>
  );
};