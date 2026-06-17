import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { to: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/admin/orders', icon: 'shopping_bag', label: 'Kelola Pesanan' },
    { to: '/admin/products', icon: 'local_florist', label: 'Kelola Produk' },
    { to: '/admin/settings', icon: 'settings', label: 'Pengaturan' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-surface-container-low border-b border-outline-variant/30 px-6 py-4 flex justify-between items-center z-50">
        <span className="font-display-lg text-lg font-bold text-primary">Naya Admin</span>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-primary p-2 flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined">{isMobileOpen ? 'close' : 'menu'}</span>
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-[61px] md:top-0 left-0 w-full md:w-64 h-[calc(100vh-61px)] md:h-screen 
        bg-surface-container-low border-r border-outline-variant/30 p-6 flex flex-col justify-between 
        z-40 transition-transform duration-300 md:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-8">
          <div className="hidden md:block">
            <span className="font-display-lg text-2xl font-bold text-primary block">Naya Admin</span>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mt-1">Console Panel</span>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3 rounded-xl font-label-caps text-xs uppercase tracking-widest font-bold transition-all duration-300
                  ${isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'}
                `}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="border-t border-outline-variant/30 pt-4 flex flex-col gap-3">
          <div className="flex flex-col px-4 text-xs">
            <span className="text-on-surface-variant/70 font-semibold">Logged in as:</span>
            <span className="text-primary font-bold truncate mt-0.5" title={user?.email || ''}>
              {user?.email}
            </span>
          </div>

          {/* Link back to public storefront */}
          <Link
            to="/"
            className="flex items-center gap-4 px-4 py-2 font-label-caps text-[10px] text-secondary hover:text-primary transition-colors uppercase tracking-widest font-bold"
          >
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            Ke Toko Storefront
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-error hover:bg-error-container/10 font-label-caps text-xs uppercase tracking-widest font-bold text-left cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Keluar / Logout
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-h-[calc(100vh-61px)] md:max-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
