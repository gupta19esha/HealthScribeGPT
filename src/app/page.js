'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Activity, Sun, Moon, ChevronRight } from 'lucide-react';

export default function Home() {
  const [username, setUsername] = useState('');

  const features = [
    { icon: Heart, text: 'Track your daily health metrics', color: 'text-red-500' },
    { icon: Brain, text: 'Get AI-powered health insights', color: 'text-purple-500' },
    { icon: Activity, text: 'Monitor your progress', color: 'text-blue-500' },
    { icon: Sun, text: 'Set and achieve health goals', color: 'text-orange-500' },
  ];

  const backgroundElements = [...Array(20)].map((_, i) => ({
    left: `${(i * 5) % 100}%`,
    top: `${Math.floor(i * 5 / 100) * 5}%`,
    animateX: 50,
    animateY: 50,
    scale: 1.5,
    duration: 5 + (i % 5)
  }));

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundElements.map((element, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-black opacity-5"
            animate={{
              x: [0, element.animateX, 0],
              y: [0, element.animateY, 0],
              scale: [1, element.scale, 1],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: element.left,
              top: element.top,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1 
                className="text-5xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Your Personal AI Health Journal
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Track your wellbeing, get personalized insights, and achieve your health goals with AI assistance.
              </motion.p>
            </div>

            {/* Features list */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 * index + 0.8 }}
                  className="flex items-center space-x-3"
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  <span className="text-gray-700">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Login form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
          >
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold">Start Your Journey</h2>
                <p className="mt-2 text-gray-600">Track your health with AI-powered insights</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Choose a username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black transition-colors"
                    placeholder="Enter your unique username"
                  />
                </div>

                <Link
                  href="/dashboard"
                  className="group relative w-full inline-flex items-center justify-center px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  <span>Start Journaling</span>
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <p className="text-sm text-center text-gray-500">
                  Your journey to better health starts here
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600">
            Join thousands of users who are taking control of their health journey
          </p>
        </motion.div>
      </div>
    </main>
  );
}