import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Tooltip, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface MiniLineProps {
  data:   number[];
  labels: string[];
  color?: string;
  height?: number;
}

export function MiniLine({ data, labels, color = '#6366f1', height = 60 }: MiniLineProps) {
  const chartData = {
    labels,
    datasets: [{
      data,
      borderColor:        color,
      borderWidth:        2,
      tension:            0.4,
      fill:               true,
      backgroundColor:    `${color}18`,
      pointRadius:        0,
      pointHoverRadius:   4,
      pointHoverBackgroundColor: color,
    }],
  };

  return (
    <div style={{ height }}>
      <Line
        data={chartData}
        options={{
          responsive:          true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales:  { x: { display: false }, y: { display: false } },
          animation: { duration: 800 },
        }}
      />
    </div>
  );
}
