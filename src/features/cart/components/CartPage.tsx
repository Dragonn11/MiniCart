import { Link } from 'react-router-dom';
import { useCart, useUpdateCartQuantity, useRemoveFromCart } from '../hooks/useCart';
import { usePlaceOrder } from '@features/orders/hooks/useOrders';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';

export default function CartPage() {
  const { data: items, isLoading, error } = useCart();
  const updateQuantity = useUpdateCartQuantity();
  const removeItem = useRemoveFromCart();
  const placeOrder = usePlaceOrder();

  if (isLoading) return <LoadingSpinner message="Loading cart..." />;
  if (error) return <div style={{ color: 'red', padding: '2rem' }}>Failed to load cart.</div>;

  const cartItems = items || [];
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    placeOrder.mutate();
  };

  return (
    <div>
      <h1>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Your cart is empty.</p>
          <Link to="/products" style={{ color: '#1a73e8', textDecoration: 'none' }}>Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map((item) => (
              <div key={item.productId} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: 8 }}>
                <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.25rem' }}>{item.name}</h3>
                  <p style={{ margin: 0, color: '#1a73e8', fontWeight: 'bold' }}>${item.price.toFixed(2)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button onClick={() => updateQuantity.mutate({ productId: item.productId, quantity: Math.max(1, item.quantity - 1) })}
                    style={{ width: 32, height: 32, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer', background: '#fff' }}>−</button>
                  <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity.mutate({ productId: item.productId, quantity: item.quantity + 1 })}
                    style={{ width: 32, height: 32, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer', background: '#fff' }}>+</button>
                </div>
                <span style={{ fontWeight: 'bold', minWidth: 80, textAlign: 'right' }}>${(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeItem.mutate(item.productId)}
                  style={{ background: 'none', border: 'none', color: '#ea4335', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold' }}>Total: ${total.toFixed(2)}</p>
              <p style={{ margin: '0.25rem 0 0', color: '#666', fontSize: '0.85rem' }}>{cartItems.length} item(s)</p>
            </div>
            <button onClick={handlePlaceOrder} disabled={placeOrder.isPending}
              style={{ background: '#34a853', color: '#fff', border: 'none', padding: '0.75rem 2rem', borderRadius: 8, fontSize: '1.1rem', cursor: 'pointer' }}>
              {placeOrder.isPending ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
          {placeOrder.isSuccess && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#e6f4ea', borderRadius: 8, color: '#34a853', textAlign: 'center' }}>
              Order placed successfully! <Link to="/orders" style={{ color: '#1a73e8' }}>View Orders</Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
