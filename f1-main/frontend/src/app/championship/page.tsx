'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Select from 'react-select';

// Component Interfaces
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
  // State hooks
  const [championshipPredictions, setChampionshipPredictions] = useState<ChampionshipPredictions | null>(null);
  const [loadingChampionship, setLoadingChampionship] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedChampionshipYear, setSelectedChampionshipYear] = useState<number>(2030);

  useEffect(() => {
    // We only fetch the main predictions, as the custom form was removed.
    fetchChampionshipPredictions();
  }, []); // Note: Removed dependency on selectedChampionshipYear to fetch on load

  const fetchChampionshipPredictions = async () => {
    setLoadingChampionship(true);
    setError(''); // Clear previous errors
    try {
      const response = await axios.get(`http://localhost:8000/predict/${selectedChampionshipYear}/championships`);
      setChampionshipPredictions(response.data);
    } catch (err) {
      setError(`Failed to load ${selectedChampionshipYear} predictions`);
      setChampionshipPredictions(null); // Clear data on error
    } finally {
      setLoadingChampionship(false);
    }
  };

  // Handler for the "Get Predictions" button
  const handleFetchClick = () => {
    fetchChampionshipPredictions();
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
    // Uses the new --background from globals.css
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-neutral-800 hover:text-red-600 font-semibold text-lg transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Main Content Card */}
          <div className="f1-card p-10">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
                Championship Prediction
              </h1>
              {/* F1 Red Underline */}
              <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
            </div>

            {/* Championship Predictions */}
            <div className="mb-16 p-10 bg-gray-50 rounded-2xl border-2 border-gray-200 shadow-inner">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-neutral-900 mb-3">
                  {selectedChampionshipYear} Championship Predictions
                </h2>
                <p className="text-neutral-700 text-lg font-medium">
                  AI-powered predictions for the selected season
                </p>

                {/* Year Selection */}
                <div className="mt-6 mb-4">
                  <label className="block text-lg font-bold text-neutral-900 mb-3">
                    Select Championship Year
                  </label>
                  <select
                    value={selectedChampionshipYear}
                    onChange={(e) => {
                      setSelectedChampionshipYear(Number(e.target.value));
                      setChampionshipPredictions(null); // Clear current predictions
                    }}
                    className="f1-input max-w-xs inline-block" // Use new input style
                  >
                    {[2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                      <option key={year} value={year} className="text-neutral-900 font-medium">
                        {year}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleFetchClick} // Use new handler
                    disabled={loadingChampionship}
                    className="f1-button-primary ml-4" // Use new button style
                  >
                    {loadingChampionship ? 'Loading...' : 'Get Predictions'}
                  </button>
                </div>
              </div>
              
              {/* Error Message */}
              {error && !loadingChampionship && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">⚠️</div>
                  <p className="text-red-700 font-semibold text-xl">{error}</p>
                </div>
              )}

              {loadingChampionship ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-red-600 border-t-transparent mx-auto mb-6"></div>
                  <p className="text-neutral-800 font-semibold text-xl">Analyzing championship data...</p>
                </div>
              ) : championshipPredictions ? (
                <div className="grid xl:grid-cols-2 gap-10">
                  {/* World Drivers' Championship */}
                  <div className="bg-white p-8 rounded-xl shadow-md border-2 border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-xl">🏎️</span>
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-900">
                        World Drivers' Championship
                      </h3>
                    </div>

                    {championshipPredictions.world_drivers_championship.top_prediction && (
                      <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200">
                        <div className="flex items-center mb-3">
                          <span className="text-3xl mr-3">🥇</span>
                          <div>
                            <div className="font-bold text-2xl text-neutral-900">
                              {championshipPredictions.world_drivers_championship.top_prediction.driver_name}
                            </div>
                            <div className="text-neutral-800 font-semibold text-lg">
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
                          <span className="font-semibold text-neutral-800 text-lg">{idx + 2}. {pred.driver_name}</span>
                          <span className={`font-bold text-lg ${getConfidenceColor(pred.confidence)}`}>
                            {(pred.champion_probability * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Constructors' Championship */}
                  <div className="bg-white p-8 rounded-xl shadow-md border-2 border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-xl">🏭</span>
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-900">
                        Constructors' Championship
                      </h3>
                    </div>

                    {championshipPredictions.constructors_championship.top_prediction && (
                      <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200">
                        <div className="flex items-center mb-3">
                          <span className="text-3xl mr-3">🥇</span>
                          <div>
                            <div className="font-bold text-2xl text-neutral-900">
                              {championshipPredictions.constructors_championship.top_prediction.constructor_name}
                            </div>
                            <div className="text-neutral-800 font-semibold text-lg">
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
                          <span className="font-semibold text-neutral-800 text-lg">{idx + 2}. {pred.constructor_name}</span>
                          <span className={`font-bold text-lg ${getConfidenceColor(pred.confidence)}`}>
                            {(pred.champion_probability * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Show this if there's no loading, no error, and no data
                // This state is hit if the page loads and fetchChampionshipPredictions hasn't run or completed
                !error && !loadingChampionship && (
                  <div className="text-center py-16">
                    <p className="text-neutral-600 font-semibold text-xl">Select a year and click "Get Predictions" to begin.</p>
                  </div>
                )
              )}
            </div>

            {/* Custom Prediction Section has been removed as per previous request */}
            
          </div>
        </div>
      </div>
    </div>
  );
}