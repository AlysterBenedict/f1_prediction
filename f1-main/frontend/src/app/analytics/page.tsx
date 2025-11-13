'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Select from 'react-select';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface DriverPerformance {
  year: number;
  driverId: number;
  forename: string;
  surname: string;
  points: number;
  driver_name: string;
}

interface TeamStanding {
  year: number;
  constructorId: number;
  name: string;
  points: number;
}

interface PodiumData {
  year: number;
  driverId: number;
  forename: string;
  surname: string;
  podiums: number;
  driver_name: string;
}

interface DriverOption {
  value: number;
  label: string;
}

interface TeamOption {
  value: number;
  label: string;
}

interface PredictionData {
  driver_name?: string;
  constructor_name?: string;
  predictions: {
    points: number;
    podium_probability?: number;
    championship_probability: number;
  };
  confidence: string;
  based_on_races?: number;
  based_on_seasons?: number;
  note?: string;
}

export default function AnalyticsDashboard() {
  const router = useRouter();

  const [driverPerformance, setDriverPerformance] = useState<DriverPerformance[]>([]);
  const [teamStandings, setTeamStandings] = useState<TeamStanding[]>([]);
  const [podiumData, setPodiumData] = useState<PodiumData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Filter states
  const [selectedDriver, setSelectedDriver] = useState<DriverOption | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamOption | null>(null);
  const [drivers, setDrivers] = useState<DriverOption[]>([]);
  const [teams, setTeams] = useState<TeamOption[]>([]);

  // Prediction states
  const [predictions, setPredictions] = useState<PredictionData | null>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);

  // Real-time update states
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);


  useEffect(() => {
    fetchAnalyticsData();
    fetchDriversAndTeams();
  }, []);

  useEffect(() => {
    if (selectedDriver) {
      fetchFilteredData('driver', selectedDriver.value);
      fetchPredictions('driver', selectedDriver.value);
    } else if (selectedTeam) {
      fetchFilteredData('team', selectedTeam.value);
      fetchPredictions('constructor', selectedTeam.value);
    } else {
      fetchAnalyticsData();
      setPredictions(null);
    }
  }, [selectedDriver, selectedTeam]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (selectedDriver) {
        fetchFilteredData('driver', selectedDriver.value);
      } else if (selectedTeam) {
        fetchFilteredData('team', selectedTeam.value);
      } else {
        fetchAnalyticsData();
      }
      setLastUpdated(new Date());
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [autoRefresh, selectedDriver, selectedTeam]);

  const fetchAnalyticsData = async () => {
    try {
      const [driversRes, teamsRes, podiumsRes] = await Promise.all([
        axios.get('http://localhost:8000/analytics/drivers'),
        axios.get('http://localhost:8000/analytics/teams'),
        axios.get('http://localhost:8000/analytics/podiums')
      ]);

      setDriverPerformance(driversRes.data);
      setTeamStandings(teamsRes.data);
      setPodiumData(podiumsRes.data);
    } catch (err) {
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDriversAndTeams = async () => {
    try {
      const [driversRes, teamsRes] = await Promise.all([
        axios.get('http://localhost:8000/drivers'),
        axios.get('http://localhost:8000/constructors')
      ]);

      const driverOptions = driversRes.data.map((driver: any) => ({
        value: driver.driverId,
        label: driver.name
      }));

      const teamOptions = teamsRes.data.map((team: any) => ({
        value: team.constructorId,
        label: team.name
      }));

      setDrivers(driverOptions);
      setTeams(teamOptions);
    } catch (err) {
      console.error('Failed to load drivers and teams:', err);
    }
  };

  const fetchFilteredData = async (type: 'driver' | 'team', id: number) => {
    try {
      setLoading(true);
      if (type === 'driver') {
        const [driversRes, podiumsRes] = await Promise.all([
          axios.get(`http://localhost:8000/analytics/drivers?driverId=${id}`),
          axios.get(`http://localhost:8000/analytics/podiums?driverId=${id}`)
        ]);
        setDriverPerformance(driversRes.data);
        setPodiumData(podiumsRes.data);
        setTeamStandings([]);
      } else {
        const teamsRes = await axios.get(`http://localhost:8000/analytics/teams?constructorId=${id}`);
        setTeamStandings(teamsRes.data);
        setDriverPerformance([]);
        setPodiumData([]);
      }
    } catch (err) {
      setError('Failed to load filtered data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPredictions = async (type: 'driver' | 'constructor', id: number) => {
    try {
      setPredictionLoading(true);
      const currentYear = new Date().getFullYear();
      const response = await axios.get(`http://localhost:8000/predict/${type}/${id}/${currentYear + 1}`);
      setPredictions(response.data);
    } catch (err) {
      console.error('Failed to load predictions:', err);
      setPredictions(null);
    } finally {
      setPredictionLoading(false);
    }
  };

  const handleDriverChange = (option: DriverOption | null) => {
    setSelectedDriver(option);
    setSelectedTeam(null);
  };

  const handleTeamChange = (option: TeamOption | null) => {
    setSelectedTeam(option);
    setSelectedDriver(null);
  };

  const handleRefresh = () => {
    if (selectedDriver) {
      fetchFilteredData('driver', selectedDriver.value);
      fetchPredictions('driver', selectedDriver.value);
    } else if (selectedTeam) {
      fetchFilteredData('team', selectedTeam.value);
      fetchPredictions('constructor', selectedTeam.value);
    } else {
      fetchAnalyticsData();
    }
    setLastUpdated(new Date());
  };

  // Prepare driver performance chart data
  const driverChartData = {
    labels: selectedDriver
      ? driverPerformance.map(d => d.year).sort()
      : [...new Set(driverPerformance.map(d => d.year))].sort(),
    datasets: [
      {
        label: selectedDriver ? `${selectedDriver.label} - Points per Race` : 'Average Points per Race',
        data: selectedDriver
          ? driverPerformance
              .sort((a, b) => a.year - b.year)
              .map(d => d.points)
          : [...new Set(driverPerformance.map(d => d.year))].sort().map(year =>
              driverPerformance
                .filter(d => d.year === year)
                .reduce((sum, d) => sum + d.points, 0) /
              driverPerformance.filter(d => d.year === year).length
            ),
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(0, 0, 0)',
        pointBorderColor: 'rgb(0, 0, 0)',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  // Prepare team standings chart data
  const teamChartData = {
    labels: selectedTeam
      ? teamStandings.map(t => t.year).sort()
      : [...new Set(teamStandings.map(t => t.year))].sort(),
    datasets: [
      {
        label: selectedTeam ? `${selectedTeam.label} - Total Points` : 'Total Constructor Points',
        data: selectedTeam
          ? teamStandings
              .sort((a, b) => a.year - b.year)
              .map(t => t.points)
          : [...new Set(teamStandings.map(t => t.year))].sort().map(year =>
              teamStandings
                .filter(t => t.year === year)
                .reduce((sum, t) => sum + t.points, 0)
            ),
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  // Prepare podium frequency chart data
  const podiumChartData = {
    labels: selectedDriver
      ? podiumData.map(p => p.year).sort()
      : [...new Set(podiumData.map(p => p.year))].sort(),
    datasets: [
      {
        label: selectedDriver ? `${selectedDriver.label} - Podium Finishes` : 'Total Podium Finishes',
        data: selectedDriver
          ? podiumData
              .sort((a, b) => a.year - b.year)
              .map(p => p.podiums)
          : [...new Set(podiumData.map(p => p.year))].sort().map(year =>
              podiumData
                .filter(p => p.year === year)
                .reduce((sum, p) => sum + p.podiums, 0)
            ),
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-black border-t-transparent mx-auto mb-6"></div>
          <p className="text-black font-semibold text-xl">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-black font-bold text-xl mb-6">{error}</p>
          <Link href="/" className="inline-flex items-center bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 font-bold text-lg transition-all">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-black hover:text-gray-700 font-semibold text-lg transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Filters Section */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-300">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-black mb-2">
                  Filter by Driver
                </label>
                <Select
                  value={selectedDriver}
                  onChange={handleDriverChange}
                  options={drivers}
                  isClearable
                  placeholder="Search and select a driver..."
                  className="text-black"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#d1d5db',
                      '&:hover': { borderColor: '#9ca3af' },
                      boxShadow: 'none',
                      borderRadius: '0.5rem'
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected ? '#000' : state.isFocused ? '#f3f4f6' : 'white',
                      color: state.isSelected ? 'white' : 'black'
                    })
                  }}
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-semibold text-black mb-2">
                  Filter by Team
                </label>
                <Select
                  value={selectedTeam}
                  onChange={handleTeamChange}
                  options={teams}
                  isClearable
                  placeholder="Search and select a team..."
                  className="text-black"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#d1d5db',
                      '&:hover': { borderColor: '#9ca3af' },
                      boxShadow: 'none',
                      borderRadius: '0.5rem'
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected ? '#000' : state.isFocused ? '#f3f4f6' : 'white',
                      color: state.isSelected ? 'white' : 'black'
                    })
                  }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    autoRefresh
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-black hover:bg-gray-400'
                  }`}
                >
                  Auto: {autoRefresh ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-300">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-black mb-4 tracking-tight">
                F1 Analytics Dashboard
              </h1>
              <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
            </div>

            {/* Predictions Section */}
            {(predictions && !predictionLoading) && (
              <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-lg">🔮</span>
                  </div>
                  <h3 className="text-xl font-bold text-blue-900">
                    {predictions.driver_name || predictions.constructor_name} - {new Date().getFullYear() + 1} Predictions
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-blue-300">
                    <div className="text-sm text-blue-600 font-semibold">Predicted Points</div>
                    <div className="text-2xl font-bold text-blue-900">{predictions.predictions.points}</div>
                  </div>

                  {predictions.predictions.podium_probability && (
                    <div className="bg-white p-4 rounded-lg border border-blue-300">
                      <div className="text-sm text-blue-600 font-semibold">Podium Probability</div>
                      <div className="text-2xl font-bold text-blue-900">{(predictions.predictions.podium_probability * 100).toFixed(1)}%</div>
                    </div>
                  )}

                  <div className="bg-white p-4 rounded-lg border border-blue-300">
                    <div className="text-sm text-blue-600 font-semibold">Championship Probability</div>
                    <div className="text-2xl font-bold text-blue-900">{(predictions.predictions.championship_probability * 100).toFixed(1)}%</div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-blue-700">
                  Confidence: <span className={`font-semibold ${
                    predictions.confidence === 'high' ? 'text-green-600' :
                    predictions.confidence === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {predictions.confidence.toUpperCase()}
                  </span>
                  {predictions.based_on_races && ` • Based on ${predictions.based_on_races} recent races`}
                  {predictions.based_on_seasons && ` • Based on ${predictions.based_on_seasons} recent seasons`}
                </div>
              </div>
            )}

            {predictionLoading && (
              <div className="mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mr-3"></div>
                  <span className="text-gray-700">Loading predictions...</span>
                </div>
              </div>
            )}

            {/* Charts Section */}
            <div className="mb-16 space-y-12">
              {/* Driver Performance Chart */}
              {driverPerformance.length > 0 && (
                <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-300">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl">👤</span>
                    </div>
                    <h2 className="text-3xl font-bold text-black">
                      {selectedDriver ? `${selectedDriver.label} Performance` : 'Driver Performance Trends'}
                    </h2>
                  </div>
                  <div className="h-96">
                    <Line
                      data={driverChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top' as const,
                            labels: {
                              color: 'black',
                              font: {
                                size: 14,
                                weight: 'bold'
                              }
                            }
                          },
                          title: {
                            display: true,
                            text: selectedDriver ? 'Points per Race by Season' : 'Average Points per Race by Season',
                            color: 'black',
                            font: {
                              size: 18,
                              weight: 'bold'
                            }
                          },
                        },
                        scales: {
                          x: {
                            ticks: {
                              color: 'black',
                              font: {
                                weight: 'bold'
                              }
                            },
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                            }
                          },
                          y: {
                            ticks: {
                              color: 'black',
                              font: {
                                weight: 'bold'
                              }
                            },
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Team Standings Chart */}
              {teamStandings.length > 0 && (
                <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-300">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl">🏭</span>
                    </div>
                    <h2 className="text-3xl font-bold text-black">
                      {selectedTeam ? `${selectedTeam.label} Performance` : 'Constructor Performance'}
                    </h2>
                  </div>
                  <div className="h-96">
                    <Bar
                      data={teamChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top' as const,
                            labels: {
                              color: 'black',
                              font: {
                                size: 14,
                                weight: 'bold'
                              }
                            }
                          },
                          title: {
                            display: true,
                            text: selectedTeam ? 'Total Points by Season' : 'Total Constructor Points by Season',
                            color: 'black',
                            font: {
                              size: 18,
                              weight: 'bold'
                            }
                          },
                        },
                        scales: {
                          x: {
                            ticks: {
                              color: 'black',
                              font: {
                                weight: 'bold'
                              }
                            },
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                            }
                          },
                          y: {
                            ticks: {
                              color: 'black',
                              font: {
                                weight: 'bold'
                              }
                            },
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Podium Frequency Chart */}
              {podiumData.length > 0 && (
                <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-300">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl">🏆</span>
                    </div>
                    <h2 className="text-3xl font-bold text-black">
                      {selectedDriver ? `${selectedDriver.label} Podium Achievements` : 'Podium Achievements'}
                    </h2>
                  </div>
                  <div className="h-96">
                    <Bar
                      data={podiumChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top' as const,
                            labels: {
                              color: 'black',
                              font: {
                                size: 14,
                                weight: 'bold'
                              }
                            }
                          },
                          title: {
                            display: true,
                            text: selectedDriver ? 'Podium Finishes by Season' : 'Total Podium Finishes by Season',
                            color: 'black',
                            font: {
                              size: 18,
                              weight: 'bold'
                            }
                          },
                        },
                        scales: {
                          x: {
                            ticks: {
                              color: 'black',
                              font: {
                                weight: 'bold'
                              }
                            },
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                            }
                          },
                          y: {
                            ticks: {
                              color: 'black',
                              font: {
                                weight: 'bold'
                              }
                            },
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Data Tables */}
            <div className="grid xl:grid-cols-3 gap-8">
              {/* Top Drivers */}
              {!selectedTeam && driverPerformance.length > 0 && (
                <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-300">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-lg">🏎️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-black">
                      {selectedDriver ? 'Driver Performance' : 'Top Drivers'}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {selectedDriver
                      ? driverPerformance
                          .sort((a, b) => b.year - a.year)
                          .slice(0, 5)
                          .map((driver, index) => (
                            <div key={index} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                              <span className="font-semibold text-black text-lg">{driver.year}</span>
                              <span className="font-bold text-black text-lg">{driver.points.toFixed(1)} pts</span>
                            </div>
                          ))
                      : driverPerformance
                          .sort((a, b) => b.points - a.points)
                          .slice(0, 5)
                          .map((driver, index) => (
                            <div key={index} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                              <span className="font-semibold text-black text-lg">{index + 1}. {driver.driver_name}</span>
                              <span className="font-bold text-black text-lg">{driver.points.toFixed(1)} pts</span>
                            </div>
                          ))
                    }
                  </div>
                </div>
              )}

              {/* Top Teams */}
              {!selectedDriver && teamStandings.length > 0 && (
                <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-300">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-lg">🏭</span>
                    </div>
                    <h3 className="text-2xl font-bold text-black">
                      {selectedTeam ? 'Team Performance' : 'Top Teams'}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {selectedTeam
                      ? teamStandings
                          .sort((a, b) => b.year - a.year)
                          .slice(0, 5)
                          .map((team, index) => (
                            <div key={index} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                              <span className="font-semibold text-black text-lg">{team.year}</span>
                              <span className="font-bold text-black text-lg">{team.points} pts</span>
                            </div>
                          ))
                      : teamStandings
                          .sort((a, b) => b.points - a.points)
                          .slice(0, 5)
                          .map((team, index) => (
                            <div key={index} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                              <span className="font-semibold text-black text-lg">{index + 1}. {team.name}</span>
                              <span className="font-bold text-black text-lg">{team.points} pts</span>
                            </div>
                          ))
                    }
                  </div>
                </div>
              )}

              {/* Most Podiums */}
              {!selectedTeam && podiumData.length > 0 && (
                <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-300">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-lg">🏆</span>
                    </div>
                    <h3 className="text-2xl font-bold text-black">
                      {selectedDriver ? 'Driver Podiums' : 'Most Podiums'}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {selectedDriver
                      ? podiumData
                          .sort((a, b) => b.year - a.year)
                          .slice(0, 5)
                          .map((driver, index) => (
                            <div key={index} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                              <span className="font-semibold text-black text-lg">{driver.year}</span>
                              <span className="font-bold text-black text-lg">{driver.podiums} podiums</span>
                            </div>
                          ))
                      : podiumData
                          .sort((a, b) => b.podiums - a.podiums)
                          .slice(0, 5)
                          .map((driver, index) => (
                            <div key={index} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                              <span className="font-semibold text-black text-lg">{index + 1}. {driver.driver_name}</span>
                              <span className="font-bold text-black text-lg">{driver.podiums} podiums</span>
                            </div>
                          ))
                    }
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