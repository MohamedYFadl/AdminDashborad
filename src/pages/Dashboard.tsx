import { useState } from 'react';
import {
  DollarSign, ShoppingCart, Users, Package,
  TrendingUp, TrendingDown, ArrowUpRight, Eye,
} from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { RevenueChart } from '../components/charts/RevenueChart';
import { DonutChart }   from '../components/charts/DonutChart';
import { MiniLine }     from '../components/charts/LineChart';
import {
  MONTHLY_REVENUE, WEEKLY_REVENUE,
  MOCK_ORDERS, MOCK_CUSTOMERS, CATEGORY_SALES,
  TRAFFIC_SOURCES,
} from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '../utils/cn';

const ORDER_STATUS_VARIANT: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'neutral'> = {
  delivered:  'success',
  shipped:    'info',
  processing: 'warning',
  pending:    'neutral',
  cancelled:  'danger',
  refunded:   'danger',
};

const STAT_CARDS = [
  {
    label:    'Total Revenue',
    value:    '$112,800',
    change:   '+18.4%',
    up:       true,
    icon:     DollarSign,
    color:    'text-indigo-600',
    bg:       'bg-indigo-50',
    spark:    [42500,38200,51800,47300,63100,58700,72400,68900,75200,81600,94300,112800],
    sparkColor: '#6366f1',
  },
  {
    label:    'Total Orders',
    value:    '868',
    change:   '+12.1%',
    up:       true,
    icon:     ShoppingCart,
    color:    'text-emerald-600',
    bg:       'bg-emerald-50',
    spark:    [312,287,395,341,482,451,556,521,578,629,731,868],
    sparkColor: '#10b981',
  },
  {
    label:    'New Customers',
    value:    '2,340',
    change:   '+8.6%',
    up:       true,
    icon:     Users,
    color:    'text-violet-600',
    bg:       'bg-violet-50',
    spark:    [180,210,195,240,280,265,310,295,330,355,390,420],
    sparkColor: '#8b5cf6',
  },
  {
    label:    'Products Sold',
    value:    '4,128',
    change:   '-3.2%',
    up:       false,
    icon:     Package,
    color:    'text-amber-600',
    bg:       'bg-amber-50',
    spark:    [520,480,510,490,530,510,480,500,470,485,460,450],
    sparkColor: '#f59e0b',
  },
];

const MONTHS_LABELS = MONTHLY_REVENUE.map(d => d.label);

export default function Dashboard() {
  const [period, setPeriod] = useState<'monthly' | 'weekly'>('monthly');
  const navigate = useNavigate();

  const chartData = period === 'monthly' ? MONTHLY_REVENUE : WEEKLY_REVENUE;
  const recentOrders = MOCK_ORDERS.slice(0, 6);

  return (
    <div className="space-y-6 fade-in">

      {/* ── Stat Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STAT_CARDS.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                </div>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                  <Icon size={20} className={stat.color} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className={cn('flex items-center gap-1 text-xs font-semibold', stat.up ? 'text-emerald-600' : 'text-red-500')}>
                  {stat.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {stat.change} vs last period
                </div>
              </div>
              <div className="mt-3 -mx-2">
                <MiniLine
                  data={stat.spark}
                  labels={MONTHS_LABELS}
                  color={stat.sparkColor}
                  height={50}
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── Revenue + Donut ─────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Revenue Overview"
            subtitle={`${period === 'monthly' ? 'Monthly' : 'Weekly'} revenue and profit`}
            action={
              <div className="flex bg-slate-100 rounded-lg p-0.5">
                {(['monthly','weekly'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize',
                      period === p ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700',
                    )}
                  >{p}</button>
                ))}
              </div>
            }
          />
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="text-xs text-slate-500">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-xs text-slate-500">Profit</span>
            </div>
          </div>
          <RevenueChart data={chartData} type="bar" />
        </Card>

        {/* Category Donut */}
        <Card>
          <CardHeader title="Sales by Category" subtitle="Revenue distribution" />
          <DonutChart data={CATEGORY_SALES} />
          <div className="mt-4 space-y-2.5">
            {CATEGORY_SALES.slice(0, 5).map(cat => (
              <div key={cat.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
                  <span className="text-xs text-slate-600 truncate">{cat.category}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width:`${cat.percentage}%`, background: cat.color }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 w-8 text-right">{cat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Recent Orders + Traffic ──────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <Card padding="none" className="xl:col-span-2 overflow-hidden">
          <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-800">Recent Orders</h3>
              <p className="text-sm text-slate-500 mt-0.5">Latest 6 transactions</p>
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              View all <ArrowUpRight size={13} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  {['Order','Customer','Amount','Status','Date'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/orders')}>
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-xs text-indigo-600 font-semibold">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-300 to-purple-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {order.customerName.split(' ').map(n => n[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-800">{order.customerName}</p>
                          <p className="text-[11px] text-slate-400">{order.customerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-semibold text-slate-800">${order.total.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={ORDER_STATUS_VARIANT[order.status]} dot>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-500">
                      {format(new Date(order.createdAt), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader title="Traffic Sources" subtitle="Visitor acquisition channels" />
          <div className="space-y-4">
            {TRAFFIC_SOURCES.map(source => (
              <div key={source.source}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-700 font-medium">{source.source}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'flex items-center gap-0.5 text-xs font-semibold',
                      source.change >= 0 ? 'text-emerald-600' : 'text-red-500',
                    )}>
                      {source.change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {Math.abs(source.change)}%
                    </span>
                    <span className="text-xs font-bold text-slate-700">{source.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{source.visits.toLocaleString()} visits</p>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-slate-100">
            <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              <Eye size={14} /> View Analytics
            </button>
          </div>
        </Card>
      </div>

      {/* ── Top Customers ───────────────────────────────── */}
      <Card>
        <CardHeader
          title="Top Customers"
          subtitle="By total spend this month"
          action={
            <button onClick={() => navigate('/customers')} className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700">
              View all <ArrowUpRight size={13} />
            </button>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_CUSTOMERS.slice(0, 4).map((customer, idx) => (
            <div key={customer.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => navigate('/customers')}>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                  {customer.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                {idx === 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                    👑
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{customer.name}</p>
                <p className="text-xs text-slate-500 truncate">{customer.totalOrders} orders</p>
                <p className="text-xs font-bold text-indigo-600">${customer.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
