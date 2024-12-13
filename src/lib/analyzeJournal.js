// src/lib/analyzeJournal.js
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export async function analyzeJournalEntry(entry) {
  // Extract metrics from text
  const sleepMatch = entry.match(/(\d+)\s*hours?/i);
  const exerciseMatch = entry.match(/(\d+)-minute/i);
  
  // Construct metrics object
  const metrics = {
    sleep: sleepMatch ? parseInt(sleepMatch[1]) : 0,
    exercise: exerciseMatch ? parseInt(exerciseMatch[1]) : 0,
    mood: entry.toLowerCase().includes('good') ? 'good' : 
          entry.toLowerCase().includes('bad') ? 'bad' : 'neutral',
    energy: entry.toLowerCase().includes('high') ? 'high' :
            entry.toLowerCase().includes('low') ? 'low' : 'medium',
    symptoms: []
  };

  // Extract symptoms
  const commonSymptoms = [
    'headache', 'fever', 'cough', 'fatigue', 'pain',
    'nausea', 'dizziness', 'anxiety', 'stress'
  ];

  commonSymptoms.forEach(symptom => {
    if (entry.toLowerCase().includes(symptom)) {
      metrics.symptoms.push(symptom);
    }
  });

  // Initialize OpenAI model with GPT-4
  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4",  // Using GPT-4 instead of GPT-3.5
    temperature: 0.7,
  });

  try {
    // Create a detailed analysis prompt
    const response = await model.invoke([
      {
        role: "system",
        content: `You are an expert health analyst specializing in personalized health insights. 
        Analyze health journal entries to provide specific, actionable insights and suggestions.
        Focus on sleep patterns, exercise habits, energy levels, mood, and any mentioned symptoms.
        Your analysis should be detailed, personalized, and directly related to the information provided.`
      },
      {
        role: "user",
        content: `Analyze this health journal entry in detail:
        "${entry}"

        Provide a thorough analysis with:
        1. Three specific insights about their health patterns
        2. Two actionable recommendations for improvement

        Format your response exactly as this JSON:
        {
          "insights": [
            "Detailed insight about their sleep patterns and quality",
            "Specific observation about their exercise routine and its effects",
            "Analysis of their energy levels and overall wellbeing"
          ],
          "suggestions": [
            "Specific, actionable recommendation based on their sleep and exercise patterns",
            "Practical suggestion for improving their overall health routine"
          ]
        }`
      }
    ]);

    try {
      // Parse and validate the AI response
      const analysis = JSON.parse(response.content);
      
      // Verify we have valid insights and suggestions
      if (analysis.insights?.length > 0 && analysis.suggestions?.length > 0) {
        return {
          metrics,
          insights: analysis.insights,
          suggestions: analysis.suggestions
        };
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
    }
  } catch (error) {
    console.error('Error in AI analysis:', error);
  }

  // Fallback response using actual metrics
  return {
    metrics,
    insights: [
      `You slept for ${metrics.sleep} hours, ${metrics.sleep >= 7 ? 'which meets' : 'which is below'} recommended sleep duration`,
      `Your exercise duration was ${metrics.exercise} minutes ${metrics.exercise >= 30 ? 'meeting daily activity goals' : 'falling short of recommended activity'}`,
      `Your energy levels were ${metrics.energy}, and mood was ${metrics.mood}${metrics.symptoms.length > 0 ? ', with some health concerns noted' : ''}`
    ],
    suggestions: [
      metrics.sleep < 7 ? "Try to increase sleep duration to at least 7 hours" : "Maintain your consistent sleep schedule",
      metrics.exercise < 30 ? "Aim to increase daily exercise to at least 30 minutes" : "Keep up with your current exercise routine"
    ]
  };
}