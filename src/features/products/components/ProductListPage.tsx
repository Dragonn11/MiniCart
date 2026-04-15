import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { Pagination } from '@shared/components/Pagination';

const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sortBy = (searchParams.get('sortBy') as 'price' | 'rating' | 'name') || 'name';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // memoize filters to avoid unnecessary refetches
  const filters = useMemo(() => ({
    search: search || undefined,
    category: category || undefined,
    sortBy,
    sortOrder: 'asc' as const,
    page,
    limit: 12, // 12 products per page
  }), [search, category, sortBy, page]);

  const { data, isLoading, error, isFetching } = useProducts(filters);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    // reset to page 1 when filters change
    if (key !== 'page') {
      params.delete('page');
    }
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Products</h1>
        {isFetching && <span style={{ color: '#999', fontSize: '0.85rem' }}>Refreshing...</span>}
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => updateParam('search', e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '0.6rem 1rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
        />
        <select value={category} onChange={(e) => updateParam('category', e.target.value)}
          style={{ padding: '0.6rem 1rem', border: '1px solid #ddd', borderRadius: 6 }}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => updateParam('sortBy', e.target.value)}
          style={{ padding: '0.6rem 1rem', border: '1px solid #ddd', borderRadius: 6 }}>
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      {isLoading && <LoadingSpinner message="Loading products..." />}
      {error && <div style={{ color: 'red', padding: '1rem' }}>Failed to load products. Please try again.</div>}

      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {data.data.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id}
              style={{ textDecoration: 'none', color: 'inherit', border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden', transition: 'box-shadow 0.2s', display: 'flex', flexDirection: 'column' }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem' }}>{product.name}</h3>
                <p style={{ color: '#666', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>{product.category}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1a73e8' }}>${product.price.toFixed(2)}</span>
                  <span style={{ color: '#f5a623' }}>★ {product.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {data && data.data.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>No products found matching your criteria.</p>
      )}

      {data && <Pagination currentPage={page} totalPages={data.totalPages} onPageChange={handlePageChange} />}
    </div>
  );
}
