import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { CategorySalesData } from '../../models';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps { data: CategorySalesData[]; }

export function DonutChart({ data }: DonutChartProps) {
  const chartData = {
    labels: data.map(d => d.category),
    datasets: [{
      data:            data.map(d => d.sales),
      backgroundColor: data.map(d => d.color),
      borderWidth:     0,
      hoverOffset:     6,
    }],
  };

  const options = {
    responsive:          true,
    maintainAspectRatio: false,
    cutout:              '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor:      '#f8fafc',
        bodyColor:       '#94a3b8',
        padding:         12,
        cornerRadius:    10,
        callbacks: {
          label: (ctx: { parsed: number; label: string }) =>
            ` ${ctx.label}: $${ctx.parsed.toLocaleString()}`,
        },
      },
    },
  };

  const total = data.reduce((s, d) => s + d.sales, 0);

  return (
    <div className="relative" style={{ height: 220 }}>
      <Doughnut data={chartData} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-xl font-bold text-slate-800">${(total / 1000).toFixed(0)}k</p>
        <p className="text-xs text-slate-500">Total Sales</p>
      </div>
    </div>
  );
}
