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

  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '0.75rem',
      padding: '0.5rem',
      fontSize: '1rem',
      fontWeight: '500',
      color: 'white',
      minHeight: '3rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'rgba(37, 99, 235, 0.5)'
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
      backgroundColor: state.isSelected ? 'rgba(37, 99, 235, 0.8)' : state.isFocused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      color: 'white',
      fontWeight: '500',
      '&:hover': {
        backgroundColor: 'rgba(37, 99, 235, 0.5)'
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
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(37, 99, 235)',
        pointBorderColor: 'rgb(255, 255, 255)',
        pointBorderWidth: 2,
        pointRadius: 6,
        tension: 0.4,
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
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        borderColor: 'rgb(255, 255, 255)',
        borderWidth: 2,
        borderRadius: 8,
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
        backgroundColor: 'rgba(220, 38, 38, 0.8)',
        borderColor: 'rgb(255, 255, 255)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
          font: {
            size: 14,
            weight: 'bold' as const
          },
          padding: 15
        }
      },
      title: {
        display: false
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            weight: 'bold' as const
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            weight: 'bold' as const
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        }
      }
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl animate-pulse"></div>
          </div>
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
          <p className="text-white font-black text-xl">LOADING ANALYTICS...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="text-center relative z-10">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-white font-black text-xl mb-6">{error}</p>
          <Link href="/" className="inline-flex items-center backdrop-blur-lg bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl hover:bg-white/20 font-black text-lg transition-all">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            BACK TO HOME
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
      </div>

      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1611651338412-8403fa6e3599?w=1920&h=1080&fit=crop')"
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-white hover:text-blue-500 font-bold text-lg transition-colors group">
              <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Filters Section */}
          <div className="mb-8 backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
              <div className="flex-1">
                <label className="block text-sm font-bold text-white mb-2 tracking-wide">
                  FILTER BY DRIVER
                </label>
                <Select
                  value={selectedDriver}
                  onChange={handleDriverChange}
                  options={drivers}
                  isClearable
                  placeholder="Search driver..."
                  className="text-white"
                  styles={customSelectStyles}
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-bold text-white mb-2 tracking-wide">
                  FILTER BY TEAM
                </label>
                <Select
                  value={selectedTeam}
                  onChange={handleTeamChange}
                  options={teams}
                  isClearable
                  placeholder="Search team..."
                  className="text-white"
                  styles={customSelectStyles}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  className="px-5 py-3 backdrop-blur-lg bg-blue-600/80 text-white rounded-xl hover:bg-blue-700 transition-all font-black border border-blue-500/50 shadow-lg shadow-blue-600/30"
                  disabled={loading}
                >
                  {loading ? 'REFRESHING...' : 'REFRESH'}
                </button>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-5 py-3 rounded-xl font-black transition-all border shadow-lg ${
                    autoRefresh
                      ? 'backdrop-blur-lg bg-green-600/80 text-white hover:bg-green-700 border-green-500/50 shadow-green-600/30'
                      : 'backdrop-blur-lg bg-white/10 text-white hover:bg-white/20 border-white/20'
                  }`}
                >
                  AUTO: {autoRefresh ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm text-white/60 font-medium">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>

          {/* Main Content */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-10 border border-white/20">
            {/* Title */}
            <div className="text-center mb-12">
              <div className="inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/50">
                  <span className="text-white text-4xl">📊</span>
                </div>
              </div>
              <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">
                ANALYTICS DASHBOARD
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-white mx-auto rounded-full"></div>
            </div>

            {/* Predictions Section */}
            {(predictions && !predictionLoading) && (
              <div className="mb-8 backdrop-blur-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl p-6 border border-blue-500/50">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-600/50">
                    <span className="text-white text-lg">🔮</span>
                  </div>
                  <h3 className="text-xl font-black text-white">
                    {predictions.driver_name || predictions.constructor_name} - {new Date().getFullYear() + 1} PREDICTIONS
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="backdrop-blur-lg bg-white/10 p-4 rounded-xl border border-white/20">
                    <div className="text-sm text-blue-300 font-bold">PREDICTED POINTS</div>
                    <div className="text-2xl font-black text-white">{predictions.predictions.points}</div>
                  </div>

                  {predictions.predictions.podium_probability && (
                    <div className="backdrop-blur-lg bg-white/10 p-4 rounded-xl border border-white/20">
                      <div className="text-sm text-blue-300 font-bold">PODIUM PROBABILITY</div>
                      <div className="text-2xl font-black text-white">{(predictions.predictions.podium_probability * 100).toFixed(1)}%</div>
                    </div>
                  )}

                  <div className="backdrop-blur-lg bg-white/10 p-4 rounded-xl border border-white/20">
                    <div className="text-sm text-blue-300 font-bold">CHAMPIONSHIP PROB.</div>
                    <div className="text-2xl font-black text-white">{(predictions.predictions.championship_probability * 100).toFixed(1)}%</div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-blue-200 font-medium">
                  Confidence: <span className={`font-black ${
                    predictions.confidence === 'high' ? 'text-green-400' :
                    predictions.confidence === 'medium' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {predictions.confidence.toUpperCase()}
                  </span>
                  {predictions.based_on_races && ` • Based on ${predictions.based_on_races} recent races`}
                  {predictions.based_on_seasons && ` • Based on ${predictions.based_on_seasons} recent seasons`}
                </div>
              </div>
            )}

            {predictionLoading && (
              <div className="mb-8 backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mr-3"></div>
                  <span className="text-white font-bold">Loading predictions...</span>
                </div>
              </div>
            )}

            {/* Charts Section */}
            <div className="mb-16 space-y-8">
              {/* Driver Performance Chart */}
              {driverPerformance.length > 0 && (
                <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/20">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-600/50">
                      <span className="text-white text-xl">👤</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">
                      {selectedDriver ? `${selectedDriver.label.toUpperCase()} PERFORMANCE` : 'DRIVER PERFORMANCE'}
                    </h2>
                  </div>
                  <div className="h-80">
                    <Line
                      data={driverChartData}
                      options={chartOptions}
                    />
                  </div>
                </div>
              )}

              {/* Team Standings Chart */}
              {teamStandings.length > 0 && (
                <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/20">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-600/50">
                      <span className="text-white text-xl">🏭</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">
                      {selectedTeam ? `${selectedTeam.label.toUpperCase()} PERFORMANCE` : 'CONSTRUCTOR PERFORMANCE'}
                    </h2>
                  </div>
                  <div className="h-80">
                    <Bar
                      data={teamChartData}
                      options={chartOptions}
                    />
                  </div>
                </div>
              )}

              {/* Podium Frequency Chart */}
              {podiumData.length > 0 && (
                <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/20">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-red-600/50">
                      <span className="text-white text-xl">🏆</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">
                      {selectedDriver ? `${selectedDriver.label.toUpperCase()} PODIUMS` : 'PODIUM ACHIEVEMENTS'}
                    </h2>
                  </div>
                  <div className="h-80">
                    <Bar
                      data={podiumChartData}
                      options={chartOptions}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Data Tables */}
            <div className="grid xl:grid-cols-3 gap-6">
              {/* Top Drivers */}
              {!selectedTeam && driverPerformance.length > 0 && (
                <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/20">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-600/50">
                      <span className="text-white text-lg">🏎️</span>
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight">
                      {selectedDriver ? 'DRIVER STATS' : 'TOP DRIVERS'}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {selectedDriver
                      ? driverPerformance
                          .sort((a, b) => b.year - a.year)
                          .slice(0, 5)
                          .map((driver, index) => (
                            <div key={index} className="flex justify-between items-center py-3 px-4 backdrop-blur-lg bg-white/5 rounded-lg border border-white/10">
                              <span className="font-bold text-white text-lg">{driver.year}</span>
                              <span className="font-black text-blue-400 text-lg">{driver.points.toFixed(1)} pts</span>
                            </div>
                          ))
                      : driverPerformance
                          .sort((a, b) => b.points - a.points)
                          .slice(0, 5)
                          .map((driver, index) => (
                            <div key={index} className="flex justify-between items-center py-3 px-4 backdrop-blur-lg bg-white/5 rounded-lg border border-white/10">
                              <span className="font-bold text-white text-lg">{index + 1}. {driver.driver_name}</span>
                              <span className="font-black text-blue-400 text-lg">{driver.points.toFixed(1)} pts</span>
                            </div>
                          ))
                    }
                  </div>
                </div>
              )}

              {/* Top Teams */}
              {!selectedDriver && teamStandings.length > 0 && (
                <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/20">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-600/50">
                      <span className="text-white text-lg">🏭</span>
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight">
                      {selectedTeam ? 'TEAM STATS' : 'TOP TEAMS'}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {selectedTeam
                      ? teamStandings
                          .sort((a, b) => b.year - a.year)
                          .slice(0, 5)
                          .map((team, index) => (
                            <div key={index} className="flex justify-between items-center py-3 px-4 backdrop-blur-lg bg-white/5 rounded-lg border border-white/10">
                              <span className="font-bold text-white text-lg">{team.year}</span>
                              <span className="font-black text-blue-400 text-lg">{team.points} pts</span>
                            </div>
                          ))
                      : teamStandings
                          .sort((a, b) => b.points - a.points)
                          .slice(0, 5)
                          .map((team, index) => (
                            <div key={index} className="flex justify-between items-center py-3 px-4 backdrop-blur-lg bg-white/5 rounded-lg border border-white/10">
                              <span className="font-bold text-white text-lg">{index + 1}. {team.name}</span>
                              <span className="font-black text-blue-400 text-lg">{team.points} pts</span>
                            </div>
                          ))
                    }
                  </div>
                </div>
              )}

              {/* Most Podiums */}
              {!selectedTeam && podiumData.length > 0 && (
                <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/20">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-red-600/50">
                      <span className="text-white text-lg">🏆</span>
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight">
                      {selectedDriver ? 'PODIUMS' : 'MOST PODIUMS'}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {selectedDriver
                      ? podiumData
                          .sort((a, b) => b.year - a.year)
                          .slice(0, 5)
                          .map((driver, index) => (
                            <div key={index} className="flex justify-between items-center py-3 px-4 backdrop-blur-lg bg-white/5 rounded-lg border border-white/10">
                              <span className="font-bold text-white text-lg">{driver.year}</span>
                              <span className="font-black text-red-400 text-lg">{driver.podiums} podiums</span>
                            </div>
                          ))
                      : podiumData
                          .sort((a, b) => b.podiums - a.podiums)
                          .slice(0, 5)
                          .map((driver, index) => (
                            <div key={index} className="flex justify-between items-center py-3 px-4 backdrop-blur-lg bg-white/5 rounded-lg border border-white/10">
                              <span className="font-bold text-white text-lg">{index + 1}. {driver.driver_name}</span>
                              <span className="font-black text-red-400 text-lg">{driver.podiums} podiums</span>
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