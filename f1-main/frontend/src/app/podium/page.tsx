'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Select from 'react-select';

interface Driver {
  driverId: number;
  name: string;
}

interface Constructor {
  constructorId: number;
  name: string;
}

interface PredictionResult {
  prediction: number;
  podium_probability: number;
  confidence: string;
}

export default function PodiumPrediction() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<{value: number, label: string} | null>(null);
  const [selectedConstructor, setSelectedConstructor] = useState<{value: number, label: string} | null>(null);
  const [gridPosition, setGridPosition] = useState<number>(1);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchDrivers();
    fetchConstructors();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/drivers');
      setDrivers(response.data);
    } catch (err) {
      setError('Failed to load drivers');
    }
  };

  const fetchConstructors = async () => {
    try {
      const response = await axios.get('http://localhost:8000/constructors');
      setConstructors(response.data);
    } catch (err) {
      setError('Failed to load constructors');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    if (!selectedDriver || !selectedConstructor) {
      setError('Please select both a driver and constructor.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/predict/podium', {
        driverId: selectedDriver.value,
        constructorId: selectedConstructor.value,
        grid: gridPosition
      });
      setResult(response.data);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
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
                Podium Prediction
              </h1>
              <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
            </div>

            {/* Prediction Form */}
            <div className="mb-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-black mb-3">
                  Race Prediction Tool
                </h2>
                <p className="text-black text-lg font-medium">
                  Predict podium finishes based on driver, team, and grid position
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid lg:grid-cols-3 gap-8">
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
                      Constructor/Team
                    </label>
                    <Select
                      value={selectedConstructor}
                      onChange={setSelectedConstructor}
                      options={constructors.map(constructor => ({ value: constructor.constructorId, label: constructor.name }))}
                      placeholder="Search and select a constructor..."
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
                      Grid Position
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={gridPosition}
                      onChange={(e) => setGridPosition(Number(e.target.value))}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-black focus:border-black bg-white text-black font-medium text-lg transition-all"
                      placeholder="Enter grid position"
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
                      'Predict Podium Finish'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-8 bg-red-50 border-2 border-red-300 text-red-900 rounded-xl">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">❌</div>
                  <p className="font-bold text-xl">{error}</p>
                </div>
              </div>
            )}

            {/* Prediction Results */}
            {result && (
              <div className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-black mb-2">Prediction Results</h2>
                  <div className="w-16 h-1 bg-black mx-auto rounded-full"></div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 px-6 bg-white rounded-lg border-2 border-gray-300 shadow-sm">
                    <span className="font-bold text-black text-xl">Podium Finish:</span>
                    <span className={`font-black text-2xl ${result.prediction === 1 ? 'text-green-700' : 'text-red-700'}`}>
                      {result.prediction === 1 ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-4 px-6 bg-white rounded-lg border-2 border-gray-300 shadow-sm">
                    <span className="font-bold text-black text-xl">Podium Probability:</span>
                    <span className="font-black text-2xl text-black">
                      {(result.podium_probability * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-4 px-6 bg-white rounded-lg border-2 border-gray-300 shadow-sm">
                    <span className="font-bold text-black text-xl">Confidence Level:</span>
                    <span className={`font-black text-2xl ${result.confidence === 'high' ? 'text-green-700' : result.confidence === 'medium' ? 'text-yellow-700' : 'text-red-700'}`}>
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
  );
}