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
        <div className="flex h-screen">
          {/* Sidebar */}
          <aside className={`bg-gray-800 text-white w-64 min-h-screen ${isSidebarOpen ? '' : 'hidden'}`}>
            <div className="p-4">
              <h1 className="text-2xl font-bold mb-8">English Memory</h1>
              <nav className="space-y-2">
                <Link
                  href="/review"
                  className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-lg"
                >
                  <Clock className="w-5 h-5" />
                  <span>Review</span>
                </Link>
                <Link
                  href="/new"
                  className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-lg"
                >
                  <Book className="w-5 h-5" />
                  <span>New</span>
                </Link>
                <Link
                  href="/statistics"
                  className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-lg"
                >
                  <BarChart className="w-5 h-5" />
                  <span>Statistics</span>
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto bg-gray-100">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
