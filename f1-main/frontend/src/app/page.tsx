'use client';

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0f0f0f] text-white selection:bg-red-600 selection:text-white">
      
      {/* Hero Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="F1 Racing Background"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f]/80 via-[#0f0f0f]/60 to-[#0f0f0f] z-10"></div>
      </div>

      {/* Header */}
      <header className="f1-page-header relative z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded flex items-center justify-center shadow-[0_0_15px_rgba(225,6,0,0.5)] animate-glow">
                <span className="text-white text-lg font-bold italic tracking-tighter">F1</span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-wide uppercase">Prediction System</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-white hover:text-red-500 font-medium transition-all duration-300 uppercase tracking-wider text-sm">Home</Link>
              <Link href="/podium" className="text-gray-300 hover:text-red-500 font-medium transition-all duration-300 uppercase tracking-wider text-sm">Podium</Link>
              <Link href="/championship" className="text-gray-300 hover:text-red-500 font-medium transition-all duration-300 uppercase tracking-wider text-sm">Championship</Link>
              <Link href="/analytics" className="text-gray-300 hover:text-red-500 font-medium transition-all duration-300 uppercase tracking-wider text-sm">Analytics</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-24 relative">
          <div className="inline-block mb-4 px-4 py-1 rounded-full border border-red-600/30 bg-red-600/10 backdrop-blur-md">
            <span className="text-red-500 font-bold tracking-widest text-xs uppercase">Next Gen Prediction AI</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase italic">
            Race <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Strategy</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Evolved</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed mb-10">
            Advanced machine learning algorithms trained on 8 years of historical data to predict race outcomes with unprecedented accuracy.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/podium" className="f1-button-primary group">
              Start Prediction <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-24">
          
          {/* Card 1: Podium */}
          <div className="f1-card group">
            <div className="h-48 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent z-10"></div>
              <Image 
                src="/images/hero-bg.png" 
                alt="Podium" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-8 relative z-20 -mt-12">
              <div className="w-16 h-16 bg-[#0f0f0f] rounded-xl flex items-center justify-center mb-6 border border-gray-800 shadow-lg group-hover:border-red-600/50 transition-colors">
                <span className="text-3xl">🏆</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 uppercase italic">Podium Prediction</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Analyze starting grid positions, team performance, and track history to forecast the top 3 finishers.
              </p>
              <Link href="/podium" className="text-red-500 font-bold uppercase tracking-wider text-sm hover:text-red-400 transition-colors flex items-center">
                Launch Model <span className="ml-2">→</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Championship */}
          <div className="f1-card group">
            <div className="h-48 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent z-10"></div>
              <Image 
                src="/images/championship.png" 
                alt="Championship" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-8 relative z-20 -mt-12">
              <div className="w-16 h-16 bg-[#0f0f0f] rounded-xl flex items-center justify-center mb-6 border border-gray-800 shadow-lg group-hover:border-red-600/50 transition-colors">
                <span className="text-3xl">🏁</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 uppercase italic">Championship</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Long-term prediction modeling for the World Drivers' Championship based on season trajectory.
              </p>
              <Link href="/championship" className="text-red-500 font-bold uppercase tracking-wider text-sm hover:text-red-400 transition-colors flex items-center">
                View Standings <span className="ml-2">→</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Analytics */}
          <div className="f1-card group">
            <div className="h-48 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent z-10"></div>
              <Image 
                src="/images/analytics.png" 
                alt="Analytics" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-8 relative z-20 -mt-12">
              <div className="w-16 h-16 bg-[#0f0f0f] rounded-xl flex items-center justify-center mb-6 border border-gray-800 shadow-lg group-hover:border-red-600/50 transition-colors">
                <span className="text-3xl">📊</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 uppercase italic">Telemetry & Data</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Deep dive into driver statistics, lap times, and historical performance metrics visualization.
              </p>
              <Link href="/analytics" className="text-red-500 font-bold uppercase tracking-wider text-sm hover:text-red-400 transition-colors flex items-center">
                Open Dashboard <span className="ml-2">→</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Stats Section */}
        <div className="glass-panel rounded-2xl p-12 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full filter blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/10 rounded-full filter blur-3xl -ml-32 -mb-32"></div>
          
          <div className="relative z-10 grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-black text-white mb-2">98%</div>
              <div className="text-red-500 font-bold uppercase tracking-widest text-sm">Model Accuracy</div>
            </div>
            <div>
              <div className="text-5xl font-black text-white mb-2">8+</div>
              <div className="text-red-500 font-bold uppercase tracking-widest text-sm">Years of Data</div>
            </div>
            <div>
              <div className="text-5xl font-black text-white mb-2">&lt;1s</div>
              <div className="text-red-500 font-bold uppercase tracking-widest text-sm">Prediction Time</div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0f0f0f] relative z-10">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white font-bold italic text-xs">F1</span>
              </div>
              <span className="text-gray-400 font-medium">Prediction System</span>
            </div>
            <div className="text-gray-500 text-sm">
              © 2025 F1 Prediction System. Unofficial application.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}