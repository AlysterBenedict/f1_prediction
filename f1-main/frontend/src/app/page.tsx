'use client';

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-2 border-gray-300">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">F1</span>
              </div>
              <h1 className="text-2xl font-bold text-black">F1 Prediction System</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-black hover:text-gray-700 font-semibold transition-colors">Home</Link>
              <Link href="/podium" className="text-black hover:text-gray-700 font-semibold transition-colors">Podium</Link>
              <Link href="/championship" className="text-black hover:text-gray-700 font-semibold transition-colors">Championship</Link>
              <Link href="/analytics" className="text-black hover:text-gray-700 font-semibold transition-colors">Analytics</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-black mb-6 tracking-tight">
            F1 Prediction System
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto font-medium leading-relaxed">
            Leverage machine learning to predict podium finishes and World Drivers' Championship winners
            using historical F1 data from 2016-2023.
          </p>
          <div className="w-32 h-1 bg-black mx-auto rounded-full mt-8"></div>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 gap-10 mb-20">
          <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-300 hover:shadow-3xl transition-all transform hover:scale-105">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">🏆</span>
              </div>
              <h2 className="text-3xl font-bold text-black mb-4">Podium Prediction</h2>
            </div>
            <p className="text-black text-lg font-medium mb-8 leading-relaxed">
              Predict whether a driver will finish in the Top 3 based on their starting grid position,
              team, and historical performance data.
            </p>
            <div className="text-center">
              <Link
                href="/podium"
                className="inline-block bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Make Prediction
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-300 hover:shadow-3xl transition-all transform hover:scale-105">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">👑</span>
              </div>
              <h2 className="text-3xl font-bold text-black mb-4">Championship Prediction</h2>
            </div>
            <p className="text-black text-lg font-medium mb-8 leading-relaxed">
              Predict the World Drivers' Championship winner for any given season
              based on current standings and performance metrics.
            </p>
            <div className="text-center">
              <Link
                href="/championship"
                className="inline-block bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Predict Champion
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-gray-300 hover:shadow-3xl transition-all transform hover:scale-105">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">📊</span>
              </div>
              <h2 className="text-3xl font-bold text-black mb-4">Analytics Dashboard</h2>
            </div>
            <p className="text-black text-lg font-medium mb-8 leading-relaxed">
              Explore comprehensive visualizations of driver performance over seasons,
              team standings comparisons, and podium frequency charts.
            </p>
            <div className="text-center">
              <Link
                href="/analytics"
                className="inline-block bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                View Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-12 border-2 border-gray-300 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4">How It Works</h2>
            <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-300">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Machine Learning Models</h3>
              <p className="text-black text-lg font-medium leading-relaxed">
                Trained on 8 years of F1 data using Random Forest algorithms for accurate predictions
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-300">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Real-time Predictions</h3>
              <p className="text-black text-lg font-medium leading-relaxed">
                Get instant predictions with confidence scores and probabilities for data-driven decisions
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-gray-300">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Data-Driven Insights</h3>
              <p className="text-black text-lg font-medium leading-relaxed">
                Based on comprehensive historical F1 race data and advanced statistical analysis
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-gray-100 to-slate-200 rounded-2xl p-12 border-2 border-gray-300">
          <h2 className="text-4xl font-bold text-black mb-6">Ready to Explore F1 Predictions?</h2>
          <p className="text-xl text-black font-medium mb-8 max-w-2xl mx-auto">
            Start making predictions and discover insights from Formula 1 data like never before.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/podium"
              className="bg-black text-white px-10 py-4 rounded-xl hover:bg-gray-800 font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Try Podium Prediction
            </Link>
            <Link
              href="/analytics"
              className="bg-white text-black border-2 border-black px-10 py-4 rounded-xl hover:bg-gray-50 font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Explore Analytics
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black text-lg font-bold">F1</span>
                </div>
                <h3 className="text-xl font-bold">F1 Prediction System</h3>
              </div>
              <p className="text-gray-300 font-medium">
                Advanced machine learning predictions for Formula 1 racing.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/podium" className="hover:text-white transition-colors">Podium Prediction</Link></li>
                <li><Link href="/championship" className="hover:text-white transition-colors">Championship Prediction</Link></li>
                <li><Link href="/analytics" className="hover:text-white transition-colors">Analytics Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Technology</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Machine Learning</li>
                <li>Random Forest Models</li>
                <li>Real-time Predictions</li>
                <li>Data Visualization</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Data</h4>
              <ul className="space-y-2 text-gray-300">
                <li>8 Years of F1 Data</li>
                <li>Driver Statistics</li>
                <li>Team Performance</li>
                <li>Race Results</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 font-medium">
              © 2025 F1 Prediction System. Built with machine learning and passion for motorsport.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
