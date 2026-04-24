import { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Eye, ShoppingCart, DollarSign } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { RevenueChart } from '../components/charts/RevenueChart';
import { DonutChart }   from '../components/charts/DonutChart';
import { MONTHLY_REVENUE, WEEKLY_REVENUE, CATEGORY_SALES, TRAFFIC_SOURCES } from '../data/mockData';
import { cn } from '../utils/cn';

const KPI_CARDS = [
  { label:'Total Revenue',    value:'$807,800',  change:'+22.4%', up:true,  icon:DollarSign, color:'text-indigo-600',  bg:'bg-indigo-50'  },
  { label:'Avg Order Value',  value:'$248.30',   change:'+8.1%',  up:true,  icon:ShoppingCart,color:'text-emerald-600',bg:'bg-emerald-50' },
  { label:'Conversion Rate',  value:'3.84%',     change:'+0.6%',  up:true,  icon:TrendingUp,  color:'text-violet-600', bg:'bg-violet-50'  },
  { label:'Bounce Rate',      value:'42.1%',     change:'-3.2%',  up:true,  icon:TrendingDown,color:'text-amber-600',  bg:'bg-amber-50'   },
  { label:'Avg Session',      value:'4m 32s',    change:'+15.8%', up:true,  icon:Eye,         color:'text-cyan-600',   bg:'bg-cyan-50'    },
  { label:'New Visitors',     value:'18,420',    change:'+29.3%', up:true,  icon:Users,       color:'text-rose-600',   bg:'bg-rose-50'    },
];

const FUNNEL = [
  { label:'Visitors',       value:127400, pct:100 },
  { label:'Product Views',  value:64200,  pct:50  },
  { label:'Add to Cart',    value:28800,  pct:22.6},
  { label:'Checkout',       value:12100,  pct:9.5 },
  { label:'Purchase',       value:4890,   pct:3.84},
];

export default function Analytics() {
  const [period, setPeriod] = useState<'monthly' | 'weekly'>('monthly');
  const chartData = period === 'monthly' ? MONTHLY_REVENUE : WEEKLY_REVENUE;

  return (
    <div className="space-y-6 fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPI_CARDS.map(kpi => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} padding="sm" className="text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${kpi.bg}`}>
                <Icon size={18} className={kpi.color} />
              </div>
              <p className="text-xl font-bold text-slate-800">{kpi.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{kpi.label}</p>
              <div className={cn('flex items-center justify-center gap-0.5 text-xs font-semibold mt-1.5', kpi.up ? 'text-emerald-600' : 'text-red-500')}>
                {kpi.up ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}
                {kpi.change}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Revenue Line Chart */}
      <Card>
        <CardHeader
          title="Revenue Trend"
          subtitle="Monthly revenue, profit and order volume"
          action={
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              {(['monthly','weekly'] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize',
                    period === p ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  )}>{p}</button>
              ))}
            </div>
          }
        />
        <RevenueChart data={chartData} type="line" />
      </Card>

      {/* Category + Traffic */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Revenue by Category" subtitle="All-time sales breakdown" />
          <DonutChart data={CATEGORY_SALES} />
          <div className="mt-4 grid grid-cols-2 gap-2">
            {CATEGORY_SALES.map(cat => (
              <div key={cat.category} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                <div className="w-2 h-2 rounded-full shrink-0" style={{background:cat.color}} />
                <span className="text-xs text-slate-600 truncate flex-1">{cat.category}</span>
                <span className="text-xs font-bold text-slate-700">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader title="Conversion Funnel" subtitle="Visitor journey stages" />
          <div className="space-y-3 mt-2">
            {FUNNEL.map((stage, idx) => (
              <div key={stage.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold flex items-center justify-center">{idx+1}</span>
                    <span className="text-sm font-medium text-slate-700">{stage.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-800">{stage.value.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 ml-1.5">{stage.pct}%</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width:`${stage.pct}%`,
                      background:`linear-gradient(90deg, ${idx<2?'#6366f1':idx<4?'#8b5cf6':'#a855f7'}, ${idx<2?'#8b5cf6':idx<4?'#a855f7':'#c084fc'})`,
                    }}
                  />
                </div>
                {idx < FUNNEL.length - 1 && (
                  <p className="text-[11px] text-slate-400 mt-1 text-right">
                    Drop-off: {(100 - (FUNNEL[idx+1].value / stage.value) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Traffic Sources Table */}
      <Card>
        <CardHeader title="Traffic Sources" subtitle="Detailed acquisition breakdown" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Source','Visits','Share','Trend','Change'].map(h => (
                  <th key={h} className="pb-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TRAFFIC_SOURCES.map(source => (
                <tr key={source.source} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 font-medium text-slate-800">{source.source}</td>
                  <td className="py-4 text-slate-700">{source.visits.toLocaleString()}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{width:`${source.percentage}%`}} />
                      </div>
                      <span className="text-slate-600">{source.percentage}%</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-0.5">
                      {[3,5,4,7,6,8,7].map((h,i) => (
                        <div key={i} className="w-2 rounded-sm bg-indigo-200" style={{height:`${h*4}px`}} />
                      ))}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={cn('flex items-center gap-1 text-xs font-semibold', source.change >= 0 ? 'text-emerald-600' : 'text-red-500')}>
                      {source.change >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                      {Math.abs(source.change)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
