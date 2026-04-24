import { useState } from 'react';
import { Eye, Pencil, Users, UserCheck, UserX, DollarSign } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { useApp } from '../context/AppContext';
import { MOCK_CUSTOMERS } from '../data/mockData';
import type { Customer } from '../models';
import { format } from 'date-fns';

const STATUS_VARIANT = {
  active:   'success' as const,
  inactive: 'neutral' as const,
  blocked:  'danger'  as const,
};

const STATUS_OPTIONS = [
  { value:'',         label:'All Status' },
  { value:'active',   label:'Active'     },
  { value:'inactive', label:'Inactive'   },
  { value:'blocked',  label:'Blocked'    },
];

export default function Customers() {
  const { addToast } = useApp();
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [selected,  setSelected]  = useState<Customer | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [stFilter,  setStFilter]  = useState('');
  const [editData,  setEditData]  = useState({ name:'', email:'', phone:'', status:'active' as Customer['status'] });

  const filteredData = customers.filter(c => !stFilter || c.status === stFilter) as unknown as Record<string, unknown>[];

  const openEdit = (c: Customer) => {
    setSelected(c);
    setEditData({ name:c.name, email:c.email, phone:c.phone, status:c.status });
    setEditModal(true);
  };

  const handleSave = () => {
    if (!selected) return;
    setCustomers(prev => prev.map(c => c.id === selected.id ? { ...c, ...editData } : c));
    addToast({ type:'success', title:'Customer updated', message:`${editData.name}'s profile has been updated.` });
    setEditModal(false);
  };

  const stats = [
    { label:'Total Customers', value: customers.length,                                          icon: Users,     color:'text-indigo-600',  bg:'bg-indigo-50'  },
    { label:'Active',          value: customers.filter(c=>c.status==='active').length,            icon: UserCheck, color:'text-emerald-600', bg:'bg-emerald-50' },
    { label:'Inactive',        value: customers.filter(c=>c.status==='inactive').length,          icon: UserX,     color:'text-amber-600',   bg:'bg-amber-50'   },
    { label:'Total Revenue',   value:`$${customers.reduce((s,c)=>s+c.totalSpent,0).toLocaleString(undefined,{minimumFractionDigits:0})}`, icon: DollarSign, color:'text-violet-600', bg:'bg-violet-50' },
  ];

  const columns: Column<Record<string, unknown>>[] = [
    {
      key:'name', header:'Customer', sortable:true,
      render:(_, row) => {
        const c = row as unknown as Customer;
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{c.name}</p>
              <p className="text-[11px] text-slate-400">{c.email}</p>
            </div>
          </div>
        );
      },
    },
    { key:'phone',       header:'Phone',      sortable:true, render:(v)=><span className="text-sm text-slate-600">{String(v)}</span> },
    { key:'location',    header:'Location',   sortable:true, render:(v)=><span className="text-sm text-slate-600">{String(v)}</span> },
    {
      key:'totalOrders', header:'Orders', sortable:true,
      render:(v) => <span className="font-semibold text-slate-700">{String(v)}</span>,
    },
    {
      key:'totalSpent', header:'Total Spent', sortable:true,
      render:(v) => <span className="font-semibold text-indigo-600">${Number(v).toFixed(2)}</span>,
    },
    {
      key:'status', header:'Status', sortable:true,
      render:(v) => {
        const s = String(v) as Customer['status'];
        return <Badge variant={STATUS_VARIANT[s]} dot>{s.charAt(0).toUpperCase()+s.slice(1)}</Badge>;
      },
    },
    {
      key:'joinedAt', header:'Joined', sortable:true,
      render:(v) => <span className="text-sm text-slate-500">{format(new Date(String(v)),'MMM d, yyyy')}</span>,
    },
    {
      key:'id', header:'', width:'80px',
      render:(_, row) => {
        const c = row as unknown as Customer;
        return (
          <div className="flex gap-1">
            <button onClick={(e) => { e.stopPropagation(); setSelected(c); setViewModal(true); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"><Eye size={14}/></button>
            <button onClick={(e) => { e.stopPropagation(); openEdit(c); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"><Pencil size={14}/></button>
          </div>
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
          searchPlaceholder="Search customers…"
          pageSize={8}
          onRowClick={(row) => { setSelected(row as unknown as Customer); setViewModal(true); }}
          filterSlot={
            <select value={stFilter} onChange={e=>setStFilter(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {STATUS_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          }
        />
      </Card>

      {/* View Modal */}
      {selected && (
        <Modal open={viewModal} onClose={() => setViewModal(false)} title="Customer Profile" size="md"
          footer={<>
            <Button variant="outline" onClick={() => setViewModal(false)}>Close</Button>
            <Button onClick={() => { setViewModal(false); openEdit(selected); }}>Edit Customer</Button>
          </>}
        >
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {selected.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-800">{selected.name}</h3>
                <p className="text-slate-500 text-sm">{selected.email}</p>
                <Badge variant={STATUS_VARIANT[selected.status]} dot className="mt-2">
                  {selected.status.charAt(0).toUpperCase()+selected.status.slice(1)}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm border-t border-slate-100 pt-4">
              {[
                ['Phone',         selected.phone],
                ['Location',      selected.location],
                ['Total Orders',  selected.totalOrders.toString()],
                ['Total Spent',   `$${selected.totalSpent.toFixed(2)}`],
                ['Joined',        format(new Date(selected.joinedAt), 'MMM d, yyyy')],
                ['Last Order',    format(new Date(selected.lastOrderAt), 'MMM d, yyyy')],
              ].map(([k,v]) => (
                <div key={String(k)}>
                  <p className="text-xs text-slate-400 font-medium">{k}</p>
                  <p className="text-slate-800 font-semibold mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {selected && (
        <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Customer" size="sm"
          footer={<>
            <Button variant="outline" onClick={() => setEditModal(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </>}
        >
          <div className="space-y-4">
            <Input label="Full Name"  value={editData.name}  onChange={e=>setEditData(p=>({...p,name:e.target.value}))}  fullWidth />
            <Input label="Email"      type="email" value={editData.email} onChange={e=>setEditData(p=>({...p,email:e.target.value}))} fullWidth />
            <Input label="Phone"      value={editData.phone} onChange={e=>setEditData(p=>({...p,phone:e.target.value}))} fullWidth />
            <Select label="Status" value={editData.status} onChange={e=>setEditData(p=>({...p,status:e.target.value as Customer['status']}))} options={STATUS_OPTIONS.slice(1)} fullWidth />
          </div>
        </Modal>
      )}
    </div>
  );
}
