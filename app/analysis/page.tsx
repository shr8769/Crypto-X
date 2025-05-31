"use client";
import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type ChartDataType = ChartData<'line', number[], string>;
type VolumeDataType = ChartData<'bar', number[], string>;

export default function Analysis() {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [timeRange, setTimeRange] = useState('7');
  const [chartData, setChartData] = useState<ChartDataType | null>(null);
  const [volumeData, setVolumeData] = useState<VolumeDataType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, [selectedCoin, timeRange]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${selectedCoin}/market_chart?vs_currency=usd&days=${timeRange}`
      );
      const data = await response.json();
      
      const labels = data.prices.map((price: [number, number]) =>
        new Date(price[0]).toLocaleDateString()
      );
      const prices = data.prices.map((price: [number, number]) => price[1]);
      const volumes = data.total_volumes.map((volume: [number, number]) => volume[1]);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Price (USD)',
            data: prices,
            borderColor: 'rgb(147, 197, 253)',
            backgroundColor: 'rgba(147, 197, 253, 0.1)',
            tension: 0.4,
          },
        ],
      });

      setVolumeData({
        labels,
        datasets: [
          {
            label: 'Volume (USD)',
            data: volumes,
            backgroundColor: 'rgba(196, 181, 253, 0.6)',
            borderColor: 'rgb(196, 181, 253)',
            borderWidth: 2,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
    setLoading(false);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${selectedCoin.toUpperCase()} Price Analysis`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Crypto Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Advanced cryptocurrency analytics and charts
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700"
          >
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="cardano">Cardano</option>
            <option value="polkadot">Polkadot</option>
            <option value="chainlink">Chainlink</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700"
          >
            <option value="1">1 Day</option>
            <option value="7">7 Days</option>
            <option value="30">30 Days</option>
            <option value="90">90 Days</option>
            <option value="365">1 Year</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading analysis...</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {/* Price Chart */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Price Movement
              </h3>
              {chartData && <Line data={chartData} options={chartOptions} />}
            </div>

            {/* Volume Chart */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Trading Volume
              </h3>
              {volumeData && <Bar data={volumeData} options={chartOptions} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
