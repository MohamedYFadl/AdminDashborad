import { useState } from 'react';
import { Eye, ShoppingCart, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { MOCK_ORDERS } from '../data/mockData';
import type { Order, OrderStatus } from '../models';
import { format } from 'date-fns';

const STATUS_VARIANT: Record<OrderStatus, 'success' | 'warning' | 'info' | 'danger' | 'neutral' | 'purple'> = {
  delivered:  'success',
  shipped:    'info',
  processing: 'warning',
  pending:    'neutral',
  cancelled:  'danger',
  refunded:   'purple',
};

const STATUS_OPTIONS = [
  { value:'',           label:'All Status'  },
  { value:'pending',    label:'Pending'     },
  { value:'processing', label:'Processing'  },
  { value:'shipped',    label:'Shipped'     },
  { value:'delivered',  label:'Delivered'   },
  { value:'cancelled',  label:'Cancelled'   },
  { value:'refunded',   label:'Refunded'    },
];

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:    'processing',
  processing: 'shipped',
  shipped:    'delivered',
};

export default function Orders() {
  const { addToast } = useApp();
  const [orders, setOrders]   = useState<Order[]>(MOCK_ORDERS);
  const [selected, setSelected] = useState<Order | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [stFilter, setStFilter]   = useState('');

  const filteredData = orders.filter(o =>
    !stFilter || o.status === stFilter
  ) as unknown as Record<string, unknown>[];

  const advanceStatus = (order: Order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: next, updatedAt: new Date().toISOString().slice(0,10) } : o));
    if (selected?.id === order.id) setSelected(o => o ? { ...o, status: next } : o);
    addToast({ type:'success', title:'Order updated', message:`${order.orderNumber} moved to "${next}".` });
  };

  const stats = [
    { label:'Total Orders',  value: orders.length,                                     icon: ShoppingCart, color:'text-indigo-600',  bg:'bg-indigo-50'  },
    { label:'Pending',       value: orders.filter(o=>o.status==='pending').length,      icon: Clock,        color:'text-amber-600',   bg:'bg-amber-50'   },
    { label:'Delivered',     value: orders.filter(o=>o.status==='delivered').length,    icon: CheckCircle,  color:'text-emerald-600', bg:'bg-emerald-50' },
    { label:'Revenue',       value: `$${orders.reduce((s,o)=>s+o.total,0).toLocaleString(undefined,{minimumFractionDigits:2})}`, icon: TrendingUp, color:'text-violet-600', bg:'bg-violet-50' },
  ];

  const columns: Column<Record<string, unknown>>[] = [
    {
      key:'orderNumber', header:'Order #', sortable:true,
      render:(v) => <span className="font-mono text-xs font-semibold text-indigo-600">{String(v)}</span>,
    },
    {
      key:'customerName', header:'Customer', sortable:true,
      render:(_, row) => {
        const o = row as unknown as Order;
        return (
          <div>
            <p className="text-sm font-medium text-slate-800">{o.customerName}</p>
            <p className="text-[11px] text-slate-400">{o.customerEmail}</p>
          </div>
        );
      },
    },
    {
      key:'items', header:'Items',
      render:(_, row) => {
        const o = row as unknown as Order;
        return <span className="text-sm text-slate-600">{o.items.length} item{o.items.length!==1?'s':''}</span>;
      },
    },
    {
      key:'total', header:'Total', sortable:true,
      render:(v) => <span className="font-semibold text-slate-800">${Number(v).toFixed(2)}</span>,
    },
    {
      key:'paymentMethod', header:'Payment', sortable:true,
      render:(v) => <span className="text-sm text-slate-600">{String(v)}</span>,
    },
    {
      key:'status', header:'Status', sortable:true,
      render:(v) => {
        const s = String(v) as OrderStatus;
        return <Badge variant={STATUS_VARIANT[s]} dot>{s.charAt(0).toUpperCase()+s.slice(1)}</Badge>;
      },
    },
    {
      key:'createdAt', header:'Date', sortable:true,
      render:(v) => <span className="text-sm text-slate-500">{format(new Date(String(v)), 'MMM d, yyyy')}</span>,
    },
    {
      key:'id', header:'', width:'80px',
      render:(_, row) => {
        const o = row as unknown as Order;
        return (
          <button
            onClick={(e) => { e.stopPropagation(); setSelected(o); setViewModal(true); }}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <Eye size={14} />
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label} padding="sm">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.bg}`}>
                  <Icon size={16} className={s.color} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Table */}
      <Card>
        <DataTable
          data={filteredData}
          columns={columns}
          searchPlaceholder="Search orders…"
          pageSize={8}
          onRowClick={(row) => { setSelected(row as unknown as Order); setViewModal(true); }}
          filterSlot={
            <select value={stFilter} onChange={e=>setStFilter(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {STATUS_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          }
        />
      </Card>

      {/* Order Detail Modal */}
      {selected && (
        <Modal
          open={viewModal}
          onClose={() => setViewModal(false)}
          title={`Order ${selected.orderNumber}`}
          subtitle={`Placed on ${format(new Date(selected.createdAt), 'MMMM d, yyyy')}`}
          size="lg"
          footer={<>
            <Button variant="outline" onClick={() => setViewModal(false)}>Close</Button>
            {NEXT_STATUS[selected.status] && (
              <Button onClick={() => advanceStatus(selected)}>
                Mark as {NEXT_STATUS[selected.status]?.charAt(0).toUpperCase()}{NEXT_STATUS[selected.status]?.slice(1)}
              </Button>
            )}
          </>}
        >
          <div className="space-y-5">
            {/* Status Banner */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-xs text-slate-500 mb-1">Current Status</p>
                <Badge variant={STATUS_VARIANT[selected.status]} dot>
                  {selected.status.charAt(0).toUpperCase()+selected.status.slice(1)}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-1">Payment</p>
                <p className="text-sm font-medium text-slate-700">{selected.paymentMethod}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Customer</p>
                <p className="font-semibold text-slate-800">{selected.customerName}</p>
                <p className="text-slate-500">{selected.customerEmail}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Shipping Address</p>
                <p className="text-slate-700 leading-relaxed">{selected.shippingAddress}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Order Items</p>
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {['Product','Qty','Unit Price','Total'].map(h=>(
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {selected.items.map(item => (
                      <tr key={item.productId}>
                        <td className="px-4 py-3 font-medium text-slate-800">{item.productName}</td>
                        <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                        <td className="px-4 py-3 text-slate-600">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              {[
                ['Subtotal',  `$${selected.subtotal.toFixed(2)}`],
                ['Tax',       `$${selected.tax.toFixed(2)}`],
                ['Shipping',  selected.shipping === 0 ? 'Free' : `$${selected.shipping.toFixed(2)}`],
              ].map(([k,v]) => (
                <div key={String(k)} className="flex justify-between text-sm">
                  <span className="text-slate-500">{k}</span>
                  <span className="text-slate-700">{v}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-100">
                <span className="text-slate-800">Total</span>
                <span className="text-indigo-600">${selected.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
