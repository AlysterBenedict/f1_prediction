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
        borderColor: 'rgba(220, 38, 38, 0.5)'
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
      backgroundColor: state.isSelected ? 'rgba(220, 38, 38, 0.8)' : state.isFocused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      color: 'white',
      fontWeight: '500',
      '&:hover': {
        backgroundColor: 'rgba(220, 38, 38, 0.5)'
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
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-600 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
      </div>

      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1920&h=1080&fit=crop')"
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-white hover:text-red-500 font-bold text-lg transition-colors group">
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
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/50">
                  <span className="text-white text-4xl">🏆</span>
                </div>
              </div>
              <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">
                PODIUM PREDICTION
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-red-600 to-white mx-auto rounded-full"></div>
            </div>

            {/* Prediction Form */}
            <div className="mb-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
                  RACE PREDICTION TOOL
                </h2>
                <p className="text-white/70 text-lg font-medium">
                  Predict podium finishes based on driver, team, and grid position
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid lg:grid-cols-3 gap-6">
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
                      CONSTRUCTOR
                    </label>
                    <Select
                      value={selectedConstructor}
                      onChange={setSelectedConstructor}
                      options={constructors.map(constructor => ({ value: constructor.constructorId, label: constructor.name }))}
                      placeholder="Select team..."
                      className="text-lg"
                      styles={customSelectStyles}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-lg font-bold text-white">
                      GRID POSITION
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={gridPosition}
                      onChange={(e) => setGridPosition(Number(e.target.value))}
                      className="w-full px-6 py-4 backdrop-blur-lg bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white font-medium text-lg transition-all placeholder-white/50"
                      placeholder="1-20"
                      required
                    />
                  </div>
                </div>

                <div className="text-center pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-red-600 to-red-800 text-white px-12 py-5 rounded-xl hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-4 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed font-black text-xl transition-all transform hover:scale-105 shadow-lg shadow-red-600/50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                        ANALYZING...
                      </span>
                    ) : (
                      'PREDICT PODIUM FINISH'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-6 backdrop-blur-lg bg-red-500/20 border border-red-500/50 text-white rounded-xl">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">⚠️</div>
                  <p className="font-bold text-lg">{error}</p>
                </div>
              </div>
            )}

            {/* Prediction Results */}
            {result && (
              <div className="p-8 backdrop-blur-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/50">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-black text-white mb-2 tracking-tight">PREDICTION RESULTS</h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-white mx-auto rounded-full"></div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 px-6 backdrop-blur-lg bg-white/10 rounded-xl border border-white/20">
                    <span className="font-bold text-white text-xl tracking-tight">PODIUM FINISH</span>
                    <span className={`font-black text-3xl ${result.prediction === 1 ? 'text-green-400' : 'text-red-400'}`}>
                      {result.prediction === 1 ? 'YES ✓' : 'NO ✗'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-4 px-6 backdrop-blur-lg bg-white/10 rounded-xl border border-white/20">
                    <span className="font-bold text-white text-xl tracking-tight">PROBABILITY</span>
                    <div className="text-right">
                      <span className="font-black text-3xl text-white">
                        {(result.podium_probability * 100).toFixed(1)}%
                      </span>
                      <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                        <div 
                          className="bg-gradient-to-r from-red-600 to-red-400 h-2 rounded-full transition-all duration-1000"
                          style={{width: `${result.podium_probability * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-4 px-6 backdrop-blur-lg bg-white/10 rounded-xl border border-white/20">
                    <span className="font-bold text-white text-xl tracking-tight">CONFIDENCE</span>
                    <span className={`font-black text-3xl ${
                      result.confidence === 'high' ? 'text-green-400' : 
                      result.confidence === 'medium' ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
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
  );
}