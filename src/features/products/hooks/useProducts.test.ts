import { describe, it, expect } from 'vitest';
import { productKeys } from './useProducts';

describe('productKeys', () => {
  it('should generate correct query key for product list', () => {
    const filters = { search: 'headphones', page: 1 };
    const key = productKeys.list(filters);
    
    expect(key).toEqual(['products', 'list', filters]);
  });

  it('should generate correct query key for product detail', () => {
    const key = productKeys.detail('prod-123');
    
    expect(key).toEqual(['products', 'detail', 'prod-123']);
  });

  it('should generate list key without filters', () => {
    const key = productKeys.list();
    
    expect(key).toEqual(['products', 'list', undefined]);
  });
});
