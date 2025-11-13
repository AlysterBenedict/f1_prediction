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
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-black hover:text-gray-700 font-semibold text-lg transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-300">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-black mb-4 tracking-tight">
                Championship Prediction
              </h1>
              <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
            </div>

            {/* Championship Predictions */}
            <div className="mb-16 p-10 bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl border-2 border-gray-300 shadow-inner">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-black mb-3">
                  {selectedChampionshipYear} Championship Predictions
                </h2>
                <p className="text-black text-lg font-medium">
                  AI-powered predictions for the selected season
                </p>

                {/* Year Selection */}
                <div className="mt-6 mb-4">
                  <label className="block text-lg font-bold text-black mb-3">
                    Select Championship Year
                  </label>
                  <select
                    value={selectedChampionshipYear}
                    onChange={(e) => {
                      setSelectedChampionshipYear(Number(e.target.value));
                      setChampionshipPredictions(null); // Clear current predictions
                    }}
                    className="px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-black focus:border-black bg-white text-black font-medium text-lg transition-all"
                  >
                    {[2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                      <option key={year} value={year} className="text-black font-medium">
                        {year}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={fetchChampionshipPredictions}
                    disabled={loadingChampionship}
                    className="ml-4 bg-black text-white px-6 py-4 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    {loadingChampionship ? 'Loading...' : 'Get Predictions'}
                  </button>
                </div>
              </div>

              {loadingChampionship ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-black border-t-transparent mx-auto mb-6"></div>
                  <p className="text-black font-semibold text-xl">Analyzing championship data...</p>
                </div>
              ) : championshipPredictions ? (
                <div className="grid xl:grid-cols-2 gap-10">
                  {/* World Drivers' Championship */}
                  <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-300 hover:shadow-xl transition-shadow">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-xl">🏎️</span>
                      </div>
                      <h3 className="text-2xl font-bold text-black">
                        World Drivers' Championship
                      </h3>
                    </div>

                    {championshipPredictions.world_drivers_championship.top_prediction && (
                      <div className="mb-8 p-6 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl border-2 border-yellow-300">
                        <div className="flex items-center mb-3">
                          <span className="text-3xl mr-3">🥇</span>
                          <div>
                            <div className="font-bold text-2xl text-black">
                              {championshipPredictions.world_drivers_championship.top_prediction.driver_name}
                            </div>
                            <div className="text-black font-semibold text-lg">
                              Probability: {(championshipPredictions.world_drivers_championship.top_prediction.champion_probability * 100).toFixed(1)}%
                              <span className={`ml-4 font-bold ${getConfidenceColor(championshipPredictions.world_drivers_championship.top_prediction.confidence)}`}>
                                ({championshipPredictions.world_drivers_championship.top_prediction.confidence})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {championshipPredictions.world_drivers_championship.predictions.slice(1, 4).map((pred, idx) => (
                        <div key={pred.driver_id} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="font-semibold text-black text-lg">{idx + 2}. {pred.driver_name}</span>
                          <span className={`font-bold text-lg ${getConfidenceColor(pred.confidence)}`}>
                            {(pred.champion_probability * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Constructors' Championship */}
                  <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-300 hover:shadow-xl transition-shadow">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-xl">🏭</span>
                      </div>
                      <h3 className="text-2xl font-bold text-black">
                        Constructors' Championship
                      </h3>
                    </div>

                    {championshipPredictions.constructors_championship.top_prediction && (
                      <div className="mb-8 p-6 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl border-2 border-yellow-300">
                        <div className="flex items-center mb-3">
                          <span className="text-3xl mr-3">🥇</span>
                          <div>
                            <div className="font-bold text-2xl text-black">
                              {championshipPredictions.constructors_championship.top_prediction.constructor_name}
                            </div>
                            <div className="text-black font-semibold text-lg">
                              Probability: {(championshipPredictions.constructors_championship.top_prediction.champion_probability * 100).toFixed(1)}%
                              <span className={`ml-4 font-bold ${getConfidenceColor(championshipPredictions.constructors_championship.top_prediction.confidence)}`}>
                                ({championshipPredictions.constructors_championship.top_prediction.confidence})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {championshipPredictions.constructors_championship.predictions.slice(1, 4).map((pred, idx) => (
                        <div key={pred.constructor_id} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="font-semibold text-black text-lg">{idx + 2}. {pred.constructor_name}</span>
                          <span className={`font-bold text-lg ${getConfidenceColor(pred.confidence)}`}>
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
                  <p className="text-black font-semibold text-xl">Unable to load 2025 predictions</p>
                </div>
              )}
            </div>

            {/* Custom Prediction Section */}
            <div className="border-t-2 border-gray-300 pt-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-black mb-3">
                  Custom Prediction
                </h2>
                <p className="text-black text-lg font-medium">
                  Make your own championship prediction
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-black">
                      Season
                    </label>
                    <select
                      value={selectedSeason}
                      onChange={(e) => setSelectedSeason(Number(e.target.value))}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-black focus:border-black bg-white text-black font-medium text-lg transition-all"
                      required
                    >
                      {seasons.map((season) => (
                        <option key={season} value={season} className="text-black font-medium">
                          {season}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-black">
                      Driver
                    </label>
                    <Select
                      value={selectedDriver}
                      onChange={setSelectedDriver}
                      options={drivers.map(driver => ({ value: driver.driverId, label: driver.name }))}
                      placeholder="Search and select a driver..."
                      className="text-lg"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          border: '2px solid #d1d5db',
                          borderRadius: '0.75rem',
                          padding: '0.5rem',
                          fontSize: '1.125rem',
                          fontWeight: '500',
                          backgroundColor: 'white',
                          color: 'black',
                          minHeight: '3.5rem'
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected ? '#000000' : state.isFocused ? '#f3f4f6' : 'white',
                          color: state.isSelected ? 'white' : 'black',
                          fontWeight: '500'
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: 'black'
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: '#6b7280'
                        })
                      }}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-black">
                      Current Points
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value))}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-black focus:border-black bg-white text-black font-medium text-lg transition-all"
                      placeholder="Enter points"
                      required
                    />
                  </div>
                </div>

                <div className="text-center pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-12 py-5 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl transition-all transform hover:scale-105 shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                        Predicting...
                      </span>
                    ) : (
                      'Predict Championship Winner'
                    )}
                  </button>
                </div>
              </form>

              {/* Error Message */}
              {error && (
                <div className="mt-10 p-8 bg-red-50 border-2 border-red-300 text-red-900 rounded-xl">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">❌</div>
                    <p className="font-bold text-xl">{error}</p>
                  </div>
                </div>
              )}

              {/* Prediction Results */}
              {result && (
                <div className="mt-10 p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-black mb-2">Prediction Results</h2>
                    <div className="w-16 h-1 bg-black mx-auto rounded-full"></div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-4 px-6 bg-white rounded-lg border-2 border-gray-300 shadow-sm">
                      <span className="font-bold text-black text-xl">Predicted Champion:</span>
                      <span className="font-black text-2xl text-black">
                        {result.driver_name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-4 px-6 bg-white rounded-lg border-2 border-gray-300 shadow-sm">
                      <span className="font-bold text-black text-xl">Championship Probability:</span>
                      <span className="font-black text-2xl text-black">
                        {(result.champion_probability * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-4 px-6 bg-white rounded-lg border-2 border-gray-300 shadow-sm">
                      <span className="font-bold text-black text-xl">Confidence Level:</span>
                      <span className={`font-black text-2xl ${getConfidenceColor(result.confidence)}`}>
                        {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)}
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