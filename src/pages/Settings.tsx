import { useState } from 'react';
import {
  Globe, Bell, Shield, Palette, User, ChevronRight,
  Save, Check,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

const SECTIONS = [
  { id:'general',       label:'General',       icon: Globe    },
  { id:'notifications', label:'Notifications', icon: Bell     },
  { id:'security',      label:'Security',      icon: Shield   },
  { id:'appearance',    label:'Appearance',    icon: Palette  },
  { id:'profile',       label:'My Profile',    icon: User     },
];

interface ToggleProps { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string; }
function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1',
          checked ? 'bg-indigo-600' : 'bg-slate-200',
        )}
      >
        <span className={cn(
          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0',
        )} />
      </button>
    </div>
  );
}

export default function Settings() {
  const { state, updateSettings, addToast } = useApp();
  const s = state.settings;
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    addToast({ type:'success', title:'Settings saved', message:'Your preferences have been updated.' });
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <Card padding="sm" className="lg:col-span-1 h-fit">
          <nav className="space-y-1">
            {SECTIONS.map(sec => {
              const Icon = sec.icon;
              const active = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    active ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100',
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    {sec.label}
                  </div>
                  <ChevronRight size={14} className={active ? 'text-indigo-200' : 'text-slate-300'} />
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3 space-y-5">

          {/* ── General ─────────────────────────────────── */}
          {activeSection === 'general' && (
            <Card>
              <h3 className="text-base font-semibold text-slate-800 mb-5">General Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Site Name" value={s.siteName} onChange={e=>updateSettings({siteName:e.target.value})} fullWidth />
                <Input label="Site URL"  value={s.siteUrl}  onChange={e=>updateSettings({siteUrl:e.target.value})}  fullWidth />
                <Select label="Timezone" value={s.timezone} onChange={e=>updateSettings({timezone:e.target.value})} fullWidth
                  options={[
                    { value:'America/New_York',    label:'Eastern Time (US)' },
                    { value:'America/Chicago',     label:'Central Time (US)' },
                    { value:'America/Los_Angeles', label:'Pacific Time (US)' },
                    { value:'Europe/London',       label:'GMT / London'      },
                    { value:'Europe/Paris',        label:'Central European'  },
                    { value:'Asia/Tokyo',          label:'Japan Standard'    },
                  ]}
                />
                <Select label="Currency" value={s.currency} onChange={e=>updateSettings({currency:e.target.value})} fullWidth
                  options={[
                    { value:'USD', label:'USD — US Dollar'     },
                    { value:'EUR', label:'EUR — Euro'          },
                    { value:'GBP', label:'GBP — British Pound' },
                    { value:'JPY', label:'JPY — Japanese Yen'  },
                    { value:'CAD', label:'CAD — Canadian Dollar'},
                  ]}
                />
                <Select label="Language" value={s.language} onChange={e=>updateSettings({language:e.target.value})} fullWidth
                  options={[
                    { value:'en-US', label:'English (US)'  },
                    { value:'en-GB', label:'English (UK)'  },
                    { value:'es-ES', label:'Spanish'        },
                    { value:'fr-FR', label:'French'         },
                    { value:'de-DE', label:'German'         },
                    { value:'ja-JP', label:'Japanese'       },
                  ]}
                />
              </div>
            </Card>
          )}

          {/* ── Notifications ───────────────────────────── */}
          {activeSection === 'notifications' && (
            <Card>
              <h3 className="text-base font-semibold text-slate-800 mb-2">Notification Preferences</h3>
              <p className="text-sm text-slate-500 mb-5">Control how and when you receive notifications.</p>
              <Toggle checked={s.emailNotifications} onChange={v=>updateSettings({emailNotifications:v})} label="Email Notifications" description="Receive updates and alerts via email." />
              <Toggle checked={s.pushNotifications}  onChange={v=>updateSettings({pushNotifications:v})}  label="Push Notifications"  description="Browser push notifications for real-time alerts." />
              <Toggle checked={s.smsNotifications}   onChange={v=>updateSettings({smsNotifications:v})}   label="SMS Notifications"   description="Receive critical alerts via text message." />

              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-sm font-semibold text-slate-700 mb-3">Notification Events</p>
                {[
                  ['New Order',         'Notify when a new order is placed'],
                  ['Order Shipped',     'Notify when an order ships'],
                  ['Low Stock Alert',   'Notify when product stock is low'],
                  ['Customer Review',   'Notify on new customer reviews'],
                  ['Payment Issues',    'Notify on payment failures'],
                  ['Weekly Reports',    'Receive weekly analytics digest'],
                ].map(([label, desc]) => (
                  <div key={String(label)} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm text-slate-700">{label}</p>
                      <p className="text-[11px] text-slate-400">{desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ── Security ────────────────────────────────── */}
          {activeSection === 'security' && (
            <Card>
              <h3 className="text-base font-semibold text-slate-800 mb-2">Security Settings</h3>
              <p className="text-sm text-slate-500 mb-5">Manage your account security and access.</p>
              <Toggle checked={s.twoFactorAuth} onChange={v=>updateSettings({twoFactorAuth:v})} label="Two-Factor Authentication" description="Add an extra layer of security with 2FA." />

              <div className="mt-4 space-y-4">
                <Select label="Session Timeout" value={String(s.sessionTimeout)} onChange={e=>updateSettings({sessionTimeout:Number(e.target.value)})} fullWidth
                  options={[
                    {value:'15',  label:'15 minutes'},
                    {value:'30',  label:'30 minutes'},
                    {value:'60',  label:'1 hour'},
                    {value:'240', label:'4 hours'},
                    {value:'480', label:'8 hours'},
                  ]}
                />

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                  <p className="text-sm font-semibold text-slate-700">Change Password</p>
                  <Input label="Current Password" type="password" placeholder="••••••••" fullWidth />
                  <Input label="New Password"     type="password" placeholder="••••••••" fullWidth />
                  <Input label="Confirm Password" type="password" placeholder="••••••••" fullWidth />
                  <Button variant="outline" size="sm">Update Password</Button>
                </div>

                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-sm font-semibold text-red-700 mb-1">Danger Zone</p>
                  <p className="text-xs text-red-600 mb-3">Permanently delete your account and all data. This action cannot be undone.</p>
                  <Button variant="danger" size="sm">Delete Account</Button>
                </div>
              </div>
            </Card>
          )}

          {/* ── Appearance ─────────────────────────────── */}
          {activeSection === 'appearance' && (
            <Card>
              <h3 className="text-base font-semibold text-slate-800 mb-2">Appearance</h3>
              <p className="text-sm text-slate-500 mb-5">Customize the look and feel of your dashboard.</p>

              <div className="mb-5">
                <p className="text-sm font-medium text-slate-700 mb-3">Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {(['light','dark','system'] as const).map(theme => (
                    <button
                      key={theme}
                      onClick={() => updateSettings({ theme })}
                      className={cn(
                        'p-4 rounded-xl border-2 text-sm font-medium capitalize transition-all',
                        s.theme === theme ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300',
                      )}
                    >
                      <div className={cn('w-8 h-8 rounded-lg mx-auto mb-2', {
                        'bg-white border border-slate-200': theme === 'light',
                        'bg-slate-800':                     theme === 'dark',
                        'bg-gradient-to-br from-white to-slate-800': theme === 'system',
                      })} />
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <Toggle checked={s.compactMode} onChange={v=>updateSettings({compactMode:v})} label="Compact Mode" description="Reduce spacing for a denser layout." />

              <div className="mt-5">
                <p className="text-sm font-medium text-slate-700 mb-3">Accent Color</p>
                <div className="flex gap-3">
                  {['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899'].map(color => (
                    <button key={color} className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform" style={{background:color}} />
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* ── Profile ─────────────────────────────────── */}
          {activeSection === 'profile' && (
            <Card>
              <h3 className="text-base font-semibold text-slate-800 mb-5">My Profile</h3>
              <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                  AK
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Alex Kim</p>
                  <p className="text-sm text-slate-500">Administrator</p>
                  <button className="mt-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium">Change photo</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="First Name"    defaultValue="Alex"               fullWidth />
                <Input label="Last Name"     defaultValue="Kim"                fullWidth />
                <Input label="Email"         type="email" defaultValue="alex@adminpro.com" fullWidth />
                <Input label="Phone"         defaultValue="+1 555-0100"        fullWidth />
                <Input label="Job Title"     defaultValue="Administrator"      fullWidth />
                <Input label="Department"    defaultValue="Engineering"        fullWidth />
                <div className="sm:col-span-2">
                  <Input label="Bio" defaultValue="Senior admin managing the AdminPro platform." fullWidth />
                </div>
              </div>
            </Card>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              icon={saved ? <Check size={15}/> : <Save size={15}/>}
              onClick={handleSave}
              className={saved ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            >
              {saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
