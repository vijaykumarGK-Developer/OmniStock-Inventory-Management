import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider, useNotification } from './context/NotificationContext'
import { AppShell } from './components/layout/AppShell'
import { ToastContainer } from './components/layout/ToastContainer'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { setApiErrorHandler } from './services/api'
import { loadSettings, applyTheme } from './services/settingsService'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import AddProductPage from './pages/AddProductPage'
import ProductDetailPage from './pages/ProductDetailPage'
import EditProductPage from './pages/EditProductPage'
import SalesPage from './pages/SalesPage'
import SuppliersPage from './pages/SuppliersPage'
import AddSupplierPage from './pages/AddSupplierPage'
import PurchasesPage from './pages/PurchasesPage'
import AddPurchasePage from './pages/AddPurchasePage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

function AppContent() {
  const { addNotification } = useNotification()
  useEffect(() => { setApiErrorHandler((msg) => addNotification('error', msg)) }, [addNotification])
  useEffect(() => { const { appearance } = loadSettings(); applyTheme(appearance.theme) }, [])
  return null
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/add" element={<AddProductPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/:id/edit" element={<EditProductPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/suppliers/add" element={<AddSupplierPage />} />
            <Route path="/purchases" element={<PurchasesPage />} />
            <Route path="/purchases/add" element={<AddPurchasePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastContainer />
      </NotificationProvider>
    </AuthProvider>
  )
}
