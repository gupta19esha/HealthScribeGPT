// src/app/api/analyze/route.js
import { NextResponse } from 'next/server';

import { ChatOpenAI } from "@langchain/openai";

import { PromptTemplate } from "@langchain/core/prompts";

import { StringOutputParser } from "@langchain/core/output_parsers";



export async function POST(request) {

  try {

    const { content } = await request.json();



    if (!process.env.OPENAI_API_KEY) {

      throw new Error('OpenAI API key not found');

    }



    const model = new ChatOpenAI({

      openAIApiKey: process.env.OPENAI_API_KEY,

      modelName: "gpt-4",

      temperature: 0.7,

    });



    const systemPrompt = `You are a health analysis expert. Analyze journal entries to extract health metrics and provide insights.

    Always return data in the exact format specified. If a metric isn't mentioned, use contextual clues or return default values.`;



    const userPrompt = `

    Analyze this journal entry and extract health metrics:

    "${content}"



    Return a JSON object with EXACTLY this structure:

    {

      "metrics": {

        "sleep": [extract hours as number, default 0],

        "exercise": [extract minutes as number, default 0],

        "mood": ["good", "neutral", or "bad"],

        "energy": ["high", "medium", or "low"],

        "symptoms": [array of symptoms mentioned]

      },

      "insights": [

        "specific insight about sleep pattern",

        "specific insight about exercise habits",

        "specific insight about overall wellbeing"

      ],

      "suggestions": [

        "actionable recommendation based on sleep/exercise",

        "actionable recommendation based on symptoms/mood"

      ]

    }`;



    const response = await model.invoke([

      { role: "system", content: systemPrompt },

      { role: "user", content: userPrompt }

    ]);



    try {

      // Parse and validate the response

      const parsedResponse = JSON.parse(response.content);

      

      // Ensure the response has the required structure

      if (!parsedResponse.metrics || !parsedResponse.insights || !parsedResponse.suggestions) {

        throw new Error('Invalid response structure');

      }



      // Ensure metrics have correct types

      const validatedResponse = {

        metrics: {

          sleep: Number(parsedResponse.metrics.sleep) || 0,

          exercise: Number(parsedResponse.metrics.exercise) || 0,

          mood: ['good', 'neutral', 'bad'].includes(parsedResponse.metrics.mood) 

            ? parsedResponse.metrics.mood 

            : 'neutral',

          energy: ['high', 'medium', 'low'].includes(parsedResponse.metrics.energy)

            ? parsedResponse.metrics.energy

            : 'medium',

          symptoms: Array.isArray(parsedResponse.metrics.symptoms) 

            ? parsedResponse.metrics.symptoms 

            : []

        },

        insights: Array.isArray(parsedResponse.insights) 

          ? parsedResponse.insights.slice(0, 3)

          : [],

        suggestions: Array.isArray(parsedResponse.suggestions)

          ? parsedResponse.suggestions.slice(0, 2)

          : []

      };



      return NextResponse.json(validatedResponse);



    } catch (parseError) {

      console.error('Error parsing AI response:', parseError);

      // Return a fallback response if parsing fails

      return NextResponse.json({

        metrics: {

          sleep: 0,

          exercise: 0,

          mood: 'neutral',

          energy: 'medium',

          symptoms: []

        },

        insights: ['Unable to analyze entry'],

        suggestions: ['Please try again']

      });

    }



  } catch (error) {

    console.error('API Error:', error);

    return NextResponse.json(

      { error: error.message || 'Analysis failed' },

      { status: 500 }

    );

  }

}