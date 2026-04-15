import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useCart } from '@features/cart/hooks/useCart';
import { logger } from '@shared/services/logger';
import { UpdateNotification } from '@shared/components/UpdateNotification';

export function Layout() {
  const location = useLocation();
  const { data: cartItems } = useCart();
  const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // logs route changes as structured events
  useEffect(() => {
    logger.info('Route changed', { path: location.pathname, search: location.search });
  }, [location]);

  const linkStyle = (isActive: boolean) => ({
    color: isActive ? '#1a73e8' : '#333',
    textDecoration: 'none',
    fontWeight: isActive ? 'bold' as const : 'normal' as const,
    padding: '0.5rem 1rem',
    borderBottom: isActive ? '2px solid #1a73e8' : '2px solid transparent',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 60 }}>
          <NavLink to="/" style={{ textDecoration: 'none', fontSize: '1.4rem', fontWeight: 'bold', color: '#1a73e8' }}>
            🛒 MiniCart
          </NavLink>
          <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <NavLink to="/products" style={({ isActive }) => linkStyle(isActive)}>Products</NavLink>
            <NavLink to="/cart" style={({ isActive }) => linkStyle(isActive)}>
              Cart {cartCount > 0 && <span style={{ background: '#ea4335', color: '#fff', borderRadius: '50%', padding: '0.1rem 0.5rem', fontSize: '0.75rem', marginLeft: 4 }}>{cartCount}</span>}
            </NavLink>
            <NavLink to="/orders" style={({ isActive }) => linkStyle(isActive)}>Orders</NavLink>
          </nav>
        </div>
      </header>
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
        <Outlet />
      </main>
      <UpdateNotification />
    </div>
  );
}
