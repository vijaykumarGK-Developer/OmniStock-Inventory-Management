import { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Toggle } from '../components/ui/Toggle'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Table } from '../components/ui/Table'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { getAllUsers } from '../services/userService'
import { loadSettings, saveSettings, applyTheme } from '../services/settingsService'
import type { TableColumn } from '../components/ui/Table'
import type { User } from '../../shared/types'

const sidebarTabs = [
  { key: 'general', label: 'General', icon: 'settings' },
  { key: 'notifications', label: 'Notifications', icon: 'notifications' },
  { key: 'users', label: 'Users', icon: 'group' },
  { key: 'billing', label: 'Billing', icon: 'credit_card' },
  { key: 'appearance', label: 'Appearance', icon: 'palette' },
]

const currencyOptions = [
  { value: 'INR', label: '₹ INR' },
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' },
  { value: 'GBP', label: '£ GBP' },
]

const timezoneOptions = [
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
  { value: 'America/New_York', label: 'America/New_York (EST)' },
  { value: 'Europe/London', label: 'Europe/London (GMT)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST)' },
]

const dateFormatOptions = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
]

const fontSizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Large' },
]

function SectionCard({ title, children, onSave }: { title: string; children: React.ReactNode; onSave?: () => void }) {
  return (
    <Card title={title}>
      <div className="flex flex-col gap-5">
        {children}
        {onSave && (
          <div className="flex justify-end pt-2 border-t border-surface-variant/30">
            <Button onClick={onSave}>Save Changes</Button>
          </div>
        )}
      </div>
    </Card>
  )
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('general')
  const [users, setUsers] = useState<User[]>([])
  const { addNotification } = useNotification()
  const [initial] = useState(() => loadSettings())
  const [general, setGeneral] = useState(initial.general)
  const [notif, setNotif] = useState(initial.notifications)
  const [appearance, setAppearance] = useState(initial.appearance)

  useEffect(() => {
    applyTheme(appearance.theme)
  }, [appearance.theme])

  useEffect(() => {
    if (activeTab === 'users' && user?.role === 'admin') {
      getAllUsers().then(setUsers).catch(() => {})
    }
  }, [activeTab, user])

  const roleBadge: Record<string, 'info' | 'success' | 'neutral'> = { admin: 'info', manager: 'success', staff: 'neutral' }

  const userColumns: TableColumn<User>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', align: 'center', render: (u) => <Badge variant={roleBadge[u.role] ?? 'neutral'}>{u.role}</Badge> },
    { key: 'status', label: 'Status', align: 'center', render: (u) => <Badge variant={u.status === 'active' ? 'success' : 'neutral'}>{u.status}</Badge> },
    { key: 'createdAt', label: 'Joined', render: (u) => <span className="text-on-surface-variant">{new Date(u.createdAt).toLocaleDateString()}</span> },
  ]

  const tabContent = (key: string) => {
    switch (key) {
      case 'general':
        return (
          <SectionCard title="General Settings" onSave={() => { saveSettings({ general, notifications: notif, appearance }); addNotification('success', 'General settings saved'); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Store Name" value={general.storeName} onChange={(e) => setGeneral((p) => ({ ...p, storeName: e.target.value }))} icon="store" />
              <Input label="Address" value={general.address} onChange={(e) => setGeneral((p) => ({ ...p, address: e.target.value }))} icon="location_on" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Currency" options={currencyOptions} value={general.currency} onChange={(e) => setGeneral((p) => ({ ...p, currency: e.target.value }))} />
              <Input label="Tax Rate (%)" value={general.taxRate} onChange={(e) => setGeneral((p) => ({ ...p, taxRate: e.target.value }))} icon="percent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Low Stock Threshold" value={general.lowStockThreshold} onChange={(e) => setGeneral((p) => ({ ...p, lowStockThreshold: e.target.value }))} icon="warning" />
              <Select label="Timezone" options={timezoneOptions} value={general.timezone} onChange={(e) => setGeneral((p) => ({ ...p, timezone: e.target.value }))} />
            </div>
            <Select label="Date Format" options={dateFormatOptions} value={general.dateFormat} onChange={(e) => setGeneral((p) => ({ ...p, dateFormat: e.target.value }))} />
          </SectionCard>
        )
      case 'notifications':
        return (
          <SectionCard title="Notification Preferences" onSave={() => { saveSettings({ general, notifications: notif, appearance }); addNotification('success', 'Notification preferences saved'); }}>
            <Toggle checked={notif.lowStock} onChange={(v) => setNotif((p) => ({ ...p, lowStock: v }))} label="Low Stock Alerts" />
            <Toggle checked={notif.dailySummary} onChange={(v) => setNotif((p) => ({ ...p, dailySummary: v }))} label="Daily Summary Report" />
            <div className="flex flex-col gap-3">
              <Toggle checked={notif.emailNotif} onChange={(v) => setNotif((p) => ({ ...p, emailNotif: v }))} label="Email Notifications" />
              {notif.emailNotif && (
                <Input label="Notification Email" value={notif.email} onChange={(e) => setNotif((p) => ({ ...p, email: e.target.value }))} icon="mail" type="email" />
              )}
            </div>
          </SectionCard>
        )
      case 'users':
        return user?.role !== 'admin' ? (
          <Card title="Access Restricted">
            <p className="font-body-md text-body-md text-on-surface-variant py-4">Only administrators can manage users.</p>
          </Card>
        ) : (
          <Card title="User Management"
            action={<Button onClick={() => addNotification('info', 'User creation coming soon')}><span className="material-symbols-outlined">add</span>Add User</Button>}
          >
            <Table columns={userColumns} data={users as unknown as Record<string, unknown>[]} emptyMessage="No users found" emptyIcon="group" />
          </Card>
        )
      case 'billing':
        return (
          <SectionCard title="Billing & Plan">
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
              <div>
                <p className="font-title-md text-title-md text-on-surface">Free Tier</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">₹0/month — Basic features included</p>
              </div>
              <Button variant="outline-primary" disabled className="opacity-50 cursor-not-allowed">
                Upgrade — Coming Soon
              </Button>
            </div>
            <div className="mt-4">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-3">Invoice History</p>
              <div className="bg-surface-container-low rounded-xl p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">receipt_long</span>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">No invoices yet</p>
              </div>
            </div>
          </SectionCard>
        )
      case 'appearance':
        return (
          <SectionCard title="Appearance" onSave={() => { saveSettings({ general, notifications: notif, appearance }); applyTheme(appearance.theme); addNotification('success', 'Appearance settings saved'); }}>
            <div>
              <p className="font-label-uppercase text-label-uppercase text-on-surface-variant mb-3">Theme</p>
              <div className="flex gap-3">
                {['dark', 'light', 'system'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setAppearance((p) => ({ ...p, theme: t }))}
                    className={`flex-1 p-4 rounded-xl border-2 transition-colors text-center ${
                      appearance.theme === t
                        ? 'border-primary bg-primary-container/10 text-primary-fixed'
                        : 'border-surface-variant text-on-surface-variant hover:border-surface-container-highest'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl block mb-1">
                      {t === 'dark' ? 'dark_mode' : t === 'light' ? 'light_mode' : 'contrast'}
                    </span>
                    <span className="font-label-sm text-label-sm capitalize">{t}</span>
                  </button>
                ))}
              </div>
            </div>
            <Toggle checked={appearance.compactMode} onChange={(v) => setAppearance((p) => ({ ...p, compactMode: v }))} label="Compact Mode" />
            <Select label="Font Size" options={fontSizeOptions} value={appearance.fontSize} onChange={(e) => setAppearance((p) => ({ ...p, fontSize: e.target.value }))} />
          </SectionCard>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline-lg text-headline-lg text-on-background">Settings</h1>
      <div className="flex gap-6">
        <div className="w-56 shrink-0 flex flex-col gap-1">
          {sidebarTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-body-md text-body-md ${
                activeTab === t.key
                  ? 'border-l-2 border-primary bg-primary-container/10 text-primary-fixed'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          {tabContent(activeTab)}
        </div>
      </div>
    </div>
  )
}
