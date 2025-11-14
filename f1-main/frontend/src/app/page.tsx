'use client';

import Link from "next/link";

export default function Home() {
  return (
    // Uses the new --background from globals.css
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements - kept for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-red-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header - now uses a clean, light style */}
      <header className="f1-page-header relative z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg animate-glow">
                <span className="text-white text-xl font-bold">F1</span>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">F1 Prediction System</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-red-600 font-semibold transition-all duration-300">Home</Link>
              <Link href="/podium" className="text-neutral-700 hover:text-red-600 font-semibold transition-all duration-300">Podium</Link>
              <Link href="/championship" className="text-neutral-700 hover:text-red-600 font-semibold transition-all duration-300">Championship</Link>
              <Link href="/analytics" className="text-neutral-700 hover:text-red-600 font-semibold transition-all duration-300">Analytics</Link>
            </nav>
          </div>
        </div>
      </header> {/* <-- FIXED: Added missing '>' here */}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-7xl font-bold text-neutral-900 mb-6 tracking-tight">
            F1 Prediction System
          </h1>
          <p className="text-xl text-neutral-800 max-w-3xl mx-auto font-medium leading-relaxed">
            Leverage machine learning to predict podium finishes and World Drivers' Championship winners
            using historical F1 data from 2016-2023.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto rounded-full mt-8 shadow-lg"></div>
        </div>

        {/* Features Grid - using new .f1-card style */}
        <div className="grid lg:grid-cols-3 gap-10 mb-20">
          {/* Card 1 */}
          <div className="f1-card p-10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-float">
                <span className="text-white text-3xl">🏆</span>
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Podium Prediction</h2>
            </div>
            <p className="text-neutral-700 text-lg font-medium mb-8 leading-relaxed">
              Predict whether a driver will finish in the Top 3 based on their starting grid position,
              team, and historical performance data.
            </p>
            <div className="text-center">
              <Link
                href="/podium"
                className="f1-button-primary"
              >
                Make Prediction
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="f1-card p-10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-float" style={{animationDelay: '1s'}}>
                <span className="text-white text-3xl">🏁</span>
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Championship Prediction</h2>
            </div>
            <p className="text-neutral-700 text-lg font-medium mb-8 leading-relaxed">
              Predict the World Drivers' Championship winner for any given season
              based on current standings and performance metrics.
            </p>
            <div className="text-center">
              <Link
                href="/championship"
                className="f1-button-primary"
              >
                Predict Champion
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="f1-card p-10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-float" style={{animationDelay: '2s'}}>
                <span className="text-white text-3xl">📊</span>
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Analytics Dashboard</h2>
            </div>
            <p className="text-neutral-700 text-lg font-medium mb-8 leading-relaxed">
              Explore comprehensive visualizations of driver performance,
              team standings, and podium frequency charts.
            </p>
            <div className="text-center">
              <Link
                href="/analytics"
                className="f1-button-primary"
              >
                View Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="f1-card p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">How It Works</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto rounded-full shadow-lg"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-2xl">🧠</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Machine Learning Models</h3>
              <p className="text-neutral-700 text-lg font-medium leading-relaxed">
                Trained on 8 years of F1 data using Random Forest algorithms for accurate predictions
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-2xl">⚡️</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Real-time Predictions</h3>
              <p className="text-neutral-700 text-lg font-medium leading-relaxed">
                Get instant predictions with confidence scores and probabilities for data-driven decisions
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-2xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Data-Driven Insights</h3>
              <p className="text-neutral-700 text-lg font-medium leading-relaxed">
                Based on comprehensive historical F1 race data and advanced statistical analysis
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="f1-page-header relative z-10 mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">F1</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900">F1 Prediction System</h3>
              </div>
              <p className="text-neutral-600 font-medium">
                Advanced machine learning predictions for Formula 1 racing.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-neutral-900">Features</h4>
              <ul className="space-y-2 text-neutral-600">
                <li><Link href="/podium" className="hover:text-red-600 transition-colors">Podium Prediction</Link></li>
                <li><Link href="/championship" className="hover:text-red-600 transition-colors">Championship Prediction</Link></li>
                <li><Link href="/analytics" className="hover:text-red-600 transition-colors">Analytics Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-neutral-900">Technology</h4>
              <ul className="space-y-2 text-neutral-600">
                <li>Machine Learning</li>
                <li>Random Forest Models</li>
                <li>Real-time Predictions</li>
                <li>Data Visualization</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-neutral-900">Data</h4>
              <ul className="space-y-2 text-neutral-600">
                <li>8 Years of F1 Data</li>
                <li>Driver Statistics</li>
                <li>Team Performance</li>
                <li>Race Results</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-neutral-500 font-medium">
              © 2025 F1 Prediction System. Built with machine learning and passion for motorsport.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}