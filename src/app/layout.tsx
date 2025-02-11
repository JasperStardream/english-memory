'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { useState } from 'react';
import Link from 'next/link';
import { Book, Clock, BarChart } from 'lucide-react';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="flex flex-col h-screen">
          {/* Main content */}
          <main className="flex-1 overflow-y-auto bg-gray-100">
            {children}
          </main>

          {/* Bottom Navigation */}
          <nav className={`bg-gray-800 text-white p-4 ${isSidebarOpen ? '' : 'hidden'}`}>
            <div className="max-w-screen-xl mx-auto">
              <div className="flex justify-around items-center">
                <Link
                  href="/review"
                  className="flex flex-col items-center p-2 hover:bg-gray-700 rounded-lg"
                >
                  <Clock className="w-6 h-6" />
                  <span className="text-sm mt-1">Review</span>
                </Link>
                <Link
                  href="/new"
                  className="flex flex-col items-center p-2 hover:bg-gray-700 rounded-lg"
                >
                  <Book className="w-6 h-6" />
                  <span className="text-sm mt-1">New</span>
                </Link>
                <Link
                  href="/statistics"
                  className="flex flex-col items-center p-2 hover:bg-gray-700 rounded-lg"
                >
                  <BarChart className="w-6 h-6" />
                  <span className="text-sm mt-1">Statistics</span>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}
