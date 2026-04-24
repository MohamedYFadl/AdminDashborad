import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import type { RevenueDataPoint } from '../../models';

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler,
);

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#f8fafc',
      bodyColor: '#94a3b8',
      padding: 12,
      cornerRadius: 10,
      callbacks: {
        label: (ctx: { parsed: { y: number }; dataset: { label?: string } }) =>
          ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#94a3b8', font: { size: 11 } },
    },
    y: {
      grid: { color: '#f1f5f9' },
      border: { display: false, dash: [4, 4] },
      ticks: {
        color: '#94a3b8',
        font: { size: 11 },
        callback: (v: string | number) => `$${Number(v) >= 1000 ? (Number(v)/1000).toFixed(0)+'k' : v}`,
      },
    },
  },
};

interface RevenueChartProps {
  data: RevenueDataPoint[];
  type?: 'bar' | 'line';
}

export function RevenueChart({ data, type = 'bar' }: RevenueChartProps) {
  const labels   = data.map(d => d.label);
  const datasets = [
    {
      label:           'Revenue',
      data:            data.map(d => d.revenue),
      backgroundColor: type === 'bar'
        ? 'rgba(99,102,241,0.85)'
        : 'rgba(99,102,241,0.1)',
      borderColor:     '#6366f1',
      borderWidth:     type === 'bar' ? 0 : 2.5,
      borderRadius:    type === 'bar' ? 6 : 0,
      tension:         0.4,
      fill:            type === 'line',
      pointRadius:     type === 'line' ? 3 : 0,
      pointBackgroundColor: '#6366f1',
    },
    {
      label:           'Profit',
      data:            data.map(d => d.profit),
      backgroundColor: type === 'bar'
        ? 'rgba(139,92,246,0.75)'
        : 'rgba(139,92,246,0.1)',
      borderColor:     '#8b5cf6',
      borderWidth:     type === 'bar' ? 0 : 2.5,
      borderRadius:    type === 'bar' ? 6 : 0,
      tension:         0.4,
      fill:            type === 'line',
      pointRadius:     type === 'line' ? 3 : 0,
      pointBackgroundColor: '#8b5cf6',
    },
  ];

  const chartData = { labels, datasets };

  return (
    <div style={{ height: 260 }}>
      {type === 'bar'
        ? <Bar  data={chartData} options={baseOptions as Parameters<typeof Bar>[0]['options']} />
        : <Line data={chartData} options={baseOptions as Parameters<typeof Line>[0]['options']} />
      }
    </div>
  );
}
