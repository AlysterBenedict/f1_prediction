'use client';

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-md bg-white/5 border-b border-white/10 shadow-2xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg shadow-red-600/50">
                <span className="text-white text-2xl font-black">F1</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">F1 PREDICTION SYSTEM</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-white hover:text-red-500 font-bold transition-colors">Home</Link>
              <Link href="/podium" className="text-white/80 hover:text-red-500 font-bold transition-colors">Podium</Link>
              <Link href="/championship" className="text-white/80 hover:text-red-500 font-bold transition-colors">Championship</Link>
              <Link href="/analytics" className="text-white/80 hover:text-red-500 font-bold transition-colors">Analytics</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-16">
        {/* Hero Section with F1 Car Banner */}
        <div className="relative mb-20 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10"></div>
          <div 
            className="h-96 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1600&h=600&fit=crop')",
              backgroundPosition: "center 40%"
            }}
          >
            <div className="relative z-20 h-full flex items-center justify-center text-center backdrop-blur-sm bg-black/40">
              <div>
                <h1 className="text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
                  F1 PREDICTION SYSTEM
                </h1>
                <p className="text-2xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                  Leverage machine learning to predict podium finishes and World Drivers' Championship winners
                </p>
                <div className="w-32 h-1 bg-gradient-to-r from-red-600 to-white mx-auto rounded-full mt-8"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {/* Podium Prediction Card */}
          <div className="group relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 hover:border-red-500/50 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
            <div 
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=400&fit=crop')",
                filter: "brightness(0.3)"
              }}
            ></div>
            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-600/50">
                  <span className="text-white text-4xl">🏆</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">PODIUM PREDICTION</h2>
              </div>
              <p className="text-white/80 text-lg font-medium mb-8 leading-relaxed">
                Predict whether a driver will finish in the Top 3 based on their starting grid position, team, and historical performance data.
              </p>
              <div className="text-center">
                <Link
                  href="/podium"
                  className="inline-block bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-900 font-black text-lg transition-all transform hover:scale-105 shadow-lg shadow-red-600/50"
                >
                  MAKE PREDICTION
                </Link>
              </div>
            </div>
          </div>

          {/* Championship Prediction Card */}
          <div className="group relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 hover:border-red-500/50 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
            <div 
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1596276020587-8044fe049813?w=600&h=400&fit=crop')",
                filter: "brightness(0.3)"
              }}
            ></div>
            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-600/50">
                  <span className="text-white text-4xl">👑</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">CHAMPIONSHIP</h2>
              </div>
              <p className="text-white/80 text-lg font-medium mb-8 leading-relaxed">
                Predict the World Drivers' Championship winner for any given season based on current standings and performance metrics.
              </p>
              <div className="text-center">
                <Link
                  href="/championship"
                  className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-8 py-4 rounded-xl hover:from-yellow-600 hover:to-yellow-800 font-black text-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-600/50"
                >
                  PREDICT CHAMPION
                </Link>
              </div>
            </div>
          </div>

          {/* Analytics Dashboard Card */}
          <div className="group relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 hover:border-red-500/50 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
            <div 
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1611651338412-8403fa6e3599?w=600&h=400&fit=crop')",
                filter: "brightness(0.3)"
              }}
            ></div>
            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/50">
                  <span className="text-white text-4xl">📊</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">ANALYTICS</h2>
              </div>
              <p className="text-white/80 text-lg font-medium mb-8 leading-relaxed">
                Explore comprehensive visualizations of driver performance over seasons, team standings comparisons, and podium frequency charts.
              </p>
              <div className="text-center">
                <Link
                  href="/analytics"
                  className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-900 font-black text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-600/50"
                >
                  VIEW ANALYTICS
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-12 border border-white/20 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black text-white mb-4 tracking-tight">HOW IT WORKS</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-white mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center p-8 backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 hover:border-red-500/50 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-600/50">
                <span className="text-white text-3xl">🤖</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight">ML MODELS</h3>
              <p className="text-white/70 text-lg font-medium leading-relaxed">
                Trained on 8 years of F1 data using Random Forest algorithms for accurate predictions
              </p>
            </div>

            <div className="text-center p-8 backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 hover:border-red-500/50 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-600/50">
                <span className="text-white text-3xl">📈</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight">REAL-TIME</h3>
              <p className="text-white/70 text-lg font-medium leading-relaxed">
                Get instant predictions with confidence scores and probabilities for data-driven decisions
              </p>
            </div>

            <div className="text-center p-8 backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 hover:border-red-500/50 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-600/50">
                <span className="text-white text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight">DATA-DRIVEN</h3>
              <p className="text-white/70 text-lg font-medium leading-relaxed">
                Based on comprehensive historical F1 race data and advanced statistical analysis
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center backdrop-blur-xl bg-gradient-to-r from-red-600/20 to-white/20 rounded-3xl p-12 border border-white/20">
          <h2 className="text-5xl font-black text-white mb-6 tracking-tight">READY TO RACE?</h2>
          <p className="text-xl text-white/80 font-medium mb-8 max-w-2xl mx-auto">
            Start making predictions and discover insights from Formula 1 data like never before.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/podium"
              className="bg-gradient-to-r from-red-600 to-red-800 text-white px-10 py-4 rounded-xl hover:from-red-700 hover:to-red-900 font-black text-lg transition-all transform hover:scale-105 shadow-lg shadow-red-600/50"
            >
              TRY PODIUM PREDICTION
            </Link>
            <Link
              href="/analytics"
              className="backdrop-blur-lg bg-white/10 text-white border-2 border-white/30 px-10 py-4 rounded-xl hover:bg-white/20 font-black text-lg transition-all transform hover:scale-105"
            >
              EXPLORE ANALYTICS
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-md bg-white/5 border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg shadow-red-600/50">
                  <span className="text-white text-lg font-black">F1</span>
                </div>
                <h3 className="text-xl font-black text-white">F1 PREDICTION</h3>
              </div>
              <p className="text-white/60 font-medium">
                Advanced machine learning predictions for Formula 1 racing.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-black mb-4 text-white">FEATURES</h4>
              <ul className="space-y-2 text-white/60">
                <li><Link href="/podium" className="hover:text-red-500 transition-colors">Podium Prediction</Link></li>
                <li><Link href="/championship" className="hover:text-red-500 transition-colors">Championship</Link></li>
                <li><Link href="/analytics" className="hover:text-red-500 transition-colors">Analytics</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-black mb-4 text-white">TECHNOLOGY</h4>
              <ul className="space-y-2 text-white/60">
                <li>Machine Learning</li>
                <li>Random Forest</li>
                <li>Real-time Predictions</li>
                <li>Data Visualization</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-black mb-4 text-white">DATA</h4>
              <ul className="space-y-2 text-white/60">
                <li>8 Years of F1 Data</li>
                <li>Driver Statistics</li>
                <li>Team Performance</li>
                <li>Race Results</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/40 font-medium">
              © 2025 F1 Prediction System. Built with machine learning and passion for motorsport.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}