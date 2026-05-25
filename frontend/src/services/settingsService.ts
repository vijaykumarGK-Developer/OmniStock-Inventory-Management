const SETTINGS_KEY = 'omni_settings'

export interface GeneralSettings {
  storeName: string
  address: string
  currency: string
  taxRate: string
  lowStockThreshold: string
  timezone: string
  dateFormat: string
}

export interface NotificationSettings {
  lowStock: boolean
  dailySummary: boolean
  emailNotif: boolean
  email: string
}

export interface AppearanceSettings {
  theme: string
  compactMode: boolean
  fontSize: string
}

export interface AppSettings {
  general: GeneralSettings
  notifications: NotificationSettings
  appearance: AppearanceSettings
}

const defaults: AppSettings = {
  general: {
    storeName: 'OmniStock',
    address: '123 Business Park, Mumbai',
    currency: 'INR',
    taxRate: '18',
    lowStockThreshold: '5',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
  },
  notifications: {
    lowStock: true,
    dailySummary: false,
    emailNotif: true,
    email: 'admin@omni.com',
  },
  appearance: {
    theme: 'dark',
    compactMode: false,
    fontSize: 'normal',
  },
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) return { ...defaults, ...JSON.parse(raw) }
  } catch {}
  return { ...defaults }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function applyTheme(theme: string): void {
  const html = document.documentElement
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  html.classList.toggle('dark', isDark)
  html.classList.toggle('light', !isDark)
}
