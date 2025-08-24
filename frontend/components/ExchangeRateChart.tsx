import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ExchangeRateChartProps {
  data: {
    date: string;
    rate: number;
  }[];
  baseCurrency: string;
  targetCurrency: string;
}

const ExchangeRateChart = ({ data, baseCurrency, targetCurrency }: ExchangeRateChartProps) => {
  const chartData = {
    labels: data.map(item => format(new Date(item.date), 'dd MMM')),
    datasets: [
      {
        label: `${baseCurrency} to ${targetCurrency}`,
        data: data.map(item => item.rate),
        borderColor: 'rgb(0, 184, 93)',
        backgroundColor: 'rgba(0, 184, 93, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `1 ${baseCurrency} = ${context.parsed.y.toFixed(2)} ${targetCurrency}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: any) => `${value.toFixed(2)}`,
        },
      },
    },
  };

  return (
    <div className="w-full h-[300px]">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ExchangeRateChart;
