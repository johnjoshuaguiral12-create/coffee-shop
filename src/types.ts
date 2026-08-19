export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  customizations: {
    name: string;
    options: { name: string; price_modifier: number }[];
  }[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
  icon?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  customizations: { name: string; selectedOption: { name: string; price_modifier: number } }[];
  itemTotal: number;
}

export interface Order {
  id: string;
  orderId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'For Verification' | 'Paid' | 'Failed' | 'Refunded';
  orderStatus: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
  orderType: 'Pickup' | 'Delivery';
  address: string;
  notes: string;
  paymentReference: string;
  createdAt: string;
  updatedAt: string;
}

export interface Setting {
  id: string;
  webhookUrl: string;
  gcashQrUrl: string;
  gcashNumber: string;
}
