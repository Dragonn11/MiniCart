import { useState } from 'react';
import { useOrders, useInvalidateOrders } from '../hooks/useOrders';
import { Pagination } from '@shared/components/Pagination';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';

const statusColors: Record<string, string> = {
  pending: '#f5a623',
  processing: '#1a73e8',
  shipped: '#8e24aa',
  delivered: '#34a853',
};

export default function OrderHistoryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, isFetching } = useOrders(page);
  const invalidateOrders = useInvalidateOrders();

  if (isLoading) return <LoadingSpinner message="Loading orders..." />;
  if (error) return <div style={{ color: 'red', padding: '2rem' }}>Failed to load orders.</div>;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ margin: 0 }}>Order History</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {isFetching && <span style={{ color: '#999', fontSize: '0.85rem' }}>Refreshing...</span>}
          <button
            onClick={invalidateOrders}
            style={{
              background: '#f8f9fa',
              border: '1px solid #ddd',
              padding: '0.5rem 1rem',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {data && data.data.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '3rem' }}>No orders yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data?.data.map((order) => (
            <div
              key={order.id}
              style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: '1.25rem' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>Order #{order.id}</span>
                  <span style={{ color: '#666', marginLeft: '1rem', fontSize: '0.85rem' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <span
                  style={{
                    background: statusColors[order.status] + '20',
                    color: statusColors[order.status],
                    padding: '0.25rem 0.75rem',
                    borderRadius: 12,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}
                >
                  {order.status}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.9rem',
                      color: '#555',
                    }}
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  borderTop: '1px solid #e0e0e0',
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                }}
              >
                Total: ${order.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}

      {data && (
        <Pagination currentPage={page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
