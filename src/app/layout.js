// src/app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import { JournalProvider } from '@/context/JournalContext'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Health Journal',
  description: 'Track your health journey with AI insights',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-white">
          <JournalProvider>
            <Navbar />
            {children}
          </JournalProvider>
        </div>
      </body>
    </html>
  )
}