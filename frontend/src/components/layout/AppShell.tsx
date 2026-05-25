import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { Breadcrumb } from './Breadcrumb'

export function AppShell() {
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>
      <main className="flex-1 flex flex-col lg:ml-[260px]">
        <Topbar />
        <div className="flex-1 overflow-y-auto">
          <Breadcrumb />
          <div className="p-gutter">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
