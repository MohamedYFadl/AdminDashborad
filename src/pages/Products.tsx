import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, Star, Package } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Input, Select, Textarea } from '../components/ui/Input';
import { useApp } from '../context/AppContext';
import { MOCK_PRODUCTS } from '../data/mockData';
import type { Product, ProductStatus, ProductCategory } from '../models';

const STATUS_VARIANT: Record<ProductStatus, 'success' | 'neutral' | 'danger'> = {
  active:   'success',
  draft:    'neutral',
  archived: 'danger',
};

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value:'', label:'All Categories' },
  { value:'Electronics',     label:'Electronics'     },
  { value:'Clothing',        label:'Clothing'        },
  { value:'Food & Beverage', label:'Food & Beverage' },
  { value:'Home & Garden',   label:'Home & Garden'   },
  { value:'Sports',          label:'Sports'          },
  { value:'Books',           label:'Books'           },
  { value:'Beauty',          label:'Beauty'          },
  { value:'Toys',            label:'Toys'            },
];

const STATUS_OPTIONS = [
  { value:'',         label:'All Status' },
  { value:'active',   label:'Active'   },
  { value:'draft',    label:'Draft'    },
  { value:'archived', label:'Archived' },
];

const emptyProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
  name:'', sku:'', category:'Electronics', price:0, stock:0,
  status:'draft', description:'', rating:0, reviewCount:0,
};

export default function Products() {
  const { addToast } = useApp();
  const [products, setProducts]   = useState<Product[]>(MOCK_PRODUCTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selected,  setSelected]  = useState<Product | null>(null);
  const [formData,  setFormData]  = useState(emptyProduct);
  const [errors,    setErrors]    = useState<Partial<Record<keyof typeof emptyProduct, string>>>({});
  const [catFilter, setCatFilter] = useState('');
  const [stFilter,  setStFilter]  = useState('');

  const filteredData = products.filter(p =>
    (!catFilter || p.category === catFilter) &&
    (!stFilter  || p.status   === stFilter)
  ) as unknown as Record<string, unknown>[];

  const validate = () => {
    const e: typeof errors = {};
    if (!formData.name.trim())        e.name        = 'Product name is required';
    if (!formData.sku.trim())         e.sku         = 'SKU is required';
    if (formData.price <= 0)          e.price       = 'Price must be > 0';
    if (!formData.description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openCreate = () => {
    setSelected(null);
    setFormData(emptyProduct);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setSelected(p);
    setFormData({ name:p.name, sku:p.sku, category:p.category, price:p.price, stock:p.stock, status:p.status, description:p.description, rating:p.rating, reviewCount:p.reviewCount });
    setErrors({});
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!validate()) return;
    if (selected) {
      setProducts(prev => prev.map(p => p.id === selected.id ? { ...p, ...formData, updatedAt: new Date().toISOString().slice(0,10) } : p));
      addToast({ type:'success', title:'Product updated', message:`"${formData.name}" has been updated.` });
    } else {
      const newProd: Product = {
        ...formData,
        id: `p${Date.now()}`,
        createdAt: new Date().toISOString().slice(0,10),
        updatedAt: new Date().toISOString().slice(0,10),
      };
      setProducts(prev => [newProd, ...prev]);
      addToast({ type:'success', title:'Product created', message:`"${formData.name}" has been added.` });
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    setProducts(prev => prev.filter(p => p.id !== selected.id));
    addToast({ type:'success', title:'Product deleted', message:`"${selected.name}" has been removed.` });
    setDeleteModal(false);
    setSelected(null);
  };

  const columns: Column<Record<string, unknown>>[] = [
    {
      key:'name', header:'Product', sortable:true,
      render:(_, row) => {
        const p = row as unknown as Product;
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0">
              <Package size={16} className="text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{p.name}</p>
              <p className="text-[11px] text-slate-400 font-mono">{p.sku}</p>
            </div>
          </div>
        );
      },
    },
    { key:'category', header:'Category', sortable:true,
      render:(v) => <Badge variant="info">{String(v)}</Badge> },
    { key:'price', header:'Price', sortable:true,
      render:(v) => <span className="font-semibold text-slate-800">${Number(v).toFixed(2)}</span> },
    { key:'stock', header:'Stock', sortable:true,
      render:(v) => {
        const n = Number(v);
        return <span className={n === 0 ? 'text-red-600 font-semibold' : n < 30 ? 'text-amber-600 font-semibold' : 'text-slate-700'}>{n === 0 ? 'Out of stock' : `${n} units`}</span>;
      },
    },
    { key:'rating', header:'Rating', sortable:true,
      render:(v) => (
        <div className="flex items-center gap-1">
          <Star size={13} className="text-amber-400 fill-amber-400" />
          <span className="text-sm font-medium">{Number(v).toFixed(1)}</span>
        </div>
      ),
    },
    { key:'status', header:'Status', sortable:true,
      render:(v) => {
        const s = String(v) as ProductStatus;
        return <Badge variant={STATUS_VARIANT[s]} dot>{s.charAt(0).toUpperCase()+s.slice(1)}</Badge>;
      },
    },
    {
      key:'id', header:'Actions', width:'120px',
      render:(_, row) => {
        const p = row as unknown as Product;
        return (
          <div className="flex items-center gap-1">
            <button onClick={(e) => { e.stopPropagation(); setSelected(p); setViewModal(true); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"><Eye size={14}/></button>
            <button onClick={(e) => { e.stopPropagation(); openEdit(p); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"><Pencil size={14}/></button>
            <button onClick={(e) => { e.stopPropagation(); setSelected(p); setDeleteModal(true); }} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={14}/></button>
          </div>
        );
      },
    },
  ];

  const stats = [
    { label:'Total Products', value: products.length, color:'text-indigo-600', bg:'bg-indigo-50' },
    { label:'Active',         value: products.filter(p=>p.status==='active').length,   color:'text-emerald-600', bg:'bg-emerald-50' },
    { label:'Draft',          value: products.filter(p=>p.status==='draft').length,    color:'text-amber-600',   bg:'bg-amber-50'   },
    { label:'Out of Stock',   value: products.filter(p=>p.stock===0).length,           color:'text-red-600',     bg:'bg-red-50'     },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} padding="sm">
            <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <DataTable
          data={filteredData}
          columns={columns}
          searchPlaceholder="Search products…"
          pageSize={8}
          actions={
            <Button icon={<Plus size={15}/>} onClick={openCreate}>Add Product</Button>
          }
          filterSlot={
            <div className="flex gap-2">
              <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {CATEGORY_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <select value={stFilter} onChange={e=>setStFilter(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {STATUS_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          }
        />
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selected ? 'Edit Product' : 'Add New Product'}
        subtitle={selected ? 'Update product details below.' : 'Fill in the details to create a new product.'}
        size="lg"
        footer={<>
          <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>{selected ? 'Save Changes' : 'Create Product'}</Button>
        </>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input label="Product Name" value={formData.name} onChange={e=>setFormData(p=>({...p,name:e.target.value}))} error={errors.name} placeholder="e.g. Wireless Headphones Pro" fullWidth />
          </div>
          <Input label="SKU" value={formData.sku} onChange={e=>setFormData(p=>({...p,sku:e.target.value}))} error={errors.sku} placeholder="e.g. WPH-001" fullWidth />
          <Select label="Category" value={formData.category} onChange={e=>setFormData(p=>({...p,category:e.target.value as ProductCategory}))} options={CATEGORY_OPTIONS.slice(1)} fullWidth />
          <Input label="Price ($)" type="number" min={0} step={0.01} value={formData.price} onChange={e=>setFormData(p=>({...p,price:parseFloat(e.target.value)||0}))} error={errors.price} fullWidth />
          <Input label="Stock Quantity" type="number" min={0} value={formData.stock} onChange={e=>setFormData(p=>({...p,stock:parseInt(e.target.value)||0}))} fullWidth />
          <Select label="Status" value={formData.status} onChange={e=>setFormData(p=>({...p,status:e.target.value as ProductStatus}))} options={STATUS_OPTIONS.slice(1)} fullWidth />
          <div className="sm:col-span-2">
            <Textarea label="Description" value={formData.description} onChange={e=>setFormData(p=>({...p,description:e.target.value}))} error={errors.description} rows={3} placeholder="Product description…" fullWidth />
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      {selected && (
        <Modal open={viewModal} onClose={() => setViewModal(false)} title="Product Details" size="md"
          footer={<>
            <Button variant="outline" onClick={() => setViewModal(false)}>Close</Button>
            <Button onClick={() => { setViewModal(false); openEdit(selected); }}>Edit Product</Button>
          </>}
        >
          <div className="space-y-4">
            <div className="w-full h-32 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
              <Package size={48} className="text-indigo-300" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Name',     selected.name],
                ['SKU',      selected.sku],
                ['Category', selected.category],
                ['Price',    `$${selected.price.toFixed(2)}`],
                ['Stock',    `${selected.stock} units`],
                ['Rating',   `${selected.rating} ★ (${selected.reviewCount} reviews)`],
                ['Status',   selected.status],
                ['Created',  selected.createdAt],
              ].map(([k,v]) => (
                <div key={String(k)}>
                  <p className="text-xs text-slate-400 font-medium">{k}</p>
                  <p className="text-slate-800 font-medium mt-0.5">{v}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-xs text-slate-400 font-medium">Description</p>
                <p className="text-slate-700 mt-0.5 text-sm leading-relaxed">{selected.description}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {selected && (
        <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Product" size="sm"
          footer={<>
            <Button variant="outline" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>}
        >
          <p className="text-slate-600 text-sm">Are you sure you want to delete <strong>"{selected.name}"</strong>? This action cannot be undone.</p>
        </Modal>
      )}
    </div>
  );
}
