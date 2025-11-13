'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Select from 'react-select';

interface Season {
  year: number;
}

interface Driver {
  driverId: number;
  name: string;
}

interface PredictionResult {
  prediction: number;
  champion_probability: number;
  driver_name: string;
  confidence: string;
}

interface ChampionshipPredictions {
  world_drivers_championship: {
    predictions: Array<{
      driver_id: number;
      driver_name: string;
      predicted_champion: boolean;
      champion_probability: number;
      confidence: string;
    }>;
    top_prediction: {
      driver_id: number;
      driver_name: string;
      predicted_champion: boolean;
      champion_probability: number;
      confidence: string;
    } | null;
  };
  constructors_championship: {
    predictions: Array<{
      constructor_id: number;
      constructor_name: string;
      predicted_champion: boolean;
      champion_probability: number;
      confidence: string;
    }>;
    top_prediction: {
      constructor_id: number;
      constructor_name: string;
      predicted_champion: boolean;
      champion_probability: number;
      confidence: string;
    } | null;
  };
}

export default function ChampionshipPrediction() {
  const [seasons, setSeasons] = useState<number[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(2023);
  const [selectedDriver, setSelectedDriver] = useState<{value: number, label: string} | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [championshipPredictions, setChampionshipPredictions] = useState<ChampionshipPredictions | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingChampionship, setLoadingChampionship] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedChampionshipYear, setSelectedChampionshipYear] = useState<number>(2030);

  useEffect(() => {
    fetchSeasons();
    fetchDrivers();
    fetchChampionshipPredictions();
  }, []);

  const fetchSeasons = async () => {
    try {
      const response = await axios.get('http://localhost:8000/seasons');
      setSeasons(response.data);
    } catch (err) {
      setError('Failed to load seasons');
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/drivers');
      setDrivers(response.data);
    } catch (err) {
      setError('Failed to load drivers');
    }
  };

  const fetchChampionshipPredictions = async () => {
    setLoadingChampionship(true);
    try {
      const response = await axios.get(`http://localhost:8000/predict/${selectedChampionshipYear}/championships`);
      setChampionshipPredictions(response.data);
    } catch (err) {
      setError(`Failed to load ${selectedChampionshipYear} predictions`);
    } finally {
      setLoadingChampionship(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    if (!selectedDriver) {
      setError('Please select a driver.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/predict/wdc', {
        year: selectedSeason,
        driverId: selectedDriver.value,
        points: points
      });
      setResult(response.data);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '0.75rem',
      padding: '0.5rem',
      fontSize: '1.125rem',
      fontWeight: '500',
      color: 'white',
      minHeight: '3.5rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'rgba(234, 179, 8, 0.5)'
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '0.75rem'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'rgba(234, 179, 8, 0.8)' : state.isFocused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      color: 'white',
      fontWeight: '500',
      '&:hover': {
        backgroundColor: 'rgba(234, 179, 8, 0.5)'
      }
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'white'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: 'rgba(255, 255, 255, 0.5)'
    }),
    input: (provided: any) => ({
      ...provided,
      color: 'white'
    })
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1596276020587-8044fe049813?w=1920&h=1080&fit=crop')"
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-white hover:text-yellow-500 font-bold text-lg transition-colors group">
              <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Main Content */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-10 border border-white/20">
            {/* Title */}
            <div className="text-center mb-12">
              <div className="inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-600/50">
                  <span className="text-white text-4xl">👑</span>
                </div>
              </div>
              <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">
                CHAMPIONSHIP
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-yellow-500 to-white mx-auto rounded-full"></div>
            </div>

            {/* Championship Predictions */}
            <div className="mb-16 p-10 backdrop-blur-lg bg-gradient-to-br from-yellow-500/10 to-white/5 rounded-3xl border border-yellow-500/30">
              <div className="text-center mb-10">
                <h2 className="text-5xl font-black text-white mb-3 tracking-tight">
                  {selectedChampionshipYear} PREDICTIONS
                </h2>
                <p className="text-white/70 text-lg font-medium">
                  AI-powered championship predictions
                </p>

                {/* Year Selection */}
                <div className="mt-6 mb-4 flex justify-center items-center gap-4">
                  <select
                    value={selectedChampionshipYear}
                    onChange={(e) => {
                      setSelectedChampionshipYear(Number(e.target.value));
                      setChampionshipPredictions(null);
                    }}
                    className="px-6 py-4 backdrop-blur-lg bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white font-bold text-lg transition-all"
                  >
                    {[2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                      <option key={year} value={year} className="bg-black text-white font-bold">
                        {year}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={fetchChampionshipPredictions}
                    disabled={loadingChampionship}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-6 py-4 rounded-xl hover:from-yellow-600 hover:to-yellow-800 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed font-black text-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-600/50"
                  >
                    {loadingChampionship ? 'LOADING...' : 'GET PREDICTIONS'}
                  </button>
                </div>
              </div>

              {loadingChampionship ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-yellow-500 border-t-transparent mx-auto mb-6"></div>
                  <p className="text-white font-bold text-xl">ANALYZING CHAMPIONSHIP DATA...</p>
                </div>
              ) : championshipPredictions ? (
                <div className="grid xl:grid-cols-2 gap-8">
                  {/* World Drivers' Championship */}
                  <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20 hover:border-yellow-500/50 transition-all">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-yellow-600/50">
                        <span className="text-white text-2xl">🏎️</span>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight">
                        DRIVERS' CHAMPIONSHIP
                      </h3>
                    </div>

                    {championshipPredictions.world_drivers_championship.top_prediction && (
                      <div className="mb-8 p-6 backdrop-blur-lg bg-gradient-to-r from-yellow-500/30 to-yellow-700/30 rounded-xl border-2 border-yellow-500/50">
                        <div className="flex items-center mb-3">
                          <span className="text-4xl mr-3">🥇</span>
                          <div>
                            <div className="font-black text-2xl text-white">
                              {championshipPredictions.world_drivers_championship.top_prediction.driver_name}
                            </div>
                            <div className="text-white/90 font-bold text-lg">
                              {(championshipPredictions.world_drivers_championship.top_prediction.champion_probability * 100).toFixed(1)}%
                              <span className={`ml-4 ${getConfidenceColor(championshipPredictions.world_drivers_championship.top_prediction.confidence)}`}>
                                ({championshipPredictions.world_drivers_championship.top_prediction.confidence.toUpperCase()})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {championshipPredictions.world_drivers_championship.predictions.slice(1, 4).map((pred, idx) => (
                        <div key={pred.driver_id} className="flex justify-between items-center py-3 px-4 backdrop-blur-lg bg-white/5 rounded-lg border border-white/10">
                          <span className="font-bold text-white text-lg">{idx + 2}. {pred.driver_name}</span>
                          <span className={`font-black text-lg ${getConfidenceColor(pred.confidence)}`}>
                            {(pred.champion_probability * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Constructors' Championship */}
                  <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20 hover:border-yellow-500/50 transition-all">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-yellow-600/50">
                        <span className="text-white text-2xl">🏭</span>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight">
                        CONSTRUCTORS'
                      </h3>
                    </div>

                    {championshipPredictions.constructors_championship.top_prediction && (
                      <div className="mb-8 p-6 backdrop-blur-lg bg-gradient-to-r from-yellow-500/30 to-yellow-700/30 rounded-xl border-2 border-yellow-500/50">
                        <div className="flex items-center mb-3">
                          <span className="text-4xl mr-3">🥇</span>
                          <div>
                            <div className="font-black text-2xl text-white">
                              {championshipPredictions.constructors_championship.top_prediction.constructor_name}
                            </div>
                            <div className="text-white/90 font-bold text-lg">
                              {(championshipPredictions.constructors_championship.top_prediction.champion_probability * 100).toFixed(1)}%
                              <span className={`ml-4 ${getConfidenceColor(championshipPredictions.constructors_championship.top_prediction.confidence)}`}>
                                ({championshipPredictions.constructors_championship.top_prediction.confidence.toUpperCase()})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {championshipPredictions.constructors_championship.predictions.slice(1, 4).map((pred, idx) => (
                        <div key={pred.constructor_id} className="flex justify-between items-center py-3 px-4 backdrop-blur-lg bg-white/5 rounded-lg border border-white/10">
                          <span className="font-bold text-white text-lg">{idx + 2}. {pred.constructor_name}</span>
                          <span className={`font-black text-lg ${getConfidenceColor(pred.confidence)}`}>
                            {(pred.champion_probability * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">⚠️</div>
                  <p className="text-white font-bold text-xl">Unable to load predictions</p>
                </div>
              )}
            </div>

            {/* Custom Prediction Section */}
            <div className="border-t border-white/20 pt-12">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
                  CUSTOM PREDICTION
                </h2>
                <p className="text-white/70 text-lg font-medium">
                  Make your own championship prediction
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-white">
                      SEASON
                    </label>
                    <select
                      value={selectedSeason}
                      onChange={(e) => setSelectedSeason(Number(e.target.value))}
                      className="w-full px-6 py-4 backdrop-blur-lg bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white font-medium text-lg transition-all"
                      required
                    >
                      {seasons.map((season) => (
                        <option key={season} value={season} className="bg-black text-white font-medium">
                          {season}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-white">
                      DRIVER
                    </label>
                    <Select
                      value={selectedDriver}
                      onChange={setSelectedDriver}
                      options={drivers.map(driver => ({ value: driver.driverId, label: driver.name }))}
                      placeholder="Select driver..."
                      className="text-lg"
                      styles={customSelectStyles}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-white">
                      POINTS
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value))}
                      className="w-full px-6 py-4 backdrop-blur-lg bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white font-medium text-lg transition-all placeholder-white/50"
                      placeholder="Enter points"
                      required
                    />
                  </div>
                </div>

                <div className="text-center pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-12 py-5 rounded-xl hover:from-yellow-600 hover:to-yellow-800 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed font-black text-xl transition-all transform hover:scale-105 shadow-lg shadow-yellow-600/50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                        PREDICTING...
                      </span>
                    ) : (
                      'PREDICT CHAMPION'
                    )}
                  </button>
                </div>
              </form>

              {/* Error Message */}
              {error && (
                <div className="mt-10 p-6 backdrop-blur-lg bg-red-500/20 border border-red-500/50 text-white rounded-xl">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">⚠️</div>
                    <p className="font-bold text-lg">{error}</p>
                  </div>
                </div>
              )}

              {/* Prediction Results */}
              {result && (
                <div className="mt-10 p-8 backdrop-blur-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/50">
                  <div className="text-center mb-8">
                    <h2 className="text-4xl font-black text-white mb-2 tracking-tight">RESULTS</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-white mx-auto rounded-full"></div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-4 px-6 backdrop-blur-lg bg-white/10 rounded-xl border border-white/20">
                      <span className="font-bold text-white text-xl tracking-tight">CHAMPION</span>
                      <span className="font-black text-3xl text-white">
                        {result.driver_name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-4 px-6 backdrop-blur-lg bg-white/10 rounded-xl border border-white/20">
                      <span className="font-bold text-white text-xl tracking-tight">PROBABILITY</span>
                      <span className="font-black text-3xl text-white">
                        {(result.champion_probability * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-4 px-6 backdrop-blur-lg bg-white/10 rounded-xl border border-white/20">
                      <span className="font-bold text-white text-xl tracking-tight">CONFIDENCE</span>
                      <span className={`font-black text-3xl ${getConfidenceColor(result.confidence)}`}>
                        {result.confidence.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}