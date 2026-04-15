import { http, HttpResponse, delay } from 'msw';
import { mockProducts, mockCart, mockOrders, setMockCart, addMockOrder } from './data';
import type { CartItem } from '@api/types';

const BASE = '/api';

export const handlers = [
  // products endpoint with filtering, sorting, and pagination
  http.get(`${BASE}/products`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const category = url.searchParams.get('category') || '';
    const sortBy = url.searchParams.get('sortBy') || 'name';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '12', 10);

    let filtered = [...mockProducts];
    // filter by search term (name or description)
    if (search)
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search)
      );
    if (category) filtered = filtered.filter((p) => p.category === category);

    // sorting logic - handles both strings and numbers
    filtered.sort((a, b) => {
      const key = sortBy as keyof typeof a;
      const valA = a[key];
      const valB = b[key];
      if (typeof valA === 'string' && typeof valB === 'string')
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      if (typeof valA === 'number' && typeof valB === 'number')
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      return 0;
    });

    // pagination
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    return HttpResponse.json({
      data: paged,
      page,
      totalPages: Math.ceil(filtered.length / limit),
      totalItems: filtered.length,
    });
  }),

  // GET /api/products/:id
  http.get(`${BASE}/products/:id`, async ({ params }) => {
    await delay(200);
    const product = mockProducts.find((p) => p.id === params.id);
    if (!product)
      return HttpResponse.json(
        { message: 'Product not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    return HttpResponse.json(product);
  }),

  // GET /api/cart
  http.get(`${BASE}/cart`, async () => {
    await delay(150);
    return HttpResponse.json(mockCart);
  }),

  // POST /api/cart/items
  http.post(`${BASE}/cart/items`, async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as CartItem;
    const existing = mockCart.find((item) => item.productId === body.productId);
    if (existing) {
      existing.quantity += body.quantity;
    } else {
      mockCart.push(body);
    }
    setMockCart([...mockCart]);
    return HttpResponse.json(mockCart);
  }),

  // PUT /api/cart/items/:productId
  http.put(`${BASE}/cart/items/:productId`, async ({ params, request }) => {
    await delay(200);
    const body = (await request.json()) as { quantity: number };
    const item = mockCart.find((i) => i.productId === params.productId);
    if (!item)
      return HttpResponse.json({ message: 'Item not found', code: 'NOT_FOUND' }, { status: 404 });
    item.quantity = body.quantity;
    setMockCart([...mockCart]);
    return HttpResponse.json(mockCart);
  }),

  // DELETE /api/cart/items/:productId
  http.delete(`${BASE}/cart/items/:productId`, async ({ params }) => {
    await delay(200);
    setMockCart(mockCart.filter((i) => i.productId !== params.productId));
    return HttpResponse.json(mockCart);
  }),

  // GET /api/orders
  http.get(`${BASE}/orders`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '5', 10);
    const start = (page - 1) * limit;
    const paged = mockOrders.slice(start, start + limit);
    return HttpResponse.json({
      data: paged,
      page,
      totalPages: Math.ceil(mockOrders.length / limit),
      totalItems: mockOrders.length,
    });
  }),

  // POST /api/orders
  http.post(`${BASE}/orders`, async () => {
    await delay(400);
    const newOrder = {
      id: `order-${Date.now()}`,
      items: [...mockCart],
      total: mockCart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };
    addMockOrder(newOrder);
    setMockCart([]);
    return HttpResponse.json(newOrder, { status: 201 });
  }),
];
