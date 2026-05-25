import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/products', icon: 'inventory_2', label: 'Products' },
  { to: '/sales', icon: 'point_of_sale', label: 'Sales/POS' },
  { to: '/suppliers', icon: 'local_shipping', label: 'Suppliers' },
  { to: '/reports', icon: 'analytics', label: 'Reports' },
]

const bottomItems: { to: string; icon: string; label: string }[] = []

export function Sidebar() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  return (
    <aside className="fixed left-0 top-0 w-[260px] h-screen bg-surface-container-lowest border-r border-outline-variant z-50 flex flex-col">
      <div className="h-16 flex items-center px-4 gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary-container">inventory_2</span>
        </div>
        <div>
          <p className="font-display-lg text-display-lg text-on-surface leading-none">StockPro</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Enterprise v2.0</p>
        </div>
      </div>

      <button
        className="mx-4 my-4 bg-primary-container text-primary-fixed rounded-xl py-3 px-4 font-title-sm flex items-center gap-2 justify-center hover:bg-inverse-primary hover:text-surface transition-colors"
        onClick={() => navigate('/products/add')}
      >
        <span className="material-symbols-outlined text-lg">add</span>
        New Entry
      </button>

      <nav className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-0.5 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors my-0.5',
                  isActive && 'bg-primary-container text-primary-fixed hover:bg-primary-container hover:text-primary-fixed'
                )
              }
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="border-t border-outline-variant pt-2 pb-4 px-3">
          {bottomItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors my-0.5',
                  isActive && 'bg-primary-container text-primary-fixed'
                )
              }
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          <button
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body-md text-body-md text-error/80 hover:text-error hover:bg-surface-container-high transition-colors my-0.5 w-full text-left"
            onClick={logout}
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Logout
          </button>
        </div>
      </nav>
    </aside>
  )
}
