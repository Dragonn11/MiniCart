import { Product, Order, CartItem } from '@api/types';

const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];

// product names to make the data look more realistic
const productNames = [
  'Wireless Headphones', 'Smart Watch', 'Laptop Stand', 'USB-C Cable', 'Portable Charger',
  'Cotton T-Shirt', 'Denim Jeans', 'Running Shoes', 'Winter Jacket', 'Baseball Cap',
  'Science Fiction Novel', 'Cookbook', 'Biography', 'Programming Guide', 'Mystery Thriller',
  'Garden Hose', 'Plant Pot', 'LED Bulbs', 'Tool Kit', 'Kitchen Organizer',
  'Yoga Mat', 'Dumbbells', 'Tennis Racket', 'Basketball', 'Resistance Bands',
  'Bluetooth Speaker', 'Gaming Mouse', 'Mechanical Keyboard', 'Monitor', 'Webcam',
  'Hoodie', 'Sneakers', 'Backpack', 'Sunglasses', 'Watch',
  'Self-Help Book', 'Graphic Novel', 'Travel Guide', 'History Book', 'Poetry Collection',
  'Desk Lamp', 'Storage Bins', 'Picture Frame', 'Curtains', 'Throw Pillow',
  'Jump Rope', 'Water Bottle', 'Gym Bag', 'Fitness Tracker', 'Protein Shaker',
];

// generate 120 products for pagination demo
export const mockProducts: Product[] = Array.from({ length: 120 }, (_, i) => ({
  id: `prod-${i + 1}`,
  name: productNames[i % productNames.length] + ` ${Math.floor(i / productNames.length) + 1}`,
  description: `This is a detailed description for ${productNames[i % productNames.length]}. It features high quality materials and excellent craftsmanship. Perfect for everyday use.`,
  price: Math.round((Math.random() * 200 + 10) * 100) / 100,
  category: categories[i % categories.length],
  image: `https://picsum.photos/seed/product${i + 1}/400/300`, // using picsum for placeholder images
  rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // random rating between 3.0 and 5.0
  stock: Math.floor(Math.random() * 100),
}));

export let mockCart: CartItem[] = [
  { productId: 'prod-1', name: 'Product 1', price: mockProducts[0].price, quantity: 2, image: mockProducts[0].image },
  { productId: 'prod-3', name: 'Product 3', price: mockProducts[2].price, quantity: 1, image: mockProducts[2].image },
];

export let mockOrders: Order[] = Array.from({ length: 25 }, (_, i) => ({
  id: `order-${i + 1}`,
  items: [
    { productId: `prod-${(i % 5) + 1}`, name: `Product ${(i % 5) + 1}`, price: mockProducts[i % 5].price, quantity: Math.ceil(Math.random() * 3), image: mockProducts[i % 5].image },
  ],
  total: Math.round((Math.random() * 300 + 20) * 100) / 100,
  status: (['pending', 'processing', 'shipped', 'delivered'] as const)[i % 4],
  createdAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
}));

export function setMockCart(cart: CartItem[]) {
  mockCart = cart;
}

export function addMockOrder(order: Order) {
  mockOrders = [order, ...mockOrders];
}
