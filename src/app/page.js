'use client';
import { useState } from 'react';
import { Heart, Brain, Activity, Sun, ChevronRight } from 'lucide-react';
import Footer from '@/components/Footer';

export default function Home() {
  const [username, setUsername] = useState('');

  const features = [
    { icon: Heart, text: 'Track daily health metrics and habits', color: 'text-rose-500' },
    { icon: Brain, text: 'Get personalized AI health insights', color: 'text-violet-500' },
    { icon: Activity, text: 'Monitor progress with detailed analytics', color: 'text-sky-500' },
    { icon: Sun, text: 'Set and achieve meaningful health goals', color: 'text-amber-500' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Improved background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-1" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Your Personal
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                  AI Health Journal
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Transform your wellness journey with AI-powered insights, personalized tracking, and actionable health recommendations.
              </p>
            </div>

            {/* Features list with enhanced visual hierarchy */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-colors shadow-sm"
                >
                  <div className={`${feature.color} p-2 rounded-lg bg-white shadow-sm`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Enhanced login form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Start Your Journey</h2>
                  <p className="text-gray-600">Join thousands improving their health with AI assistance</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Choose a username
                    </label>
                    <div className="relative">
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                        placeholder="Enter your unique username"
                      />
                    </div>
                  </div>

                  <button
                    className="group w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 font-medium"
                  >
                    <span>Start Your Health Journey</span>
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-sm text-center text-gray-500">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            </div>

            {/* New: Social proof section */}
            <div className="border-t border-gray-100 bg-gray-50/50 p-6">
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-violet-600">10k+</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-violet-600">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-violet-600">24/7</div>
                  <div className="text-sm text-gray-600">AI Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}