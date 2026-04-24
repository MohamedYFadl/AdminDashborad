import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout }     from './components/layout/Layout';
import Dashboard      from './pages/Dashboard';
import Products       from './pages/Products';
import Orders         from './pages/Orders';
import Customers      from './pages/Customers';
import Analytics      from './pages/Analytics';
import Settings       from './pages/Settings';
import Notifications  from './pages/Notifications';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/"              element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"     element={<Dashboard />} />
            <Route path="/products"      element={<Products />} />
            <Route path="/orders"        element={<Orders />} />
            <Route path="/customers"     element={<Customers />} />
            <Route path="/analytics"     element={<Analytics />} />
            <Route path="/settings"      element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*"              element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
}
