import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useAddToCart } from '@features/cart/hooks/useCart';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id!);
  const addToCart = useAddToCart();

  const handleAddToCart = () => {
    if (!product) return;
    addToCart.mutate({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  if (isLoading) return <LoadingSpinner message="Loading product details..." />;
  if (error || !product) return <div style={{ padding: '2rem', color: 'red' }}>Product not found.</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontSize: '1rem', marginBottom: '1rem', padding: 0 }}>
        ← Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <img src={product.image} alt={product.name}
          style={{ width: '100%', borderRadius: 8, objectFit: 'cover', maxHeight: 400 }} />

        <div>
          <span style={{ background: '#e8f0fe', color: '#1a73e8', padding: '0.25rem 0.75rem', borderRadius: 12, fontSize: '0.85rem' }}>
            {product.category}
          </span>
          <h1 style={{ margin: '0.75rem 0 0.5rem' }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ color: '#f5a623', fontSize: '1.2rem' }}>★ {product.rating}</span>
            <span style={{ color: product.stock > 0 ? '#34a853' : '#ea4335' }}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <p style={{ color: '#555', lineHeight: 1.6 }}>{product.description}</p>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a73e8', margin: '1.5rem 0' }}>
            ${product.price.toFixed(2)}
          </div>
          <button onClick={handleAddToCart} disabled={product.stock === 0 || addToCart.isPending}
            style={{
              background: product.stock > 0 ? '#1a73e8' : '#ccc', color: '#fff', border: 'none',
              padding: '0.75rem 2rem', borderRadius: 8, fontSize: '1.1rem', cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
              width: '100%',
            }}>
            {addToCart.isPending ? 'Adding...' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
          {addToCart.isSuccess && <p style={{ color: '#34a853', marginTop: '0.5rem' }}>Added to cart!</p>}
        </div>
      </div>
    </div>
  );
}
